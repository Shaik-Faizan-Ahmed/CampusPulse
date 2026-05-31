"use client"

import {useState} from "react"
import {useRouter,useSearchParams} from "next/navigation"
import {apiFetch} from "@/lib/api"

export default function VerifyOtp(){
 const router=useRouter()
 const params=useSearchParams()
 const email=params.get("email")||""
 const slug=params.get("slug")
 const[otp,setOtp]=useState("")

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault()
  const res=await apiFetch(
   slug?`/${slug}/auth/verify-otp`:"/auth/verify-otp",
   {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,otp})}
  )
  if(res.ok){
   const data=await res.json().catch(()=>({}))
   router.push(data.redirect||(slug?`/${slug}/events`:"/my-organizations"))
  }else{
   alert("Invalid OTP")
  }
 }

 const resend=async()=>{
  await apiFetch(
   slug?`/${slug}/auth/resend-otp`:"/auth/resend-otp",
   {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})}
  )
  alert("OTP resent!")
 }

 return(
  <div className="auth-page">
   <div className="auth-card" style={{textAlign:"center"}}>
    <h2 className="auth-title">Verify Your Email</h2>
    <p className="auth-sub" style={{marginBottom:"2rem"}}>
     We've sent a 6-digit code to <strong>{email}</strong>.<br/>
     Please enter it below to verify your account.
    </p>

    <form onSubmit={submit} style={{textAlign:"left"}}>
     <input type="hidden" name="email" value={email}/>
     <div className="form-group">
      <label htmlFor="otp">Verification Code</label>
      <input
       type="text" id="otp" name="otp" placeholder="123456" required
       autoComplete="one-time-code"
       style={{fontSize:"1.5rem",letterSpacing:"0.5rem",textAlign:"center",fontWeight:"bold",padding:"1rem"}}
       value={otp} onChange={e=>setOtp(e.target.value)}
      />
     </div>
     <div className="form-submit">
      <button type="submit" className="btn btn-primary" style={{width:"100%"}}>Verify Account</button>
     </div>
    </form>

    <p className="form-link" style={{marginTop:"1.5rem"}}>
     Didn't receive the code?{" "}
     <button type="button" onClick={resend} style={{background:"none",border:"none",color:"var(--accent)",padding:"0",font:"inherit",cursor:"pointer",textDecoration:"underline"}}>
      Resend OTP
     </button>
    </p>
   </div>
  </div>
 )
}