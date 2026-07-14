/* global React, Icon */
const { useState: useStateRV } = React;

function RecordingView({ recording, onClose }) {
  const [tab, setTab] = useStateRV('summary');
  return (
    <div style={rvStyles.wrap}>
      <div style={rvStyles.header}>
        <button onClick={onClose} style={rvStyles.back}>← Library</button>
        <div style={rvStyles.headerActions}>
          <button style={rvStyles.iconBtn}><Icon name="share" size={15}/></button>
          <button style={rvStyles.iconBtn}><Icon name="download" size={15}/></button>
          <button style={rvStyles.iconBtn}><Icon name="more" size={15}/></button>
        </div>
      </div>
      <div style={rvStyles.titleBlock}>
        <div style={rvStyles.overline}>{recording.tag} · {recording.when}</div>
        <h1 style={rvStyles.title}>{recording.title}</h1>
        <div style={rvStyles.meta}>
          <span><Icon name="clock" size={13}/> {recording.dur}</span>
          <span>{recording.speakers} speakers</span>
          <span><Icon name="globe" size={13}/> English (US)</span>
          <span><span style={rvStyles.dotOK}/>Summary ready</span>
        </div>
      </div>
      <div style={rvStyles.player}>
        <button style={rvStyles.playBtn}><Icon name="play" size={18}/></button>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
          <div style={rvStyles.wave}>
            {Array.from({length:80}).map((_,i) => (
              <span key={i} style={{...rvStyles.waveBar, height:`${20+Math.abs(Math.sin(i*0.6)*60)+Math.abs(Math.cos(i*0.3)*20)}%`, background: i<22?'#000':'rgba(0,0,0,0.18)'}}/>
            ))}
          </div>
          <div style={rvStyles.timeline}>
            <span>09:42</span>
            <span>{recording.dur}</span>
          </div>
        </div>
        <button style={rvStyles.speed}>1.0×</button>
      </div>
      <div style={rvStyles.tabs}>
        {[['summary','Summary'],['transcript','Transcript'],['chat','Ask AI']].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} style={{...rvStyles.tab, ...(tab===k?rvStyles.tabActive:{})}}>{l}</button>
        ))}
      </div>
      <div style={rvStyles.panel}>
        {tab==='summary' && <window.Summary recording={recording}/>}
        {tab==='transcript' && <window.Transcript/>}
        {tab==='chat' && <window.AskAI recording={recording}/>}
      </div>
    </div>
  );
}

const rvStyles = {
  wrap: { padding:'24px 40px 0', display:'flex', flexDirection:'column', gap:16, height:'100%', overflow:'hidden' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  back: { background:'transparent', border:'none', fontFamily:'inherit', fontSize:13, color:'var(--fg-2)', cursor:'pointer', padding:'6px 0' },
  headerActions: { display:'flex', gap:6 },
  iconBtn: { width:34, height:34, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-2)' },
  titleBlock: { display:'flex', flexDirection:'column', gap:8, paddingBottom:4 },
  overline: { fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, color:'var(--fg-3)' },
  title: { fontSize:32, fontWeight:600, letterSpacing:'-0.02em', margin:0, lineHeight:1.1 },
  meta: { display:'flex', gap:16, fontSize:12, color:'var(--fg-3)', alignItems:'center', flexWrap:'wrap' },
  dotOK: { display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#2F7D4A', marginRight:6 },
  player: { display:'flex', alignItems:'center', gap:16, padding:'16px 18px', background:'#FAFAF8', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 },
  playBtn: { width:42, height:42, borderRadius:'50%', background:'#000', color:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', paddingLeft:3 },
  wave: { flex:1, display:'flex', gap:2, alignItems:'center', height:36 },
  waveBar: { display:'block', width:3, borderRadius:2, minHeight:3 },
  timeline: { display:'flex', justifyContent:'space-between', fontSize:11, fontFamily:'var(--font-mono)', color:'var(--fg-3)' },
  speed: { background:'#fff', border:'1px solid rgba(0,0,0,0.1)', borderRadius:6, padding:'6px 10px', fontFamily:'var(--font-mono)', fontSize:12, cursor:'pointer' },
  tabs: { display:'flex', gap:2, borderBottom:'1px solid rgba(0,0,0,0.08)' },
  tab: { background:'transparent', border:'none', padding:'10px 14px', fontFamily:'inherit', fontSize:13, fontWeight:500, color:'var(--fg-3)', cursor:'pointer', borderBottom:'2px solid transparent', marginBottom:-1 },
  tabActive: { color:'#000', fontWeight:600, borderBottomColor:'#000' },
  panel: { flex:1, overflowY:'auto', padding:'4px 0 32px' },
};

window.RecordingView = RecordingView;
