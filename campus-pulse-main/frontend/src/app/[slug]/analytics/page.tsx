"use client"

import {useParams} from "next/navigation"
import {useEffect,useState} from "react"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

export default function Analytics(){
 const params=useParams()
 const slug=params.slug as string
 const basePath=`/${slug}`

 const[data,setData]=useState<any>(null)

 useEffect(()=>{
  apiFetch(`/${slug}/analytics`,{credentials:"include"})
   .then(r=>r.ok?r.json():null)
   .then(setData)
 },[slug])

 if(!data)return null

 const{analytics,categoryStats,eventBreakdown}=data

 return(
  <div style={{maxWidth:"1000px",margin:"0 auto",padding:"0 1.5rem 3rem"}}>
   <div className="page-header" style={{textAlign:"left",padding:"2rem 0 1.5rem"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
     <div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.8rem",fontWeight:800}}>📊 <span>Analytics</span></h1>
      <p style={{color:"var(--muted)",fontSize:"0.9rem",marginTop:"0.4rem"}}>Organization performance overview</p>
     </div>
     <Link href={`${basePath}/events`} className="btn btn-outline btn-sm">← Events</Link>
    </div>
   </div>

   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",textAlign:"center"}}>
     <div style={{fontSize:"2.5rem",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--accent)",lineHeight:1}}>{analytics.totalEvents}</div>
     <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.4rem"}}>Total Events</div>
    </div>
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",textAlign:"center"}}>
     <div style={{fontSize:"2.5rem",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--blue)",lineHeight:1}}>{analytics.totalRegistrations}</div>
     <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.4rem"}}>Total Registrations</div>
    </div>
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",textAlign:"center"}}>
     <div style={{fontSize:"2.5rem",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--green)",lineHeight:1}}>{analytics.totalAttendance}</div>
     <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.4rem"}}>Total Attendance</div>
    </div>
    <div style={{background:"linear-gradient(135deg,#059669,#10b981)",borderRadius:"var(--radius-lg)",padding:"1.5rem",textAlign:"center",color:"#fff"}}>
     <div style={{fontSize:"2.5rem",fontFamily:"'Syne',sans-serif",fontWeight:800,lineHeight:1}}>
      ₹{analytics.totalRevenue>=1000?(analytics.totalRevenue/1000).toFixed(1)+"k":analytics.totalRevenue}
     </div>
     <div style={{fontSize:"0.8rem",opacity:0.8,marginTop:"0.4rem"}}>Total Revenue</div>
    </div>
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",textAlign:"center"}}>
     <div style={{fontSize:"2.5rem",fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--yellow)",lineHeight:1}}>{analytics.attendanceRate}%</div>
     <div style={{fontSize:"0.8rem",color:"var(--muted)",marginTop:"0.4rem"}}>Attendance Rate</div>
    </div>
   </div>

   {categoryStats&&Object.keys(categoryStats).length>0&&(
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",padding:"1.5rem",marginBottom:"2rem"}}>
     <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem",marginBottom:"1rem"}}>Category Distribution</h3>
     <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
      {Object.entries(categoryStats).map(([cat,count]:any)=>(
       <div key={cat} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:"0.5rem 1rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
        <span style={{fontSize:"0.85rem",fontWeight:600}}>{cat}</span>
        <span style={{background:"var(--accent)",color:"#fff",borderRadius:"999px",padding:"0.15rem 0.5rem",fontSize:"0.72rem",fontWeight:700}}>{count}</span>
       </div>
      ))}
     </div>
    </div>
   )}

   {eventBreakdown?.length>0&&(
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden"}}>
     <div style={{padding:"1.25rem 1.5rem",borderBottom:"1px solid var(--border)"}}>
      <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:"1rem"}}>Event Breakdown</h3>
     </div>
     <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
       <thead>
        <tr style={{background:"var(--surface2)"}}>
         {["Event","Category","Date","Registered","Attended","Att. Rate","Revenue"].map(h=>(
          <th key={h} style={{padding:"0.75rem 1rem",textAlign:h==="Revenue"?"right":h==="Event"?"left":"center",fontSize:"0.72rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>{h}</th>
         ))}
        </tr>
       </thead>
       <tbody>
        {eventBreakdown.map((ev:any)=>(
         <tr key={ev._id} style={{borderTop:"1px solid var(--border)"}}>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.88rem"}}>
           <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
            {ev.featured&&<span style={{color:"var(--yellow)"}}>⭐</span>}
            <Link href={`${basePath}/events/${ev._id}`} style={{color:"var(--text)",textDecoration:"none",fontWeight:500}}>{ev.title}</Link>
           </div>
          </td>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.8rem",textAlign:"center",color:"var(--muted)"}}>{ev.category}</td>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.8rem",textAlign:"center",color:"var(--muted)"}}>{new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</td>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.88rem",textAlign:"center",fontWeight:600}}>{ev.registered}</td>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.88rem",textAlign:"center",fontWeight:600,color:"var(--green)"}}>{ev.attended}</td>
          <td style={{padding:"0.75rem 1rem",textAlign:"center"}}>
           <div style={{display:"flex",alignItems:"center",gap:"0.4rem",justifyContent:"center"}}>
            <div style={{width:"40px",height:"4px",background:"var(--border)",borderRadius:"999px",overflow:"hidden"}}>
             <div style={{width:`${ev.attendanceRate}%`,height:"100%",background:ev.attendanceRate>70?"var(--green)":ev.attendanceRate>40?"var(--yellow)":"var(--red)",borderRadius:"999px"}}></div>
            </div>
            <span style={{fontSize:"0.75rem",color:"var(--muted)"}}>{ev.attendanceRate}%</span>
           </div>
          </td>
          <td style={{padding:"0.75rem 1rem",fontSize:"0.88rem",textAlign:"right",fontWeight:600,color:ev.revenue>0?"var(--green)":"var(--muted)"}}>₹{ev.revenue}</td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>
   )}
  </div>
 )
}