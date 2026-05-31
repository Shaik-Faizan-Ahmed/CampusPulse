"use client"

import {useEffect,useState} from "react"
import Link from "next/link"
import {useParams,useRouter,useSearchParams} from "next/navigation"
import {apiFetch} from "@/lib/api"

const catMeta=[
 {val:"All",cls:"all",label:"All"},
 {val:"Technical",cls:"tech",label:"Technical"},
 {val:"Non-Technical",cls:"non",label:"Non-Technical"},
 {val:"Sports",cls:"sports",label:"Sports"},
 {val:"Cultural",cls:"cultural",label:"Cultural"},
 {val:"Workshop",cls:"workshop",label:"Workshop"},
 {val:"Other",cls:"other",label:"Other"},
]

export default function Dashboard(){
 const params=useParams()
 const slug=params.slug as string
 const router=useRouter()
 const sp=useSearchParams()

 const search=sp.get("search")||""
 const status=sp.get("status")||"All"
 const category=sp.get("category")||"All"
 const page=parseInt(sp.get("page")||"1")

 const[data,setData]=useState<any>(null)
 const[org,setOrg]=useState<any>(null)
 const[user,setUser]=useState<any>(null)
 const[userRole,setUserRole]=useState<string|null>(null)
 const[searchVal,setSearchVal]=useState(search)

 const basePath=`/${slug}`

 useEffect(()=>{
  apiFetch("/auth/me",{credentials:"include"}).then(r=>r.ok?r.json():null).then(d=>{if(d)setUser(d.user)}).catch(()=>{})
  apiFetch(`/auth/org/${slug}`,{credentials:"include"}).then(r=>r.ok?r.json():null).then(d=>{if(d){setOrg(d.org);setUserRole(d.userRole)}}).catch(()=>{})
 },[slug])

 useEffect(()=>{
  const qs=new URLSearchParams({search,status,category,page:String(page)}).toString()
  apiFetch(`/${slug}/events?${qs}`,{credentials:"include"})
   .then(r=>r.ok?r.json():null)
   .then(setData)
   .catch(()=>{})
 },[slug,search,status,category,page])

 const navigate=(newParams:Record<string,string>)=>{
  const cur=new URLSearchParams({search,status,category,page:String(page)})
  Object.entries(newParams).forEach(([k,v])=>cur.set(k,v))
  if(newParams.search!==undefined||newParams.status!==undefined||newParams.category!==undefined)cur.set("page","1")
  router.push(`${basePath}/events?${cur.toString()}`)
 }

 const events=data?.events||[]
 const pages=data?.pages||1
 const currentPage=data?.currentPage||page
 const recentAnnouncements=data?.recentAnnouncements||[]
 const myRegisteredIds=new Set(data?.myRegisteredIds||[])

 const[dismissAnn,setDismissAnn]=useState(false)

 return(
  <>
   {org?.orgPage?.bannerUrl?(
    <div className="page-header" style={{background:`linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url('${org.orgPage.bannerUrl}') center/cover`,padding:"4rem 2rem",color:"#fff",textAlign:"center",borderRadius:"16px",marginBottom:"2rem"}}>
     <h1 style={{color:"#fff"}}>Discover <span>{org.name} Events</span></h1>
     <p style={{color:"#f1f5f9"}}>Find, register, and attend events at {org.name}</p>
    </div>
   ):(
    <div className="page-header">
     <h1>Discover <span>{org?`${org.name} Events`:"Campus Events"}</span></h1>
     <p>Find, register, and attend events{org?` at ${org.name}`:""}</p>
    </div>
   )}

   {user&&(userRole==="admin"||userRole==="coordinator")&&(
    <div style={{margin:"0 2rem 1.5rem",background:"color-mix(in srgb,var(--accent) 10%,transparent)",border:"1px solid color-mix(in srgb,var(--accent) 30%,transparent)",borderRadius:"12px",padding:"1rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.75rem"}}>
     <span style={{fontSize:"0.9rem"}}>Logged in as <strong style={{color:"var(--accent)"}}>{userRole==="admin"?"👑 Admin":"🎯 Coordinator"}</strong> — you can create and manage events</span>
     <Link href={`${basePath}/events/new`} className="btn btn-primary btn-sm" style={{width:"auto"}}>+ New Event</Link>
    </div>
   )}

   {user&&userRole==="student"&&recentAnnouncements.length>0&&!dismissAnn&&(
    <div style={{margin:"0 2rem 2rem",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"16px",padding:"1.5rem",position:"relative",overflow:"hidden"}}>
     <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(90deg,var(--accent),color-mix(in srgb,var(--accent) 60%,#8b5cf6))"}}></div>
     <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",flexWrap:"wrap",gap:"0.5rem"}}>
      <h3 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.1rem",fontWeight:700,display:"flex",alignItems:"center",gap:"0.5rem"}}>
       <span style={{fontSize:"1.3rem"}}>📢</span> Recent Announcements
      </h3>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
       <Link href={`${basePath}/announcements`} style={{fontSize:"0.82rem",color:"var(--accent)",textDecoration:"none",fontWeight:600}}>View All →</Link>
       <button onClick={()=>setDismissAnn(true)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:"1.1rem",padding:"0.2rem 0.4rem",borderRadius:"6px",lineHeight:1}}>✕</button>
      </div>
     </div>
     <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
      {recentAnnouncements.map((ann:any)=>(
       <div key={ann.id} style={{background:"color-mix(in srgb,var(--bg) 50%,var(--surface))",border:"1px solid var(--border)",borderRadius:"10px",padding:"0.85rem 1rem"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.75rem",marginBottom:"0.3rem"}}>
         <span style={{fontWeight:600,fontSize:"0.9rem",color:"var(--text)"}}>{ann.title}</span>
         {ann.targetType==="ALL"?(
          <span style={{fontSize:"0.7rem",padding:"0.15rem 0.5rem",borderRadius:"20px",background:"rgba(34,197,94,0.12)",color:"var(--green)",border:"1px solid rgba(34,197,94,0.25)",whiteSpace:"nowrap"}}>👥 All</span>
         ):(
          <span style={{fontSize:"0.7rem",padding:"0.15rem 0.5rem",borderRadius:"20px",background:"rgba(59,130,246,0.12)",color:"var(--blue)",border:"1px solid rgba(59,130,246,0.25)",whiteSpace:"nowrap"}}>📅 {ann.event?.title||"Event"}</span>
         )}
        </div>
        <p style={{fontSize:"0.82rem",color:"var(--muted)",lineHeight:1.5,margin:"0 0 0.4rem"}}>{ann.message}</p>
        <span style={{fontSize:"0.7rem",color:"var(--muted)",opacity:0.7}}>🕐 {new Date(ann.createdAt).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span>
       </div>
      ))}
     </div>
    </div>
   )}

   <div id="filter-form">
    <div className="filters">
     <div className="search-box">
      <span className="search-icon">🔍</span>
      <input type="text" placeholder="Search events..." value={searchVal}
       onChange={e=>setSearchVal(e.target.value)}
       onKeyDown={e=>{if(e.key==="Enter")navigate({search:searchVal})}}
       onBlur={()=>{if(searchVal!==search)navigate({search:searchVal})}}
      />
     </div>
     <select className="filter-select" value={status} onChange={e=>navigate({status:e.target.value})}>
      {["All","Upcoming","Ongoing","Completed"].map(s=>(
       <option key={s} value={s}>{s} Status</option>
      ))}
     </select>
    </div>

    <div className="cat-pills">
     {catMeta.map(c=>(
      <Link key={c.val}
 href={`${basePath}/events?search=${search}&status=${status}&category=${c.val}`}
 className={`cat-pill ${c.cls}${category===c.val?" active":""}`}>
 {c.label}
</Link>
     ))}
    </div>
   </div>

   <div className="events-grid">
    {events.length===0?(
     <div className="empty-state">
      <div className="empty-icon">🔍</div>
      <h3 style={{fontFamily:"var(--font-main)",marginBottom:"0.5rem"}}>No events found</h3>
      <p>Try changing your filters or search term</p>
     </div>
    ):events.map((ev:any)=>(
     <div key={ev.id} className="event-card">
      <div className="card-img">
       {ev.image?<img src={ev.image} alt={ev.title}/>:<span>{ev.catEmoji}</span>}
      </div>
      <div className="card-body">
       <div className="card-meta">
        <span className={`badge badge-${ev.category}`}>{ev.catEmoji} {ev.category}</span>
        <span className={`badge badge-${ev.status}`}>{ev.status}</span>
        {ev.featured&&<span className="badge" style={{background:"rgba(234,179,8,0.15)",color:"#eab308",border:"1px solid rgba(234,179,8,0.3)"}}>⭐ Featured</span>}
       </div>
       <div className="card-title">{ev.title}</div>
       <div className="card-desc">{ev.description}</div>
       <div className="card-details">
        <span>📅 {new Date(ev.date).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span>
        <span>📍 {ev.venue}</span>
        <span>⏱ {ev.durationHours}h &nbsp;|&nbsp; 👥 {ev.registeredCount||0} registered</span>
       </div>
       {ev.maxSeats>0&&(
        <div className="seats-info">
         <div className="seats-text">
          {ev.isFull?<span style={{color:"var(--red)"}}>Full</span>:`${ev.seatsLeft} seats left / ${ev.maxSeats}`}
         </div>
         <div className="seats-bar">
          <div className="seats-fill" style={{width:`${ev.seatsPct}%`,background:ev.seatsPct>90?"var(--red)":ev.seatsPct>60?"var(--yellow)":"var(--accent)"}}></div>
         </div>
        </div>
       )}
       {user&&userRole==="student"?(
        myRegisteredIds.has(ev.id)?(
         <Link href={`${basePath}/events/${ev.id}`} className="btn btn-registered">✓ Registered — View Details</Link>
        ):ev.status==="Completed"?(
         <button className="btn btn-muted" disabled>Event Ended</button>
        ):ev.isFull?(
         <button className="btn btn-muted" disabled>Event Full</button>
        ):(
         <Link href={`${basePath}/events/${ev.id}`} className="btn btn-primary">Register Now →</Link>
        )
       ):user&&(userRole==="admin"||userRole==="coordinator")?(
        <div className="btn-group" style={{flexWrap:"wrap",gap:"0.4rem"}}>
         <Link href={`${basePath}/events/${ev.id}/participants`} className="btn btn-outline btn-sm" style={{flex:1}}>👥 Attendance</Link>
         <Link href={`${basePath}/events/${ev.id}/edit`} className="btn btn-outline btn-sm" style={{width:"auto"}}>✏️</Link>
        </div>
       ):(
        <Link href={`${basePath}/events/${ev.id}`} className="btn btn-outline">View Event</Link>
       )}
      </div>
     </div>
    ))}
   </div>

   {pages>1&&(
    <div className="pagination">
     {currentPage>1&&<Link href={`${basePath}/events?page=${currentPage-1}&search=${search}&status=${status}&category=${category}`} className="page-link">← Prev</Link>}
     {Array.from({length:pages},(_,i)=>i+1).map(i=>(
      <a key={i} href={`${basePath}/events?page=${i}&search=${search}&status=${status}&category=${category}`} className={`page-link${i===currentPage?" active":""}`}>{i}</a>
     ))}
     {currentPage<pages&&<Link href={`${basePath}/events?page=${currentPage+1}&search=${search}&status=${status}&category=${category}`} className="page-link">Next →</Link>}
    </div>
   )}
  </>
 )
}
