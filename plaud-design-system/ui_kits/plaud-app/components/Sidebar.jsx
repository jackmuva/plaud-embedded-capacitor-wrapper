/* global React, Icon */
const { useState } = React;

function Sidebar({ active, onNav }) {
  const primary = [
    { id: 'search', icon: 'search', label: 'Search' },
    { id: 'home',   icon: 'home',   label: 'Home', active: true },
    { id: 'notes',  icon: 'file',   label: 'Notes', badge: '功能' },
    { id: 'ask',    icon: 'ai',     label: 'Ask Plaud' },
    { id: 'comm',   icon: 'people', label: 'Community' },
    { id: 'mgmt',   icon: 'grid',   label: 'Management' },
  ];
  const libraries = [
    { id: 'all',  label: 'All files',        count: 366 },
    { id: 'unc',  label: 'Uncategorized',    count: 2069 },
    { id: 'bin',  label: 'Recycle bin',      count: 29 },
  ];
  const tags = [
    { id: 't1', label: 'Note — Transcript', count: 237, dot: '#00D0FF' },
    { id: 't2', label: 'Note — Call',       count: 122, dot: '#21EF6A' },
    { id: 't3', label: 'NotePin',           count: 26,  dot: '#8F53ED' },
    { id: 't4', label: 'Note Pro',          count: 3,   dot: '#FF4A1C' },
    { id: 't5', label: 'Imported',          count: 9,   dot: '#A8ADB3' },
    { id: 't6', label: 'Desktop',           count: 5,   dot: '#2CA3FF' },
  ];

  return (
    <aside style={sbStyles.wrap}>
      <div style={sbStyles.brand}>
        <img src="../../assets/logo-wordmark-black.png" alt="Plaud" style={{height:14}}/>
      </div>

      <button style={sbStyles.account}>
        <div style={sbStyles.avatar}>S</div>
        <span style={{flex:1,textAlign:'left'}}>stella</span>
        <Icon name="chev" size={12}/>
      </button>

      <button style={sbStyles.addMember}>
        <Icon name="plus" size={13}/> Add member
      </button>

      <nav style={sbStyles.nav}>
        {primary.map(i => (
          <button key={i.id} style={{...sbStyles.item, ...(i.active?sbStyles.itemActive:{})}}>
            <Icon name={i.icon} size={15}/>
            <span style={{flex:1,textAlign:'left'}}>{i.label}</span>
            {i.badge && <span style={sbStyles.fnBadge}>{i.badge}</span>}
          </button>
        ))}
      </nav>

      <div style={sbStyles.section}>
        {libraries.map(l => (
          <button key={l.id} style={sbStyles.item}>
            <Icon name="folder" size={15}/>
            <span style={{flex:1,textAlign:'left'}}>{l.label}</span>
            <span style={sbStyles.count}>{l.count}</span>
          </button>
        ))}
      </div>

      <div style={sbStyles.tagHead}>
        <span style={{flex:1}}>Tags</span>
        <Icon name="plus" size={12}/>
      </div>
      <div style={sbStyles.section}>
        {tags.map(t => (
          <button key={t.id} style={sbStyles.item}>
            <span style={{...sbStyles.dot, background:t.dot}}/>
            <span style={{flex:1,textAlign:'left'}}>{t.label}</span>
            <span style={sbStyles.count}>{t.count}</span>
          </button>
        ))}
      </div>

      <div style={{flex:1}}/>

      <div style={sbStyles.backer}>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,fontWeight:600}}>
          <Icon name="spark" size={13}/> Backer
          <span style={{marginLeft:'auto',color:'var(--fg-3)',fontWeight:400}}>›</span>
        </div>
        <div style={{fontSize:10,color:'var(--fg-3)',marginTop:4}}>600 min remaining</div>
      </div>
      <button style={sbStyles.upgrade}>Upgrade</button>
    </aside>
  );
}

const sbStyles = {
  wrap: { width: 208, background:'#FAFAF8', borderRight:'1px solid rgba(0,0,0,0.06)', padding:'16px 10px', display:'flex', flexDirection:'column', gap:6, height:'100%', fontFamily:'var(--font-ui)' },
  brand: { padding:'2px 8px 10px' },
  account: { display:'flex', alignItems:'center', gap:8, padding:'6px 8px', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, color:'#000' },
  avatar: { width:22, height:22, borderRadius:5, background:'#000', color:'#fff', fontSize:11, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' },
  addMember: { display:'flex', alignItems:'center', justifyContent:'center', gap:6, height:30, margin:'4px 0 10px', background:'#fff', border:'1px solid rgba(0,0,0,0.12)', borderRadius:5, fontSize:12, color:'#000', cursor:'pointer', fontFamily:'inherit' },
  nav: { display:'flex', flexDirection:'column', gap:1 },
  item: { display:'flex', alignItems:'center', gap:9, padding:'7px 8px', borderRadius:5, background:'transparent', border:'none', color:'var(--fg-2)', cursor:'pointer', fontSize:12.5, fontFamily:'inherit', textAlign:'left' },
  itemActive: { background:'rgba(0,0,0,0.05)', color:'#000', fontWeight:500 },
  count: { fontSize:11, color:'var(--fg-3)', fontVariantNumeric:'tabular-nums' },
  fnBadge: { fontSize:9, padding:'1px 5px', borderRadius:3, background:'#00D0FF', color:'#000', fontWeight:600 },
  section: { display:'flex', flexDirection:'column', gap:1, marginTop:6 },
  tagHead: { display:'flex', alignItems:'center', gap:6, padding:'10px 8px 4px', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-3)', fontWeight:600 },
  dot: { width:8, height:8, borderRadius:'50%' },
  backer: { padding:'8px 10px', background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:5, marginTop:8 },
  upgrade: { height:32, marginTop:6, background:'#000', color:'#fff', border:'none', borderRadius:5, fontSize:12.5, fontWeight:600, fontFamily:'inherit', cursor:'pointer' },
};

window.Sidebar = Sidebar;
