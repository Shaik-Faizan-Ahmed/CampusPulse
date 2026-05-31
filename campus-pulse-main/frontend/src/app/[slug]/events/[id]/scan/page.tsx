"use client"

import {useParams} from "next/navigation"
import {useEffect,useState} from "react"
import Link from "next/link"
import Script from "next/script"
import {apiFetch} from "@/lib/api"

export default function ScanEntry(){
 const params=useParams()
 const slug=params.slug as string
 const id=params.id as string
 const basePath=`/${slug}`

 const[event,setEvent]=useState<any>(null)
 const[scanStatus,setScanStatus]=useState("Initializing camera...")
 const[scriptLoaded,setScriptLoaded]=useState(false)

 useEffect(()=>{
  apiFetch(`/${slug}/events/${id}`)
   .then(r=>r.ok?r.json():null)
   .then(d=>setEvent(d?.event||d))
 },[slug,id])

 useEffect(()=>{
  if(!scriptLoaded)return
  startScanner()
 },[scriptLoaded])

 const startScanner=()=>{
  const win=window as any
  if(!win.Html5Qrcode)return
  const html5QrCode=new win.Html5Qrcode("reader")
  ;(win as any).__qrScanner=html5QrCode
  html5QrCode.start(
   {facingMode:"environment"},
   {fps:10,qrbox:{width:240,height:240}},
   (decoded:string)=>{
    html5QrCode.stop().catch(()=>{})
    window.location.href=decoded
   },
   ()=>{}
  ).then(()=>{
   setScanStatus("✅ Camera ready — waiting for QR")
  }).catch(()=>{
   setScanStatus("⚠️ Camera unavailable. Ask student to show QR and enter URL manually.")
  })
 }

 return(
  <>
   <Script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js" onLoad={()=>setScriptLoaded(true)}/>
   <div style={{maxWidth:"520px",margin:"2rem auto",padding:"0 1rem"}}>
    <Link href={`${basePath}/events/${id}/participants`} style={{color:"var(--muted)",textDecoration:"none",fontSize:"0.88rem"}}>← Back to Participants</Link>

    <div style={{marginTop:"1.5rem"}}>
     <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.4rem"}}>
      <div style={{width:"48px",height:"48px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>📷</div>
      <div>
       <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.5rem",fontWeight:800}}>Scan Entry QR</h1>
       <p style={{color:"var(--muted)",fontSize:"0.83rem"}}>{event?.title}</p>
      </div>
     </div>

     <div className="qr-card" style={{marginTop:"1.2rem",padding:"1.5rem"}}>
      <p style={{color:"var(--muted)",fontSize:"0.83rem",marginBottom:"1rem",textAlign:"center"}}>Point camera at student's QR code</p>
      <div id="reader" style={{borderRadius:"12px",overflow:"hidden",width:"100%"}}></div>
      <p style={{textAlign:"center",marginTop:"0.8rem",fontSize:"0.83rem",color:"var(--muted)"}}>{scanStatus}</p>
     </div>

     <div style={{marginTop:"1.2rem",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"10px",padding:"1rem"}}>
      <p style={{fontSize:"0.78rem",color:"var(--muted)",lineHeight:"1.9"}}>
       <strong style={{color:"var(--text)"}}>Instructions:</strong><br/>
       1. Ask the student to open their <strong>My Events → Show Entry QR</strong><br/>
       2. Point this camera at their QR code<br/>
       3. Entry is approved automatically and attendance is marked<br/>
       4. Each student's QR is unique — duplicates are rejected
      </p>
     </div>
    </div>
   </div>
  </>
 )
}