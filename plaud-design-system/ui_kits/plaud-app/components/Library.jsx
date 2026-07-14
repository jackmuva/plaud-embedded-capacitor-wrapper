/* global React, Icon */

function Library() {
  const recents = [
    { title: '03-11 Meeting · 2C Data Security Platform — Azure tech rollout overseas video plan', dur: '32m 32s', date: '2026-03-10 14:23:18' },
    { title: '02-09 Meeting · Marketing conference takeaways — brand awareness, design week',       dur: '3m 22s',  date: '2026-03-08 15:00:18' },
    { title: '2026-01-24 23:49:06', dur: '64m 58s', date: '2026-02-10 11:40:41' },
    { title: '2026-01-29 07:38:41', dur: '2m 7s',   date: '2026-02-10 11:34:51' },
    { title: '2026-01-29 08:18:46', dur: '18m 20s', date: '2026-02-10 11:34:35' },
  ];

  const whatsNew = [
    { tag: 'Product', title: 'Plaud Desktop — now available', body: 'Purchase members get instant download access.', bg: 'linear-gradient(135deg,#E8E4DC,#D4CFC4)' },
    { tag: 'Release', title: 'Plaud Intelligence 3.0 rollout',  body: 'Global gradual rollout. Sign in to check your tier.', bg: 'linear-gradient(135deg,#D8EFFB,#E8F5E9)' },
    { tag: 'Hardware', title: 'Note Pro — pre-order opens',    body: 'Latest Note Pro. Upgraded recording quality.', bg: 'linear-gradient(135deg,#1F1F1F,#3A3A3A)', dark:true },
  ];

  const community = [
    { title: 'Meeting Assistant',       author: '0617 · KM1',            color:'#21EF6A' },
    { title: 'Full Transcription',      author: '9634 · Michele Morgane', color:'#00D0FF' },
    { title: 'Detailed Summary',        author: '8213 · Richard of VBA',  color:'#8F53ED' },
    { title: 'Highlights · Decisions',  author: '9193 · JvX',             color:'#FF4A1C' },
    { title: 'University Course Notes', author: '5994 · Siliva',          color:'#FFB547' },
  ];

  return (
    <div style={{flex:1, overflow:'auto', padding:'28px 40px 60px', background:'#fff'}}>
      {/* Recent */}
      <Section title="Recent files" action="View all">
        <div style={lbStyles.rows}>
          {recents.map((r,i) => (
            <div key={i} style={lbStyles.row}>
              <div style={lbStyles.rowTitle}>{r.title}</div>
              <div style={lbStyles.rowDur}>{r.dur}</div>
              <div style={lbStyles.rowDate}>{r.date}</div>
              <button style={lbStyles.rowMore}><Icon name="more" size={14}/></button>
            </div>
          ))}
        </div>
      </Section>

      <div style={{height:36}}/>

      {/* What's new */}
      <Section title="What's new">
        <div style={lbStyles.newsGrid}>
          {whatsNew.map((n,i)=>(
            <article key={i} style={lbStyles.newsCard}>
              <div style={{...lbStyles.newsMedia, background:n.bg, color:n.dark?'#fff':'#000'}}>
                {i===1 && <WaveArt/>}
                {i===2 && <DeviceArt/>}
                {i===0 && <DesktopArt/>}
              </div>
              <div style={lbStyles.newsBody}>
                <div style={lbStyles.newsTag}>{n.tag}</div>
                <div style={lbStyles.newsTitle}>{n.title}</div>
                <div style={lbStyles.newsCopy}>{n.body}</div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <div style={{height:36}}/>

      {/* Community */}
      <Section title="Plaud Community" action="View all">
        <div style={lbStyles.commGrid}>
          {community.map((c,i)=>(
            <article key={i} style={lbStyles.commCard}>
              <div style={{...lbStyles.commDot, background:c.color}}/>
              <div style={lbStyles.commTitle}>{c.title}</div>
              <div style={lbStyles.commBody}>Community-shared prompt template.</div>
              <div style={lbStyles.commFoot}>
                <span style={lbStyles.commAvatar}>{c.author.split(' · ')[1]?.[0] || 'P'}</span>
                <span>{c.author}</span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({title, action, children}){
  return (
    <section>
      <header style={lbStyles.sectionHead}>
        <h2 style={lbStyles.sectionTitle}>{title}</h2>
        {action && <button style={lbStyles.sectionAction}>{action} <span style={{fontSize:11}}>›</span></button>}
      </header>
      {children}
    </section>
  );
}

function WaveArt(){
  const bars = Array.from({length:32},(_,i)=> 20 + Math.abs(Math.sin(i*0.6))*60);
  return (
    <div style={{display:'flex',alignItems:'center',gap:3,height:'100%',padding:'0 16px'}}>
      {bars.map((h,i)=>(<span key={i} style={{width:2,height:`${h}%`,background:`linear-gradient(180deg, ${i<8?'#21EF6A':i<20?'#2CA3FF':'#8F53ED'}, rgba(0,0,0,0.1))`,borderRadius:2}}/>))}
    </div>
  );
}
function DeviceArt(){
  return <div style={{width:40,height:78,background:'linear-gradient(180deg,#3A3A3A,#0A0A0A)',borderRadius:5,margin:'auto',boxShadow:'0 6px 18px rgba(0,0,0,0.4)'}}/>;
}
function DesktopArt(){
  return <div style={{width:'72%',height:'66%',background:'#fff',borderRadius:5,margin:'auto',border:'1px solid rgba(0,0,0,0.08)',display:'flex'}}>
    <div style={{width:'22%',background:'#FAFAF8',borderRight:'1px solid rgba(0,0,0,0.06)'}}/>
    <div style={{flex:1,padding:6,display:'flex',flexDirection:'column',gap:3}}>
      <span style={{height:4,background:'#000',width:'40%',borderRadius:2}}/>
      {[1,2,3].map(i=><span key={i} style={{height:3,background:'rgba(0,0,0,0.15)',borderRadius:2}}/>)}
    </div>
  </div>;
}

const lbStyles = {
  sectionHead: { display:'flex',alignItems:'baseline', gap:12, marginBottom:14 },
  sectionTitle: { fontSize:15, fontWeight:600, color:'#000', margin:0, fontFamily:'var(--font-ui)', letterSpacing:'-0.01em' },
  sectionAction: { marginLeft:'auto', background:'none', border:'none', fontSize:12, color:'var(--fg-3)', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 },
  rows: { display:'flex', flexDirection:'column' },
  row: { display:'grid', gridTemplateColumns:'1fr 90px 150px 28px', alignItems:'center', gap:16, padding:'12px 2px', borderBottom:'1px solid rgba(0,0,0,0.05)', fontFamily:'var(--font-ui)', fontSize:12.5 },
  rowTitle: { color:'#000', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
  rowDur: { color:'var(--fg-3)', fontVariantNumeric:'tabular-nums' },
  rowDate: { color:'var(--fg-3)', fontVariantNumeric:'tabular-nums' },
  rowMore: { background:'none', border:'none', color:'var(--fg-3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  newsGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 },
  newsCard: { background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:5, overflow:'hidden', display:'flex', flexDirection:'column' },
  newsMedia: { height:120, display:'flex', alignItems:'center', justifyContent:'center' },
  newsBody: { padding:'10px 12px 14px', fontFamily:'var(--font-ui)' },
  newsTag: { fontSize:9, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-3)' },
  newsTitle: { fontSize:13, fontWeight:600, color:'#000', margin:'4px 0 4px' },
  newsCopy: { fontSize:11.5, color:'var(--fg-2)', lineHeight:1.45 },
  commGrid: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10 },
  commCard: { background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:5, padding:'12px 12px 10px', display:'flex', flexDirection:'column', gap:6, fontFamily:'var(--font-ui)' },
  commDot: { width:22, height:22, borderRadius:5, marginBottom:2 },
  commTitle: { fontSize:12.5, fontWeight:600, color:'#000' },
  commBody: { fontSize:11, color:'var(--fg-2)', lineHeight:1.45, flex:1 },
  commFoot: { display:'flex', alignItems:'center', gap:6, fontSize:10, color:'var(--fg-3)', marginTop:4, paddingTop:8, borderTop:'1px solid rgba(0,0,0,0.04)' },
  commAvatar: { width:14, height:14, borderRadius:3, background:'#000', color:'#fff', fontSize:8, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' },
};

window.Library = Library;
