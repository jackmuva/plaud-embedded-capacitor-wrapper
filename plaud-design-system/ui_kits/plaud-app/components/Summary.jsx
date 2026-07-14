/* global React, Icon */

function Summary({ recording }) {
  return (
    <div style={sumStyles.wrap}>
      <div style={sumStyles.card}>
        <div style={sumStyles.overline}>TL;DR</div>
        <p style={sumStyles.body}>{recording.summary}</p>
      </div>
      <div style={sumStyles.grid}>
        <div style={sumStyles.col}>
          <div style={sumStyles.label}>Key decisions</div>
          <ul style={sumStyles.list}>
            <li>Three H1 goals locked: activation, retention, enterprise readiness.</li>
            <li>Team expansion deferred to Q3 pending revenue milestone of $4M ARR.</li>
            <li>Marketing owns end-to-end launch positioning for Plaud NotePin.</li>
          </ul>
        </div>
        <div style={sumStyles.col}>
          <div style={sumStyles.label}>Action items</div>
          <ul style={sumStyles.checklist}>
            <li><span style={sumStyles.check}/><div><div style={sumStyles.act}>Draft H1 goal memo</div><div style={sumStyles.actMeta}>R. Chen · Fri</div></div></li>
            <li><span style={sumStyles.check}/><div><div style={sumStyles.act}>Revenue model w/ Q3 gating</div><div style={sumStyles.actMeta}>Finance · next Tue</div></div></li>
            <li><span style={sumStyles.check}/><div><div style={sumStyles.act}>Launch narrative v1</div><div style={sumStyles.actMeta}>Marketing · Apr 28</div></div></li>
            <li><span style={sumStyles.check}/><div><div style={sumStyles.act}>SOC2 Type II status check</div><div style={sumStyles.actMeta}>Security · this wk</div></div></li>
          </ul>
        </div>
      </div>
      <div style={sumStyles.quotes}>
        <div style={sumStyles.label}>Notable quotes</div>
        <blockquote style={sumStyles.quote}>
          "We don't need more features. We need to make the three we have feel inevitable."
          <cite style={sumStyles.cite}>— Priya, 14:22</cite>
        </blockquote>
        <blockquote style={sumStyles.quote}>
          "Memory infrastructure is the pitch. Everything else is a symptom of it."
          <cite style={sumStyles.cite}>— Marcus, 28:40</cite>
        </blockquote>
      </div>
    </div>
  );
}

const sumStyles = {
  wrap: { display:'flex', flexDirection:'column', gap:20, maxWidth:760 },
  card: { padding:'20px 24px', background:'#F5F2EC', borderRadius:12 },
  overline: { fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, color:'var(--fg-3)', marginBottom:8 },
  body: { margin:0, fontSize:15, lineHeight:1.6, color:'#000' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 },
  col: { padding:'18px 22px', background:'#fff', border:'1px solid rgba(0,0,0,0.08)', borderRadius:10 },
  label: { fontSize:11, fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--fg-2)', marginBottom:12 },
  list: { margin:0, paddingLeft:18, display:'flex', flexDirection:'column', gap:8, fontSize:13, lineHeight:1.55, color:'var(--fg-2)' },
  checklist: { listStyle:'none', margin:0, padding:0, display:'flex', flexDirection:'column', gap:10 },
  check: { width:16, height:16, borderRadius:4, border:'1.5px solid rgba(0,0,0,0.2)', flexShrink:0, marginTop:2 },
  act: { fontSize:13, color:'#000', fontWeight:500 },
  actMeta: { fontSize:11, color:'var(--fg-3)', marginTop:2 },
  quotes: { padding:'20px 24px', border:'1px solid rgba(0,0,0,0.08)', borderRadius:10 },
  quote: { margin:'12px 0 0', padding:'0 0 0 14px', borderLeft:'2px solid #000', fontSize:14, lineHeight:1.5, color:'var(--fg-1)', fontStyle:'italic' },
  cite: { display:'block', marginTop:6, fontSize:11, color:'var(--fg-3)', fontStyle:'normal' },
};
/* add list-item alignment */
sumStyles.checklist.alignItems = 'flex-start';

window.Summary = function(props){ return <Summary {...props}/>; };
