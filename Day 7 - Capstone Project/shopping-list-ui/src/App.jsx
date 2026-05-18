import { useState, useEffect, useRef } from "react";

const API = "http://localhost:8080";
const AUTH = "Basic " + btoa("admin:1234");
const AH = { "Content-Type": "application/json", Authorization: AUTH };

const EMOJI = {
  "ירקות ופירות": "🥦", "מוצרי חלב": "🥛", "בשר ודגים": "🥩",
  "לחם ומאפים": "🍞", "שימורים וחטיפים": "🥫", "משקאות": "🧃",
  "ניקיון והיגיינה": "🧼", "אחר": "📦",
};
const em = (name) => EMOJI[name] || "📦";

async function req(path, opts = {}) {
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "שגיאה"); }
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  getProducts:        ()              => req("/products"),
  getCategories:      ()              => req("/categories"),
  addProduct:         (b)             => req("/products", { method: "POST", headers: AH, body: JSON.stringify(b) }),
  deleteProduct:      (id)            => req(`/products/${id}`, { method: "DELETE", headers: AH }),
  toggleStatus:       (id)            => req("/products/status", { method: "PUT", headers: AH, body: JSON.stringify({ id }) }),
  updateName:         (id, name)      => req("/products/name", { method: "PUT", headers: AH, body: JSON.stringify({ id, name }) }),
  updateNote:         (id, note)      => req("/products/note", { method: "PUT", headers: AH, body: JSON.stringify({ id, note }) }),
  updateCategory:     (id, cid)       => req("/products/category", { method: "PUT", headers: AH, body: JSON.stringify({ id, category: { id: cid } }) }),
  updateQuantity:     (id, quantity)  => req("/products/quantity", { method: "PUT", headers: AH, body: JSON.stringify({ id, quantity }) }),
  getSuggestions:     (q)             => req(`/products/suggestions?query=${encodeURIComponent(q)}`),
  addCategory:        (name)          => req("/categories", { method: "POST", headers: AH, body: JSON.stringify({ name }) }),
  updateCategoryName: (id, name)      => req(`/categories/${id}`, { method: "PUT", headers: AH, body: JSON.stringify({ name }) }),
  deleteCategory:     (id)            => req(`/categories/${id}`, { method: "DELETE", headers: AH }),
};

export default function App() {
  const [tab, setTab]           = useState("list");
  const [products, setProducts] = useState([]);
  const [cats, setCats]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true); setError(null);
    try {
      const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(Array.isArray(p) ? p : []);
      setCats(Array.isArray(c) ? c : []);
    } catch { setError("לא ניתן להתחבר לשרת. ודא שSpring Boot רץ."); }
    finally { setLoading(false); }
  }

  return (
      <div style={st.page}>
        <style>{css}</style>
        <header style={st.header}>
          <span style={st.logo}>🛒 Smart Cart</span>
          <div style={st.tabs}>
            {[["list","רשימה"],["cats","קטגוריות"]].map(([k,l]) => (
                <button key={k} style={{...st.tab,...(tab===k?st.tabOn:{})}} onClick={()=>setTab(k)}>{l}</button>
            ))}
          </div>
        </header>
        <main style={st.main}>
          {error   ? <Err msg={error} retry={load} /> :
              loading ? <Spinner /> :
                  tab==="list" ? <ListTab products={products} cats={cats} reload={load} /> :
                      <CatsTab cats={cats} reload={load} />}
        </main>
      </div>
  );
}

