"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

export default function EventQR(){
 const params=useParams()
 const slug=params.slug as string
 const id=params.id as string
 const basePath=`/${slug}`

 const[data,setData]=useState<any>(null)

 useEffect(()=>{
  apiFetch(`/${slug}/events/${id}/qr`)
   .then(r=>r.ok?r.json():null)
   .then(setData)
 },[slug,id])

 if(!data)return null
 const{event,qrDataURL,qrUrl}=data

 return(
  <>
   <style>{`@media print{.navbar,.footer,a,.btn,.qr-url,div[data-howitworks]{display:none!important}.qr-container{max-width:100%}.qr-card{border:none;box-shadow:none}}`}</style>
   <div className="qr-container">
    <Link href={`${basePath}/events/${id}/participants`} style={{color:"var(--muted)",textDecoration:"none",fontSize:"0.88rem"}}>← Back to Participants</Link>

    <div className="qr-card" style={{marginTop:"1.5rem"}}>
     <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:800,marginBottom:"0.4rem"}}>📱 Attendance QR Code</h2>
     <p style={{color:"var(--muted)",fontSize:"0.88rem",marginBottom:"0.5rem"}}>{event.title}</p>
     <div style={{display:"flex",gap:"0.4rem",justifyContent:"center",marginBottom:"1.5rem"}}>
      <span className={`badge badge-${event.category}`}>{event.category}</span>
     </div>

     <div className="qr-box">
      <div style={{background:"#fff",padding:"16px",borderRadius:"12px",display:"inline-block"}}>
       <img src={qrDataURL} width={240} height={240} alt="Event Attendance QR" style={{display:"block"}}/>
      </div>
     </div>

     <p className="qr-hint">
      Project this QR on screen or print it.<br/>
      Registered students scan it to mark their attendance automatically.
     </p>

     <div className="qr-url">{qrUrl}</div>

     <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",justifyContent:"center"}}>
      <Link href={`${basePath}/events/${id}/participants`} className="btn btn-outline btn-sm" style={{width:"auto"}}>👥 View Attendance</Link>
      <Link href={`${basePath}/events/${id}/scan`} className="btn btn-primary btn-sm" style={{width:"auto",background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>📷 Scan Student QR</Link>
      <button onClick={()=>window.print()} className="btn btn-outline btn-sm" style={{width:"auto"}}>🖨️ Print QR</button>
     </div>

     <div data-howitworks style={{marginTop:"1.5rem",padding:"1rem",background:"var(--bg)",borderRadius:"10px",border:"1px solid var(--border)",textAlign:"left"}}>
      <p style={{fontSize:"0.8rem",color:"var(--muted)",marginBottom:"0.4rem"}}><strong style={{color:"var(--text)"}}>How it works:</strong></p>
      <ol style={{fontSize:"0.8rem",color:"var(--muted)",paddingLeft:"1.2rem",lineHeight:2}}>
       <li>Students must be logged in to the platform</li>
       <li>They scan this QR with their phone camera</li>
       <li>It opens a link that marks their attendance automatically</li>
       <li>They must be registered for this event</li>
       <li>Attendance window: during event + 2 hours after</li>
      </ol>
     </div>
    </div>
   </div>
  </>
 )
}