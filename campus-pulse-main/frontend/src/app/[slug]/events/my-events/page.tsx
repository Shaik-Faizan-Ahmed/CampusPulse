"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

export default function MyEvents(){
 const params=useParams()
 const slug=params.slug as string
 const basePath=`/${slug}`

 const[data,setData]=useState<any>(null)

 useEffect(()=>{
  apiFetch(`/${slug}/events/my-events`)
   .then(r=>r.ok?r.json():null)
   .then(setData)
 },[slug])

 const events=data?.events||[]
 const stats=data?.stats||{total:0,upcoming:0,attended:0}

 return(
  <div className="my-events-container" style={{paddingTop:"2rem"}}>
   <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginBottom:"2rem"}}>
    <div>
     <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"2rem",fontWeight:800}}>My Events</h1>
     <p style={{color:"var(--muted)",marginTop:"0.3rem"}}>Track your registrations and attendance</p>
    </div>
    <Link href={`${basePath}/events`} className="btn btn-outline btn-sm" style={{width:"auto"}}>← All Events</Link>
   </div>

   <div className="stats-row">
    <div className="stat-card">
     <div className="stat-num">{stats.total}</div>
     <div className="stat-label">Registered</div>
    </div>
    <div className="stat-card">
     <div className="stat-num" style={{color:"var(--yellow)"}}>{stats.upcoming}</div>
     <div className="stat-label">Upcoming</div>
    </div>
    <div className="stat-card">
     <div className="stat-num" style={{color:"var(--green)"}}>{stats.attended}</div>
     <div className="stat-label">Attended</div>
    </div>
   </div>

   {events.length===0?(
    <div className="empty-state" style={{padding:"3rem"}}>
     <div className="empty-icon">📭</div>
     <h3 style={{fontFamily:"'Syne',sans-serif",marginBottom:"0.5rem"}}>No events yet</h3>
     <p>Browse and register for events on the dashboard</p>
     <Link href={`${basePath}/events`} className="btn btn-primary" style={{width:"auto",marginTop:"1rem"}}>Browse Events</Link>
    </div>
   ):(
    <div className="events-list">
     {events.map((ev:any)=>(
      <div key={ev.id} className="event-row">
       <div className="event-emoji">{ev.catEmoji}</div>
       <div className="event-info">
        <div className="ev-title">
         <Link href={`${basePath}/events/${ev.id}`} style={{color:"inherit",textDecoration:"none"}}>{ev.title}</Link>
        </div>
        <div className="ev-meta">
         <span>📅 {new Date(ev.date).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}</span>
         <span>📍 {ev.venue}</span>
         <span>⏱ {ev.durationHours}h</span>
        </div>
        <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginTop:"0.4rem"}}>
         <span className={`badge badge-${ev.status}`}>{ev.status}</span>
         <span className={`badge badge-${ev.category}`}>{ev.catEmoji} {ev.category}</span>
         {ev.hasAttended&&<span className="badge" style={{background:"rgba(34,197,94,0.12)",color:"var(--green)",border:"1px solid rgba(34,197,94,0.25)"}}>✓ Attended</span>}
        </div>
       </div>
       <div style={{textAlign:"right",minWidth:"160px"}}>
        <Link href={`${basePath}/events/${ev.id}/my-qr`} className="btn btn-primary btn-sm"
         style={{width:"auto",marginBottom:"0.5rem",display:"inline-block",background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
         📲 Show Entry QR
        </Link>
        {ev.hasAttended?(
         <><br/><span className="badge" style={{background:"rgba(34,197,94,0.12)",color:"var(--green)",fontSize:"0.8rem",padding:"0.4rem 0.75rem",marginTop:"0.3rem",display:"inline-block"}}>✅ Attended</span></>
        ):ev.status==="Upcoming"?(
         <><br/><span style={{fontSize:"0.78rem",color:"var(--muted)"}}>Starts {new Date(ev.date).toLocaleDateString("en-IN")}</span></>
        ):ev.status==="Ongoing"?(
         <><br/><span style={{fontSize:"0.78rem",color:"var(--yellow)"}}>🔴 Live Now</span></>
        ):(
         <><br/><span style={{fontSize:"0.78rem",color:"var(--muted)"}}>Completed</span></>
        )}
       </div>
      </div>
     ))}
    </div>
   )}
  </div>
 )
}