function ListTab({ products, cats, reload }) {
  const [view,        setView]        = useState("all");
  const [showAdd,     setShowAdd]     = useState(false);
  const [name,        setName]        = useState("");
  const [note,        setNote]        = useState("");
  const [catId,       setCatId]       = useState(cats[0]?.id || "");
  const [addErr,      setAddErr]      = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [srQuery,     setSrQuery]     = useState("");
  const [srResult,    setSrResult]    = useState(null);
  const [srErr,       setSrErr]       = useState(null);
  const [editing,     setEditing]     = useState(null);
  const sugRef = useRef(null);

  const pending = products.filter(p => !p.done);
  const done    = products.filter(p =>  p.done);
  const grouped = cats.map(c => ({ ...c, items: pending.filter(p => p.category?.id === c.id) })).filter(g => g.items.length > 0);

  useEffect(() => {
    function onClickOutside(e) {
      if (sugRef.current && !sugRef.current.contains(e.target)) setSuggestions([]);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleNameInput(e) {
    const val = e.target.value;
    setName(val); setAddErr(null);
    if (val.length >= 2) {
      try {
        const data = await api.getSuggestions(val);
        setSuggestions(Array.isArray(data) ? data : []);
      } catch { setSuggestions([]); }
    } else { setSuggestions([]); }
  }

  function pickSuggestion(s) {
    setName(s.name);
    const matched = cats.find(c => c.name === s.category);
    if (matched) setCatId(matched.id);
    setSuggestions([]);
  }

  async function handleAdd(e) {
    e.preventDefault(); setAddErr(null);
    if (!name.trim()) { setAddErr("שם המוצר לא יכול להיות ריק"); return; }
    try {
      await api.addProduct({ name, note: note || null, done: false, quantity: 1, category: { id: catId } });
      setName(""); setNote(""); setSuggestions([]); reload();
    } catch(e) { setAddErr(e.message); }
  }

  async function handleSearch(e) {
    e.preventDefault(); setSrErr(null); setSrResult(null);
    if (!srQuery.trim()) return;
    try { setSrResult(await req(`/products/search?name=${encodeURIComponent(srQuery)}`)); }
    catch { setSrErr("מוצר לא נמצא ברשימה שלך"); }
  }

  async function changeQty(p, delta) {
    const next = (p.quantity || 1) + delta;
    if (next < 1) return;
    await api.updateQuantity(p.id, next);
    reload();
  }

  const listItems = (arr, dim=false) => arr.map((p,i) => (
      <Row key={p.id} p={p} i={i} dim={dim}
           onToggle={()=>api.toggleStatus(p.id).then(reload)}
           onDelete={()=>api.deleteProduct(p.id).then(reload)}
           onEdit={()=>setEditing(p)}
           onQtyUp={()=>changeQty(p, 1)}
           onQtyDown={()=>changeQty(p, -1)}
      />
  ));

  return (
      <div>
        <div style={st.topBar}>
          {products.length > 0 && (
              <form onSubmit={handleSearch} style={st.searchBox}>
                <input style={st.searchInput} placeholder="חפש ברשימה שלך..."
                       value={srQuery} onChange={e=>{setSrQuery(e.target.value);setSrResult(null);setSrErr(null);}} />
                {srQuery && <button type="submit" style={st.searchBtn}>חפש</button>}
              </form>
          )}
          <button style={{...st.addToggle,...(showAdd?st.addToggleOn:{})}}
                  onClick={()=>{setShowAdd(v=>!v);setSuggestions([]);}}>
            {showAdd ? "✕ סגור" : "+ הוסף מוצר"}
          </button>
        </div>

        {srErr    && <p style={{...st.hint, marginBottom:8}}>{srErr}</p>}
        {srResult && (
            <div style={st.srCard}>
              <span style={{fontSize:20}}>{em(srResult.category?.name)}</span>
              <div style={{flex:1}}>
                <p style={st.itemName}>{srResult.name}</p>
                <p style={st.itemSub}>{srResult.category?.name}{srResult.note?` · ${srResult.note}`:""}</p>
              </div>
              <span style={{fontSize:12,color:srResult.done?"#4a9e5c":"#bbb"}}>{srResult.done?"✓ נקנה":"ממתין"}</span>
            </div>
        )}

        {showAdd && (
            <form onSubmit={handleAdd} style={{...st.addForm, animation:"fadeUp .2s ease"}}>
              <div style={{position:"relative"}} ref={sugRef}>
                <div style={st.addRow}>
                  <input style={st.inp} placeholder="שם המוצר *" value={name}
                         onChange={handleNameInput} autoFocus />
                  <select style={st.sel} value={catId} onChange={e=>setCatId(e.target.value)}>
                    {cats.map(c=><option key={c.id} value={c.id}>{em(c.name)} {c.name}</option>)}
                  </select>
                </div>
                {suggestions.length > 0 && (
                    <div style={st.sugList}>
                      {suggestions.map((s,i) => (
                          <div key={i} className="sug-item" style={st.sugItem}
                               onMouseDown={()=>pickSuggestion(s)}>
                            <span style={{fontSize:15}}>{em(s.category)}</span>
                            <span style={{flex:1, fontSize:14, color:"#2d5a35"}}>{s.name}</span>
                            <span style={{fontSize:11, color:"#9ab89a"}}>{s.category}</span>
                          </div>
                      ))}
                    </div>
                )}
              </div>
              <div style={{...st.addRow, marginTop:8}}>
                <input style={st.inp} placeholder="הערה (אופציונלי)" value={note}
                       onChange={e=>setNote(e.target.value)} />
                <button type="submit" style={st.greenBtn}>הוסף לרשימה</button>
              </div>
              {addErr && <p style={st.hint}>{addErr}</p>}
            </form>
        )}

        <div style={st.viewBar}>
          <div style={st.pill}>
            {[["all","הכל"],["sorted","לפי מחלקה"]].map(([v,l])=>(
                <button key={v} style={{...st.pillBtn,...(view===v?st.pillOn:{})}} onClick={()=>setView(v)}>{l}</button>
            ))}
          </div>
          <span style={st.counter}>{pending.length} פריטים · {done.length} הושלמו</span>
        </div>

        {products.length === 0 ? <Empty /> :
            view==="sorted" ? (
                grouped.length === 0 ? <Empty msg="אין פריטים פתוחים" /> :
                    grouped.map(g=>(
                        <div key={g.id} style={{marginBottom:20}}>
                          <div style={st.groupHead}>
                            <span style={{fontSize:18}}>{em(g.name)}</span>
                            <span style={st.groupName}>{g.name}</span>
                            <span style={st.badge}>{g.items.length}</span>
                          </div>
                          {listItems(g.items)}
                        </div>
                    ))
            ) : (
                <>
                  {pending.length>0 && <div style={{marginBottom:20}}>
                    <p style={st.secLabel}>לקנות ({pending.length})</p>
                    {listItems(pending)}
                  </div>}
                  {done.length>0 && <div>
                    <p style={{...st.secLabel,color:"#b8ccb8"}}>נקנה ✓ ({done.length})</p>
                    {listItems(done, true)}
                  </div>}
                </>
            )}

        {editing && (
            <EditModal p={editing} cats={cats}
                       onClose={()=>setEditing(null)}
                       onSave={()=>{setEditing(null);reload();}} />
        )}
      </div>
  );
}

function Row({ p, i, dim, onToggle, onDelete, onEdit, onQtyUp, onQtyDown }) {
  return (
      <div className="row" style={{...st.row, opacity:dim?0.45:1, animationDelay:`${i*30}ms`}}>
        <button onClick={onToggle} style={{...st.check,...(p.done?st.checkOn:{})}}>
          {p.done && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
        </button>
        <span style={{fontSize:16,flexShrink:0}}>{em(p.category?.name)}</span>
        <div style={{flex:1,minWidth:0}}>
          <p style={{...st.itemName,textDecoration:p.done?"line-through":"none",color:p.done?"#aaa":"#2d5a35"}}>{p.name}</p>
          {(p.category?.name||p.note) &&
              <p style={st.itemSub}>{p.category?.name}{p.note?` · ${p.note}`:""}</p>}
        </div>

        {/* כמות */}
        {!p.done && (
            <div style={st.qtyBox}>
              <button onClick={onQtyDown} style={st.qtyBtn} disabled={(p.quantity||1)<=1}>−</button>
              <span style={st.qtyNum}>{p.quantity || 1}</span>
              <button onClick={onQtyUp} style={st.qtyBtn}>+</button>
            </div>
        )}

        <div className="actions" style={{display:"flex",gap:6,flexShrink:0,opacity:0,transition:"opacity .15s"}}>
          <button onClick={onEdit}   style={st.iconBtn}>✏️</button>
          <button onClick={onDelete} style={{...st.iconBtn,...st.iconDel}}>✕</button>
        </div>
      </div>
  );
}

function EditModal({ p, cats, onClose, onSave }) {
  const [name,  setName]  = useState(p.name);
  const [note,  setNote]  = useState(p.note||"");
  const [catId, setCatId] = useState(p.category?.id||"");
  const [err,   setErr]   = useState(null);
  const [busy,  setBusy]  = useState(false);

  async function save() {
    setErr(null);
    if (!name.trim()) { setErr("שם לא יכול להיות ריק"); return; }
    setBusy(true);
    try {
      if (name  !== p.name)         await api.updateName(p.id, name);
      if (note  !== (p.note||""))   await api.updateNote(p.id, note);
      if (catId !== p.category?.id) await api.updateCategory(p.id, catId);
      onSave();
    } catch(e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
      <div style={st.overlay} onClick={onClose}>
        <div style={{...st.modal,animation:"fadeUp .2s ease"}} onClick={e=>e.stopPropagation()}>
          <div style={st.modalTop}>
            <span style={st.modalTitle}>עריכת מוצר</span>
            <button onClick={onClose} style={st.closeBtn}>✕</button>
          </div>
          <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
            <label style={st.lbl}>שם</label>
            <input style={st.inp} value={name} onChange={e=>setName(e.target.value)} />
            <label style={st.lbl}>קטגוריה</label>
            <select style={st.sel} value={catId} onChange={e=>setCatId(e.target.value)}>
              {cats.map(c=><option key={c.id} value={c.id}>{em(c.name)} {c.name}</option>)}
            </select>
            <label style={st.lbl}>הערה</label>
            <input style={st.inp} placeholder="אופציונלי..." value={note} onChange={e=>setNote(e.target.value)} />
            {err && <p style={st.hint}>{err}</p>}
          </div>
          <div style={st.modalFoot}>
            <button onClick={onClose} style={st.ghostBtn}>ביטול</button>
            <button onClick={save} disabled={busy} style={st.greenBtn}>{busy?"שומר...":"שמור"}</button>
          </div>
        </div>
      </div>
  );
}

function CatsTab({ cats, reload }) {
  const [newName, setNew]      = useState("");
  const [addErr,  setAddErr]   = useState(null);
  const [editId,  setEditId]   = useState(null);
  const [editName,setEditName] = useState("");
  const [editErr, setEditErr]  = useState(null);

  async function add(e) {
    e.preventDefault(); setAddErr(null);
    if (!newName.trim()) { setAddErr("שם לא יכול להיות ריק"); return; }
    try { await api.addCategory(newName); setNew(""); reload(); }
    catch(e) { setAddErr(e.message); }
  }

  async function save(id) {
    setEditErr(null);
    if (!editName.trim()) { setEditErr("שם לא יכול להיות ריק"); return; }
    try { await api.updateCategoryName(id, editName); setEditId(null); reload(); }
    catch(e) { setEditErr(e.message); }
  }

  async function del(id) {
    try { await api.deleteCategory(id); reload(); }
    catch(e) { alert(e.message); }
  }

  return (
      <div>
        <form onSubmit={add} style={st.topBar}>
          <input style={st.searchInput} placeholder="שם קטגוריה חדשה..."
                 value={newName} onChange={e=>setNew(e.target.value)} />
          <button type="submit" style={st.greenBtn}>+ הוסף</button>
        </form>
        {addErr && <p style={st.hint}>{addErr}</p>}
        <p style={{...st.secLabel,marginTop:20}}>קטגוריות ({cats.length})</p>
        {cats.map((c,i)=>(
            <div key={c.id} className="row" style={{...st.row,animationDelay:`${i*30}ms`}}>
              <span style={{fontSize:22}}>{em(c.name)}</span>
              {editId===c.id ? (
                  <div style={{flex:1,display:"flex",gap:8}}>
                    <input style={{...st.inp,flex:1}} value={editName} onChange={e=>setEditName(e.target.value)} autoFocus />
                    <button onClick={()=>save(c.id)} style={st.greenBtn}>שמור</button>
                    <button onClick={()=>setEditId(null)} style={st.ghostBtn}>ביטול</button>
                  </div>
              ) : (
                  <>
                    <span style={{...st.itemName,flex:1}}>{c.name}</span>
                    <div className="actions" style={{display:"flex",gap:6,opacity:0,transition:"opacity .15s"}}>
                      <button onClick={()=>{setEditId(c.id);setEditName(c.name);setEditErr(null);}} style={st.iconBtn}>✏️</button>
                      <button onClick={()=>del(c.id)} style={{...st.iconBtn,...st.iconDel}}>✕</button>
                    </div>
                  </>
              )}
            </div>
        ))}
        {editErr && <p style={st.hint}>{editErr}</p>}
      </div>
  );
}

function Empty({ msg="הרשימה ריקה" }) {
  return (
      <div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp .3s ease"}}>
        <div style={{fontSize:44,marginBottom:12}}>🛒</div>
        <p style={{fontSize:16,fontWeight:600,color:"#4a7a52"}}>{msg}</p>
        <p style={{fontSize:13,color:"#9ab89a",marginTop:4}}>הוסף פריטים מהטופס למעלה</p>
      </div>
  );
}
function Spinner() {
  return <div style={{display:"flex",justifyContent:"center",padding:60}}><div style={st.spin}/></div>;
}
function Err({ msg, retry }) {
  return (
      <div style={{background:"#fee8e8",borderRadius:14,padding:24,textAlign:"center",color:"#c04040"}}>
        <p style={{marginBottom:12}}>{msg}</p>
        <button onClick={retry} style={st.greenBtn}>נסה שוב</button>
      </div>
  );
}

const G = "#4a9e5c";
const st = {
  page:       { minHeight:"100vh", background:"#f2f5f2" },
  header:     { background:"#fff", borderBottom:"1px solid #e4ede4", padding:"0 24px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:10 },
  logo:       { fontSize:18, fontWeight:700, color:"#2d5a35", letterSpacing:"-.3px" },
  tabs:       { display:"flex", gap:4, background:"#f2f5f2", borderRadius:20, padding:3 },
  tab:        { padding:"5px 16px", borderRadius:16, border:"none", background:"transparent", fontSize:13, color:"#7a9e7a", fontWeight:500, cursor:"pointer" },
  tabOn:      { background:"#fff", color:"#2d5a35", boxShadow:"0 1px 4px rgba(0,0,0,.09)" },
  main:       { maxWidth:640, margin:"0 auto", padding:"20px 16px 80px" },
  topBar:     { display:"flex", gap:10, marginBottom:12 },
  searchBox:  { flex:1, display:"flex", gap:8, background:"#fff", border:"1px solid #e4ede4", borderRadius:12, padding:"8px 14px", alignItems:"center" },
  searchInput:{ flex:1, border:"none", outline:"none", fontSize:14, color:"#2d5a35", background:"transparent", fontFamily:"inherit" },
  searchBtn:  { border:"none", background:"transparent", color:G, fontSize:13, fontWeight:600, cursor:"pointer", padding:"2px 6px", fontFamily:"inherit" },
  addToggle:  { padding:"0 18px", border:`1.5px solid ${G}`, borderRadius:12, background:"#fff", color:G, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit", height:44 },
  addToggleOn:{ background:G, color:"#fff" },
  addForm:    { background:"#fff", border:"1px solid #e4ede4", borderRadius:14, padding:14, marginBottom:14, display:"flex", flexDirection:"column", gap:0 },
  addRow:     { display:"flex", gap:8 },
  sugList:    { position:"absolute", top:"calc(100% + 4px)", right:0, left:0, background:"#fff", border:"1px solid #e4ede4", borderRadius:12, zIndex:50, maxHeight:240, overflowY:"auto", boxShadow:"0 6px 20px rgba(0,0,0,.1)" },
  sugItem:    { display:"flex", alignItems:"center", gap:10, padding:"10px 14px", cursor:"pointer", borderBottom:"1px solid #f5f5f5" },
  srCard:     { background:"#fff", border:"1px solid #e4ede4", borderRadius:12, padding:"10px 14px", marginBottom:12, display:"flex", alignItems:"center", gap:10 },
  viewBar:    { display:"flex", alignItems:"center", gap:10, marginBottom:16 },
  pill:       { display:"flex", background:"#e8ede8", borderRadius:20, padding:3, gap:2 },
  pillBtn:    { padding:"5px 14px", borderRadius:16, border:"none", background:"transparent", fontSize:12, color:"#7a9e7a", fontWeight:500, cursor:"pointer", fontFamily:"inherit" },
  pillOn:     { background:"#fff", color:"#2d5a35", boxShadow:"0 1px 3px rgba(0,0,0,.08)" },
  counter:    { fontSize:12, color:"#a8c0a8", marginRight:"auto" },
  secLabel:   { fontSize:11, fontWeight:700, color:G, textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 },
  groupHead:  { display:"flex", alignItems:"center", gap:8, marginBottom:8, paddingRight:2 },
  groupName:  { flex:1, fontSize:14, fontWeight:700, color:"#2d5a35" },
  badge:      { fontSize:11, fontWeight:700, color:G, background:"#e8f4ea", padding:"2px 8px", borderRadius:10 },
  row:        { display:"flex", alignItems:"center", gap:10, background:"#fff", borderRadius:12, padding:"11px 12px", marginBottom:7, border:"1px solid #ebebeb", animation:"fadeUp .22s ease both" },
  check:      { width:24, height:24, borderRadius:"50%", border:"2px solid #ccdacc", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer", transition:"all .15s" },
  checkOn:    { background:G, borderColor:G },
  itemName:   { fontSize:14, fontWeight:500, color:"#2d5a35" },
  itemSub:    { fontSize:12, color:"#a8bba8", marginTop:2 },
  qtyBox:     { display:"flex", alignItems:"center", gap:6, background:"#f5faf5", borderRadius:20, padding:"3px 8px", flexShrink:0 },
  qtyBtn:     { width:22, height:22, borderRadius:"50%", border:"none", background:"#e0ede0", color:"#2d5a35", fontSize:14, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", lineHeight:1 },
  qtyNum:     { fontSize:13, fontWeight:600, color:"#2d5a35", minWidth:16, textAlign:"center" },
  iconBtn:    { width:28, height:28, borderRadius:8, border:"none", background:"#f0f4ec", color:"#4a7a52", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" },
  iconDel:    { background:"#fee8e8", color:"#e05252" },
  overlay:    { position:"fixed", inset:0, background:"rgba(0,0,0,.3)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100, padding:20 },
  modal:      { background:"#fff", borderRadius:18, width:"100%", maxWidth:400, boxShadow:"0 16px 48px rgba(0,0,0,.18)" },
  modalTop:   { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid #f0f0f0" },
  modalTitle: { fontSize:16, fontWeight:700, color:"#2d5a35" },
  closeBtn:   { width:28, height:28, borderRadius:"50%", border:"none", background:"#f0f4ec", color:"#4a7a52", fontSize:15, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  modalFoot:  { display:"flex", gap:8, padding:"12px 20px", borderTop:"1px solid #f0f0f0", justifyContent:"flex-end" },
  lbl:        { fontSize:11, fontWeight:700, color:"#9ab89a" },
  inp:        { flex:1, padding:"9px 12px", border:"1.5px solid #e4ede4", borderRadius:9, fontSize:14, color:"#2d5a35", outline:"none", background:"#fafcfa", fontFamily:"inherit" },
  sel:        { padding:"9px 10px", border:"1.5px solid #e4ede4", borderRadius:9, fontSize:13, color:"#2d5a35", background:"#fafcfa", outline:"none", cursor:"pointer", fontFamily:"inherit" },
  greenBtn:   { padding:"9px 18px", background:G, color:"#fff", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:"inherit" },
  ghostBtn:   { padding:"9px 16px", background:"transparent", color:"#7a9e7a", border:"1.5px solid #e4ede4", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" },
  hint:       { fontSize:12, color:"#e05252", marginTop:6 },
  spin:       { width:32, height:32, border:"3px solid #deeade", borderTop:`3px solid ${G}`, borderRadius:"50%", animation:"spin .8s linear infinite" },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Rubik', sans-serif; direction: rtl; background: #f2f5f2; }
  input, select, button { font-family: 'Rubik', sans-serif; }
  input:focus, select:focus { border-color: #4a9e5c !important; box-shadow: 0 0 0 3px rgba(74,158,92,.1); }
  button:hover { opacity: .85; }
  button:active { transform: scale(.97); }
  .row:hover .actions { opacity: 1 !important; }
  .sug-item:hover { background: #f5faf5; }
  button:disabled { opacity: .35; cursor: not-allowed; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin    { to { transform:rotate(360deg); } }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #c8d8c8; border-radius: 4px; }
`;