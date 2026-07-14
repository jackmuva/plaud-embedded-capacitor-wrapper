/* global React, Icon */
const { useState: useStateAI } = React;

function AskAI({ recording }) {
  const suggestions = [
    'Summarize the key decisions',
    'List all action items with owners',
    'What did Priya say about focus?',
    'Draft a follow-up email',
  ];
  const [msgs, setMsgs] = useStateAI([
    { role:'ai', text:`I've read all ${recording.dur} of "${recording.title}". Ask me anything about the conversation.` },
  ]);
  const [v, setV] = useStateAI('');
  function send(text){
    const t = text || v;
    if(!t.trim()) return;
    setMsgs(m => [...m,{role:'user',text:t},{role:'ai',text:'The three H1 goals agreed were: activation, retention, and enterprise readiness. Team expansion was deferred to Q3 pending a $4M ARR milestone. Dana will own the SOC2 Type II security track with a status readout by Friday.'}]);
    setV('');
  }
  return (
    <div style={aiStyles.wrap}>
      <div style={aiStyles.thread}>
        {msgs.map((m,i)=>(
          <div key={i} style={{...aiStyles.msg, ...(m.role==='user'?aiStyles.user:aiStyles.ai)}}>
            {m.role==='ai' && <div style={aiStyles.avatar}><Icon name="sparkle" size={14}/></div>}
            <div style={m.role==='user'?aiStyles.bubbleUser:aiStyles.bubbleAI}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={aiStyles.suggestions}>
        {suggestions.map(s => <button key={s} onClick={()=>send(s)} style={aiStyles.sugg}>{s}</button>)}
      </div>
      <div style={aiStyles.composer}>
        <input value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about this recording…" style={aiStyles.composerInput}/>
        <button onClick={()=>send()} style={aiStyles.sendBtn}><Icon name="send" size={16}/></button>
      </div>
    </div>
  );
}

const aiStyles = {
  wrap: { display:'flex', flexDirection:'column', gap:14, maxWidth:760, minHeight:'100%' },
  thread: { display:'flex', flexDirection:'column', gap:14 },
  msg: { display:'flex', gap:10, alignItems:'flex-start' },
  ai: { justifyContent:'flex-start' },
  user: { justifyContent:'flex-end' },
  avatar: { width:28, height:28, borderRadius:'50%', background:'#000', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  bubbleAI: { background:'#F5F2EC', padding:'12px 16px', borderRadius:14, fontSize:14, lineHeight:1.55, color:'#000', maxWidth:'80%' },
  bubbleUser: { background:'#000', color:'#fff', padding:'12px 16px', borderRadius:14, fontSize:14, lineHeight:1.55, maxWidth:'80%' },
  suggestions: { display:'flex', flexWrap:'wrap', gap:6 },
  sugg: { border:'1px solid rgba(0,0,0,0.12)', background:'#fff', borderRadius:999, padding:'6px 12px', fontSize:12, cursor:'pointer', fontFamily:'inherit', color:'var(--fg-2)' },
  composer: { display:'flex', gap:8, alignItems:'center', padding:8, border:'1px solid rgba(0,0,0,0.12)', borderRadius:12, background:'#fff' },
  composerInput: { flex:1, border:'none', outline:'none', fontFamily:'inherit', fontSize:14, padding:'6px 8px', background:'transparent' },
  sendBtn: { width:36, height:36, borderRadius:8, background:'#000', color:'#fff', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
};

window.AskAI = AskAI;
