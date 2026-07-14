/* global React, Icon */
const { useState: useStateRB, useEffect: useEffectRB, useRef: useRefRB } = React;

function RecordBar({ open, onClose }) {
  const [sec, setSec] = useStateRB(0);
  const [bars, setBars] = useStateRB(Array(48).fill(20));
  const rafRef = useRefRB();
  useEffectRB(()=>{
    if(!open){ setSec(0); return; }
    const start = Date.now();
    const tick = () => {
      setSec(Math.floor((Date.now()-start)/1000));
      setBars(prev => {
        const next = [...prev.slice(1), 30+Math.random()*70];
        return next;
      });
      rafRef.current = setTimeout(tick, 80);
    };
    tick();
    return () => clearTimeout(rafRef.current);
  },[open]);
  if(!open) return null;
  const mm = String(Math.floor(sec/60)).padStart(2,'0');
  const ss = String(sec%60).padStart(2,'0');
  return (
    <div style={rbStyles.backdrop}>
      <div style={rbStyles.panel}>
        <div style={rbStyles.head}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={rbStyles.dot}/>
            <span style={rbStyles.label}>Recording</span>
            <span style={rbStyles.time}>{mm}:{ss}</span>
          </div>
          <button style={rbStyles.closeBtn} onClick={onClose}><Icon name="close" size={14}/></button>
        </div>
        <div style={rbStyles.wave}>
          {bars.map((h,i)=>(
            <span key={i} style={{...rbStyles.bar, height:`${h}%`, opacity: 0.5 + (i/bars.length)*0.5}}/>
          ))}
        </div>
        <div style={rbStyles.meta}>
          <span>Plaud Note · Connected</span>
          <span>EN · Auto-detect</span>
        </div>
        <div style={rbStyles.controls}>
          <button style={rbStyles.pause}><Icon name="pause" size={16}/> Pause</button>
          <button style={rbStyles.stop} onClick={onClose}><Icon name="stop" size={16}/> Stop &amp; save</button>
        </div>
      </div>
    </div>
  );
}

const rbStyles = {
  backdrop: { position:'absolute', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'flex-end', justifyContent:'center', padding:40, zIndex:50, backdropFilter:'blur(8px)' },
  panel: { width:'100%', maxWidth:560, background:'#fff', borderRadius:20, padding:24, display:'flex', flexDirection:'column', gap:16, boxShadow:'0 24px 60px rgba(0,0,0,0.25)' },
  head: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  dot: { width:10, height:10, borderRadius:'50%', background:'#FF4A1C', boxShadow:'0 0 0 5px rgba(255,74,28,0.18)', animation:'pulse 1.2s ease-in-out infinite' },
  label: { fontSize:12, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'#FF4A1C' },
  time: { fontFamily:'var(--font-mono)', fontSize:14, color:'#000', marginLeft:4 },
  closeBtn: { width:28, height:28, borderRadius:6, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  wave: { display:'flex', gap:3, alignItems:'center', height:80, padding:'8px 0' },
  bar: { display:'block', flex:1, background:'#000', borderRadius:3, minHeight:4, transition:'height 80ms linear' },
  meta: { display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--fg-3)', fontFamily:'var(--font-mono)' },
  controls: { display:'flex', gap:10 },
  pause: { flex:1, height:44, borderRadius:999, border:'1px solid rgba(0,0,0,0.15)', background:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8 },
  stop: { flex:2, height:44, borderRadius:999, border:'none', background:'#FF4A1C', color:'#fff', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:8 },
};

window.RecordBar = RecordBar;
