/* global React, Icon */
const { useState: useStateRL } = React;

const MOCK = [
  { id:1, title:'Q2 planning — leadership sync', when:'Today · 10:30', dur:'42:18', speakers:6, tag:'Meeting', summary:'Aligned on three H1 goals. Team expansion deferred to Q3 pending revenue milestone. Marketing to own launch positioning.' },
  { id:2, title:'Interview — Priya K., Head of Design', when:'Yesterday · 15:00', dur:'58:02', speakers:2, tag:'Interview', summary:'10y product design, led IA rework at Figma. Strong portfolio on AI-native tools. Reference check with M. Chen recommended.' },
  { id:3, title:'Econ 204 — Market structures', when:'Mon · 09:15', dur:'1:12:04', speakers:1, tag:'Lecture', summary:'Monopolistic competition vs. oligopoly. Game theory primer. Problem set due Friday.' },
  { id:4, title:'Walk — idea dump', when:'Sun · 18:22', dur:'08:41', speakers:1, tag:'Voice memo', summary:'Three product concepts for offline-first recording. Battery concern on 6-hour continuous capture.' },
  { id:5, title:'Board prep — fundraise narrative', when:'Sat · 11:00', dur:'33:10', speakers:3, tag:'Meeting', summary:'Narrative anchored on "memory infrastructure." Financial model shows 18-month runway.' },
  { id:6, title:'Customer call — Acme enterprise', when:'Fri · 14:00', dur:'47:55', speakers:4, tag:'Meeting', summary:'Legal review pending. SOC2 Type II is required. Pilot scoped to 40 seats.' },
];

function RecordingList({ onOpen }) {
  const [filter, setFilter] = useStateRL('All');
  const tags = ['All','Meeting','Interview','Lecture','Voice memo'];
  const list = filter==='All' ? MOCK : MOCK.filter(m=>m.tag===filter);
  return (
    <div style={listStyles.wrap}>
      <div style={listStyles.header}>
        <div>
          <div style={listStyles.overline}>Library</div>
          <h1 style={listStyles.title}>All recordings</h1>
        </div>
        <div style={listStyles.actions}>
          <button style={listStyles.iconBtn}><Icon name="search" size={16}/></button>
          <button style={listStyles.iconBtn}><Icon name="settings" size={16}/></button>
        </div>
      </div>
      <div style={listStyles.filters}>
        {tags.map(t => (
          <button key={t} onClick={()=>setFilter(t)} style={{...listStyles.chip, ...(filter===t?listStyles.chipActive:{})}}>{t}</button>
        ))}
      </div>
      <div style={listStyles.rows}>
        {list.map(r => (
          <button key={r.id} onClick={()=>onOpen(r)} style={listStyles.row}>
            <div style={listStyles.rowTop}>
              <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
                <span style={listStyles.tagPill}>{r.tag}</span>
                <span style={listStyles.rowTitle}>{r.title}</span>
              </div>
              <div style={listStyles.meta}>{r.when}</div>
            </div>
            <div style={listStyles.rowSummary}>{r.summary}</div>
            <div style={listStyles.rowFoot}>
              <span style={listStyles.footItem}><Icon name="clock" size={13}/>{r.dur}</span>
              <span style={listStyles.footItem}>{r.speakers} speakers</span>
              <span style={listStyles.footItem}><Icon name="check" size={13}/>Summary ready</span>
              <span style={{flex:1}}/>
              <span style={listStyles.open}>Open →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const listStyles = {
  wrap: { padding:'32px 40px', display:'flex', flexDirection:'column', gap:20, overflowY:'auto', height:'100%' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-end' },
  overline: { fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, color:'var(--fg-3)', marginBottom:6 },
  title: { fontSize:36, fontWeight:600, letterSpacing:'-0.02em', margin:0 },
  actions: { display:'flex', gap:6 },
  iconBtn: { width:36, height:36, borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--fg-2)' },
  filters: { display:'flex', gap:6, flexWrap:'wrap' },
  chip: { height:30, padding:'0 14px', borderRadius:999, border:'1px solid rgba(0,0,0,0.1)', background:'#fff', fontSize:12, fontWeight:500, cursor:'pointer', fontFamily:'inherit', color:'var(--fg-2)' },
  chipActive: { background:'#000', color:'#fff', borderColor:'#000' },
  rows: { display:'flex', flexDirection:'column', gap:8 },
  row: { textAlign:'left', padding:'18px 20px', background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:10, display:'flex', flexDirection:'column', gap:8, cursor:'pointer', fontFamily:'inherit', transition:'border-color 150ms' },
  rowTop: { display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 },
  tagPill: { fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', fontWeight:600, padding:'3px 8px', background:'#F0F0F0', color:'var(--fg-2)', borderRadius:4 },
  rowTitle: { fontSize:15, fontWeight:600, color:'#000', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  meta: { fontSize:12, color:'var(--fg-3)', fontFamily:'var(--font-mono)', whiteSpace:'nowrap' },
  rowSummary: { fontSize:13, color:'var(--fg-2)', lineHeight:1.55, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  rowFoot: { display:'flex', gap:16, alignItems:'center', fontSize:11, color:'var(--fg-3)' },
  footItem: { display:'inline-flex', alignItems:'center', gap:5 },
  open: { fontSize:12, fontWeight:600, color:'#000' },
};

window.RecordingList = RecordingList;
window.MOCK_RECORDINGS = MOCK;
