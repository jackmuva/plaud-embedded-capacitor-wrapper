import Foundation
import Capacitor
import PlaudDeviceBasicSDK

/// Capacitor bridge over Plaud's native iOS SDK.
///
/// Capacitor auto-registers any class that is `@objc`, subclasses `CAPPlugin`, and
/// conforms to `CAPBridgedPlugin` — but only for npm-installed plugins listed in
/// `capacitor.config.json`'s `packageClassList`. This one lives in a local SwiftPM
/// package, so it is registered by hand in `MainViewController.capacitorDidLoad()`.
/// The JS side reaches it via `registerPlugin('PlaudSdk')`.
///
/// Surface: connection lifecycle (`initSDK`/`startScan`/`stopScan`/`connectBleDevice`/
/// `disconnect`/`isConnected`), file listing (`getFileList`), and on-device audio
/// decode/export (`exportAudio`). SDK results are delivered either through the
/// `PlaudDeviceAgentProtocol` delegate (forwarded as plugin events) or, for export,
/// through a per-call `AudioExportCallback`.
@objc(PlaudSdk)
public class PlaudSdkPlugin: CAPPlugin, CAPBridgedPlugin, PlaudDeviceAgentProtocol {
    public let identifier = "PlaudSdk"
    public let jsName = "PlaudSdk"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "initSDK", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startScan", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopScan", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "connectBleDevice", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "disconnect", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "depair", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isConnected", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getFileList", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "exportAudio", returnType: CAPPluginReturnPromise)
    ]

    /// `connectBleDevice` needs the actual `BleDevice` the SDK handed us during a scan —
    /// JS only carries identifiers, so we retain the scanned objects and look them up.
    /// Keyed by `uuid` (the CoreBluetooth peripheral id). Touched only on the main queue.
    private var scannedDevices: [String: BleDevice] = [:]

    /// Retains in-flight export callback bridges so neither they nor their `CAPPluginCall`
    /// are deallocated before the SDK finishes. Touched only on the main queue.
    private var exportCallbacks: Set<ExportCallbackBridge> = []

    // MARK: - Connection lifecycle

    @objc func initSDK(_ call: CAPPluginCall) {
        guard let token = call.getString("userAccessToken"), !token.isEmpty else {
            call.reject("userAccessToken is required")
            return
        }
        guard let domain = call.getString("customDomain"), !domain.isEmpty else {
            call.reject("customDomain is required (domain only, no https://)")
            return
        }
        DispatchQueue.main.async {
            let agent = PlaudDeviceAgent.shared
            agent.delegate = self
            agent.initSDK(userAccessToken: token, customDomain: domain)
            call.resolve()
        }
    }

    @objc func startScan(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            PlaudDeviceAgent.shared.startScan()
            call.resolve()
        }
    }

    @objc func stopScan(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            PlaudDeviceAgent.shared.stopScan()
            call.resolve()
        }
    }

    /// Connect to a device surfaced by a prior `scanResult`, identified by `uuid`
    /// (preferred) or `serialNumber`. Connection progress arrives via the `connectState`
    /// and `penState` events. Pass an optional `deviceToken` for a pre-bound device.
    @objc func connectBleDevice(_ call: CAPPluginCall) {
        let uuid = call.getString("uuid")
        let serial = call.getString("serialNumber")
        let token = call.getString("deviceToken")
        DispatchQueue.main.async {
            guard let device = self.lookupDevice(uuid: uuid, serialNumber: serial) else {
                call.reject("Unknown device — scan first, then connect by uuid or serialNumber")
                return
            }
            if let token = token, !token.isEmpty {
                PlaudDeviceAgent.shared.connectBleDevice(bleDevice: device, deviceToken: token)
            } else {
                PlaudDeviceAgent.shared.connectBleDevice(bleDevice: device)
            }
            call.resolve()
        }
    }

    @objc func disconnect(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            PlaudDeviceAgent.shared.disconnect()
            call.resolve()
        }
    }

    /// Unpair (depair) the device. With `clear: true` (default) the SDK also clears the
    /// local pairing/binding state, so the next connect starts a fresh handshake. The
    /// result is reported asynchronously via the `depair` event.
    @objc func depair(_ call: CAPPluginCall) {
        let clear = call.getBool("clear") ?? true
        DispatchQueue.main.async {
            PlaudDeviceAgent.shared.depair(clear: clear)
            call.resolve()
        }
    }

    @objc func isConnected(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve(["connected": PlaudDeviceAgent.shared.isConnected()])
        }
    }

    // MARK: - Files

    /// Request the on-device recording list starting from `startSessionId` (default 0).
    /// Results arrive asynchronously via the `fileList` event.
    @objc func getFileList(_ call: CAPPluginCall) {
        let start = call.getInt("startSessionId") ?? 0
        DispatchQueue.main.async {
            PlaudDeviceAgent.shared.getFileList(startSessionId: start)
            call.resolve()
        }
    }

    /// Decode a recording and write it to the app's Documents/PlaudExports directory.
    /// Resolves with `{ outputPath, sessionId }` on completion; emits `exportProgress`
    /// events along the way. `format` is one of pcm|mp3|wav|opus (default mp3, which is
    /// playable by AVAudioPlayer and accepted by the transcription upload).
    @objc func exportAudio(_ call: CAPPluginCall) {
        guard let sessionId = call.getInt("sessionId") else {
            call.reject("sessionId is required")
            return
        }
        let format = Self.exportFormat(from: call.getString("format"))
        let channels = call.getInt("channels") ?? 1
        DispatchQueue.main.async {
            let dir = FileManager.default
                .urls(for: .documentDirectory, in: .userDomainMask)[0]
                .appendingPathComponent("PlaudExports", isDirectory: true)
            try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)

            let bridge = ExportCallbackBridge(sessionId: sessionId, call: call, plugin: self)
            self.exportCallbacks.insert(bridge)
            PlaudDeviceAgent.shared.exportAudio(
                sessionId: sessionId,
                outputDir: dir.path,
                format: format,
                channels: channels,
                callback: bridge
            )
        }
    }

    // MARK: - PlaudDeviceAgentProtocol

    // Required member. Surfaces the handshake / pen state to JS.
    public func blePenState(state: Int, privacy: Int, keyState: Int, uDisk: Int,
                            findMyToken: Int, hasSndpKey: Int, deviceAccessToken: Int) {
        notify("penState", [
            "state": state,
            "privacy": privacy,
            "keyState": keyState,
            "uDisk": uDisk,
            "findMyToken": findMyToken,
            "hasSndpKey": hasSndpKey,
            "deviceAccessToken": deviceAccessToken
        ])
    }

    public func bleScanResult(bleDevices: [BleDevice]) {
        DispatchQueue.main.async {
            for d in bleDevices { self.scannedDevices[d.uuid] = d }
        }
        let devices = bleDevices.map { d -> [String: Any] in
            [
                "name": d.name,
                "uuid": d.uuid,
                "serialNumber": d.serialNumber,
                "rssi": d.rssi,
                "supportWiFi": d.supportWiFi
            ]
        }
        notify("scanResult", ["devices": devices])
    }

    public func bleScanOverTime() {
        notify("scanTimeout", [:])
    }

    public func bleConnectState(state: Int) {
        // 1 = connected, 0 = disconnected
        notify("connectState", ["connected": state == 1, "state": state])
    }

    public func bleBind(sn: String?, status: Int, protVersion: Int, timezone: Int) {
        notify("bind", ["sn": sn as Any, "status": status, "protVersion": protVersion])
    }

    public func bleDepair(_ status: Int) {
        notify("depair", ["status": status])
    }

    public func bleFileList(bleFiles: [BleFile]) {
        let files = bleFiles.map { f -> [String: Any] in
            [
                "sn": f.sn,
                "sessionId": f.sessionId,
                "size": f.size,
                "scenes": f.scenes,
                "channels": f.channels,
                "isOgg": f.isOgg,
                "isMusic": f.isMusic,
                "duration": f.duration()
            ]
        }
        notify("fileList", ["files": files])
    }

    // MARK: - Helpers

    private func lookupDevice(uuid: String?, serialNumber: String?) -> BleDevice? {
        if let uuid = uuid, let d = scannedDevices[uuid] { return d }
        if let serial = serialNumber {
            return scannedDevices.values.first { $0.serialNumber == serial }
        }
        return nil
    }

    private static func exportFormat(from raw: String?) -> AudioExportFormat {
        switch (raw ?? "mp3").lowercased() {
        case "pcm": return .pcm
        case "wav": return .wav
        case "opus": return .opus
        default: return .mp3
        }
    }

    fileprivate func notify(_ event: String, _ data: [String: Any]) {
        DispatchQueue.main.async { [weak self] in
            self?.notifyListeners(event, data: data)
        }
    }

    fileprivate func finishExport(_ bridge: ExportCallbackBridge) {
        DispatchQueue.main.async { [weak self] in
            self?.exportCallbacks.remove(bridge)
        }
    }
}

/// Adapts the SDK's per-call `AudioExportCallback` to the plugin: progress becomes an
/// `exportProgress` event, and completion/error resolves/rejects the originating call.
private final class ExportCallbackBridge: NSObject, AudioExportCallback {
    private let sessionId: Int
    private let call: CAPPluginCall
    private weak var plugin: PlaudSdkPlugin?

    init(sessionId: Int, call: CAPPluginCall, plugin: PlaudSdkPlugin) {
        self.sessionId = sessionId
        self.call = call
        self.plugin = plugin
    }

    func onProgress(_ progress: Int, message: String) {
        plugin?.notify("exportProgress", [
            "sessionId": sessionId, "progress": progress, "message": message
        ])
    }

    func onComplete(outputPath: String) {
        call.resolve(["sessionId": sessionId, "outputPath": outputPath])
        plugin?.finishExport(self)
    }

    func onError(_ error: String) {
        call.reject(error)
        plugin?.finishExport(self)
    }
}
