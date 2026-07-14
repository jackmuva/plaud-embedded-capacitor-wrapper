/* global React, Icon */

const LINES = [
  { spk:'Marcus', color:'#000', t:'00:12', text:'Thanks everyone for making time. Before we dive in — quick temperature check. Are we all aligned that this quarter is about focus, not scope?' },
  { spk:'Priya',  color:'#C44A2A', t:'00:29', text:'Yes. I\'d go further — we don\'t need more features. We need to make the three we have feel inevitable.' },
  { spk:'Rohan',  color:'#2B4A6B', t:'00:48', text:'Agreed. I mapped our top three surfaces against usage. The recorder, the transcript view, and the summary card are doing ninety percent of the work.' },
  { spk:'Marcus', color:'#000', t:'01:12', text:'So let\'s commit to those three. Everything else goes behind a flag until H2.' },
  { spk:'Dana',   color:'#2F7D4A', t:'01:24', text:'One caveat. Enterprise has been asking about SOC2 Type II for eight weeks. That isn\'t a feature but it blocks revenue.' },
  { spk:'Marcus', color:'#000', t:'01:41', text:'Good call. Security track is separate from the feature freeze. Dana, can you own that?' },
  { spk:'Dana',   color:'#2F7D4A', t:'01:50', text:'Yes. I\'ll have a status readout by Friday.' },
];

function Transcript() {
  return (
    <div style={tStyles.wrap}>
      <div style={tStyles.toolbar}>
        <div style={tStyles.search}>
          <Icon name="search" size={14}/>
          <input placeholder="Search transcript" style={tStyles.input}/>
        </div>
        <div style={tStyles.toggle}>
          <button style={{...tStyles.toggleBtn, ...tStyles.toggleActive}}>Clean</button>
          <button style={tStyles.toggleBtn}>Verbatim</button>
        </div>
      </div>
      <div style={tStyles.lines}>
        {LINES.map((l,i)=>(
          <div key={i} style={tStyles.line}>
            <div style={tStyles.lineHead}>
              <span style={{...tStyles.avatar, background:l.color}}>{l.spk[0]}</span>
              <span style={tStyles.spk}>{l.spk}</span>
              <span style={tStyles.time}>{l.t}</span>
            </div>
            <p style={tStyles.text}>{l.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const tStyles = {
  wrap: { display:'flex', flexDirection:'column', gap:16, maxWidth:760 },
  toolbar: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 },
  search: { flex:1, display:'flex', alignItems:'center', gap:8, height:34, padding:'0 12px', background:'#fff', border:'1px solid rgba(0,0,0,0.1)', borderRadius:8, color:'var(--fg-3)' },
  input: { flex:1, border:'none', outline:'none', fontFamily:'inherit', fontSize:13, background:'transparent', color:'var(--fg-1)' },
  toggle: { display:'flex', background:'#F0F0F0', borderRadius:999, padding:3 },
  toggleBtn: { border:'none', background:'transparent', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--fg-2)' },
  toggleActive: { background:'#fff', color:'#000', fontWeight:600, boxShadow:'0 1px 2px rgba(0,0,0,0.06)' },
  lines: { display:'flex', flexDirection:'column', gap:18 },
  line: { display:'flex', flexDirection:'column', gap:6 },
  lineHead: { display:'flex', alignItems:'center', gap:10 },
  avatar: { width:24, height:24, borderRadius:'50%', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 },
  spk: { fontSize:13, fontWeight:600, color:'#000' },
  time: { fontSize:11, color:'var(--fg-3)', fontFamily:'var(--font-mono)' },
  text: { margin:0, paddingLeft:34, fontSize:14, lineHeight:1.6, color:'var(--fg-1)' },
};

window.Transcript = Transcript;
