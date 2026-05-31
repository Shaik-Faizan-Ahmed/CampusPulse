"use client"

import {useEffect,useState} from "react"
import {useParams} from "next/navigation"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

export default function Participants(){
 const params=useParams()
 const slug=params.slug as string
 const id=params.id as string
 const basePath=`/${slug}`

 const[data,setData]=useState<any>(null)

 useEffect(()=>{
  apiFetch(`/${slug}/events/${id}/participants`)
   .then(r=>r.ok?r.json():null)
   .then(setData)
 },[slug,id])

 if(!data)return null

 const{event,participants,totalAttended}=data

 const markPresent=async(studentId:string)=>{
  const res=await apiFetch(`${basePath}/events/${id}/manual-attend`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({studentId})})
  if(res.ok)window.location.reload()
 }

 return(
  <div className="participants-container">
   <div style={{marginBottom:"1.5rem"}}>
    <Link href={`${basePath}/events/${id}`} style={{color:"var(--muted)",textDecoration:"none",fontSize:"0.88rem"}}>← Back to Event</Link>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginTop:"1rem"}}>
     <div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.75rem",fontWeight:800}}>{event.title}</h1>
      <div style={{display:"flex",gap:"0.5rem",marginTop:"0.6rem",flexWrap:"wrap"}}>
       <span className={`badge badge-${event.category}`}>{event.category}</span>
       <span className={`badge badge-${event.status}`}>{event.status}</span>
      </div>
     </div>
     <Link href={`${basePath}/events/${id}/scan`} className="btn btn-primary btn-sm"
      style={{width:"auto",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",whiteSpace:"nowrap"}}>
      📷 Scan Entry QR
     </Link>
    </div>
   </div>

   <div style={{display:"flex",gap:"2rem",marginBottom:"2rem",flexWrap:"wrap"}}>
    {[
     {num:participants.length,color:"var(--accent)",label:"Registered"},
     {num:totalAttended,color:"var(--green)",label:"Attended"},
     {num:participants.length-totalAttended,color:"var(--yellow)",label:"Absent"},
     {num:`${participants.length>0?Math.round((totalAttended/participants.length)*100):0}%`,color:undefined,label:"Attendance Rate"},
    ].map(s=>(
     <div key={s.label} style={{textAlign:"center"}}>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:"2rem",fontWeight:800,color:s.color}}>{s.num}</div>
      <div style={{fontSize:"0.78rem",color:"var(--muted)"}}>{s.label}</div>
     </div>
    ))}
   </div>

   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:"0.75rem"}}>
    <h3 style={{fontFamily:"'Syne',sans-serif"}}>Participant List</h3>
    <Link href={`${basePath}/events/${id}/qr`} className="btn btn-primary btn-sm" style={{width:"auto"}}>📱 Open QR Scanner</Link>
   </div>

   {participants.length===0?(
    <div className="empty-state">
     <div className="empty-icon">👥</div>
     <p>No registrations yet</p>
    </div>
   ):(
    <table>
     <thead>
      <tr>
       <th>#</th><th>Name</th><th>Email</th>
       <th style={{textAlign:"center"}}>Attended</th>
       <th style={{textAlign:"center"}}>Action</th>
      </tr>
     </thead>
     <tbody>
      {participants.map((p:any,i:number)=>(
       <tr key={p.id}>
        <td style={{color:"var(--muted)"}}>{i+1}</td>
        <td><strong>{p.name}</strong></td>
        <td style={{color:"var(--muted)"}}>{p.email}</td>
        <td style={{textAlign:"center"}}>
         {p.attended?<span className="attended-yes">✓ Present</span>:<span className="attended-no">—</span>}
        </td>
        <td style={{textAlign:"center"}}>
         {!p.attended?(
          <button onClick={()=>markPresent(p.id)} className="btn btn-sm"
           style={{width:"auto",background:"rgba(34,197,94,0.12)",color:"var(--green)",border:"1px solid rgba(34,197,94,0.3)"}}>Mark Present</button>
         ):(
          <span style={{fontSize:"0.78rem",color:"var(--muted)"}}>Done</span>
         )}
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   )}
  </div>
 )
}