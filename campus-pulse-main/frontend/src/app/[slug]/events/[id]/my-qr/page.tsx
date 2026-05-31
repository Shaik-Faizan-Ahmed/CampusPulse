"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

export default function StudentQR(){
 const params=useParams()
 const slug=params.slug as string
 const id=params.id as string
 const basePath=`/${slug}`

 const[data,setData]=useState<any>(null)

 useEffect(()=>{
  apiFetch(`/${slug}/events/${id}/my-qr`)
   .then(r=>r.ok?r.json():null)
   .then(setData)
 },[slug,id])

 if(!data)return null
 const{event,qrDataURL}=data

 return(
  <>
   <style>{`@media print{.navbar,.footer,a.btn,button{display:none!important}.qr-card{border:none;box-shadow:none}}`}</style>
   <div style={{maxWidth:"480px",margin:"2rem auto",padding:"0 1rem"}}>
    <Link href={`${basePath}/events/my-events`} style={{color:"var(--muted)",textDecoration:"none",fontSize:"0.88rem"}}>← Back to My Events</Link>

    <div className="qr-card" style={{marginTop:"1.5rem",textAlign:"center"}}>
     <div style={{width:"64px",height:"64px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",margin:"0 auto 1rem"}}>🎫</div>

     <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.5rem",fontWeight:800,marginBottom:"0.3rem"}}>Your Entry QR Code</h2>
     <p style={{color:"var(--muted)",fontSize:"0.88rem",marginBottom:"0.25rem"}}>
      <strong style={{color:"var(--text)"}}>{event.title}</strong>
     </p>
     <p style={{color:"var(--muted)",fontSize:"0.8rem",marginBottom:"1.5rem"}}>
      📅 {new Date(event.date).toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"})}
      &nbsp;|&nbsp; 📍 {event.venue}
     </p>

     <div style={{display:"flex",justifyContent:"center",marginBottom:"1.2rem"}}>
      <div style={{background:"#fff",padding:"16px",borderRadius:"16px",display:"inline-block",boxShadow:"0 4px 24px rgba(0,0,0,0.25)"}}>
       <img src={qrDataURL} width={240} height={240} alt="Entry QR Code" style={{display:"block"}}/>
      </div>
     </div>

     <div style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:"10px",padding:"1rem",marginBottom:"1.2rem"}}>
      <p style={{color:"#a5b4fc",fontSize:"0.9rem",fontWeight:600,marginBottom:"0.3rem"}}>📲 Show this QR at the event entrance</p>
      <p style={{color:"var(--muted)",fontSize:"0.78rem"}}>The coordinator will scan it to approve your entry and mark attendance automatically</p>
     </div>

     <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1rem",textAlign:"left",marginBottom:"1.5rem"}}>
      <p style={{fontSize:"0.78rem",color:"var(--muted)",lineHeight:2}}>
       <strong style={{color:"var(--text)"}}>How it works:</strong><br/>
       1. Open this page when you arrive at the event<br/>
       2. Show your QR code to the coordinator at the entrance<br/>
       3. They scan it — your attendance is marked automatically<br/>
       4. This QR is unique to you for this event only
      </p>
     </div>

     <div style={{display:"flex",gap:"0.75rem",justifyContent:"center",flexWrap:"wrap"}}>
      <Link href={`${basePath}/events/my-events`} className="btn btn-outline btn-sm" style={{width:"auto"}}>← My Events</Link>
      <button onClick={()=>window.print()} className="btn btn-primary btn-sm" style={{width:"auto",background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>🖨️ Save / Print</button>
     </div>
    </div>
   </div>
  </>
 )
}