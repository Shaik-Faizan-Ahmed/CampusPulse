"use client"

import {useEffect,useState} from "react"
import {useParams,useRouter} from "next/navigation"
import Link from "next/link"
import {apiFetch} from "@/lib/api"

const categories=["Technical","Non-Technical","Sports","Cultural","Workshop","Other"]

export default function EventForm({editId}:{editId?:string}){
 const params=useParams()
 const slug=params.slug as string
 const router=useRouter()
 const basePath=`/${slug}`

 const[event,setEvent]=useState<any>(null)
 const[title,setTitle]=useState("")
 const[description,setDescription]=useState("")
 const[date,setDate]=useState("")
 const[registrationDeadline,setRegistrationDeadline]=useState("")
 const[venue,setVenue]=useState("")
 const[category,setCategory]=useState("Technical")
 const[durationHours,setDurationHours]=useState(2)
 const[maxSeats,setMaxSeats]=useState(0)
 const[teamSize,setTeamSize]=useState(1)
 const[isPaid,setIsPaid]=useState(false)
 const[registrationFee,setRegistrationFee]=useState(0)
 const[image,setImage]=useState<File|null>(null)
 const[loading,setLoading]=useState(false)

 const isEdit=!!editId

 useEffect(()=>{
  if(!editId)return
  apiFetch(`/${slug}/events/${editId}/edit`)
   .then(r=>r.ok?r.json():null)
   .then(d=>{
    if(!d)return
    const ev=d.event||d
    setEvent(ev)
    setTitle(ev.title||"")
    setDescription(ev.description||"")
    setDate(ev.date?new Date(new Date(ev.date).getTime()-new Date(ev.date).getTimezoneOffset()*60000).toISOString().slice(0,16):"")
    setRegistrationDeadline(ev.registrationDeadline?new Date(new Date(ev.registrationDeadline).getTime()-new Date(ev.registrationDeadline).getTimezoneOffset()*60000).toISOString().slice(0,16):"")
    setVenue(ev.venue||"")
    setCategory(ev.category||"Technical")
    setDurationHours(ev.durationHours||2)
    setMaxSeats(ev.maxSeats||0)
    setTeamSize(ev.teamSize||1)
    setIsPaid(ev.isPaid||false)
    setRegistrationFee(ev.registrationFee||0)
   })
 },[editId,slug])

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault()
  setLoading(true)
  const form=new FormData()
  form.append("title",title)
  form.append("description",description)
  form.append("date",date)
  form.append("registrationDeadline",registrationDeadline)
  form.append("venue",venue)
  form.append("category",category)
  form.append("durationHours",String(durationHours))
  form.append("maxSeats",String(maxSeats))
  form.append("teamSize",String(teamSize))
  form.append("isPaid",String(isPaid))
  form.append("registrationFee",String(registrationFee))
  if(image)form.append("image",image)

  const url=isEdit?`${basePath}/events/${editId}`:`${basePath}/events`
  const method=isEdit?"PUT":"POST"
  const res=await apiFetch(url,{method,body:form})
  if(res.ok){router.push(`${basePath}/events`)}
  else{const d=await res.json().catch(()=>({}));alert(d.error||"Failed")}
  setLoading(false)
 }

 return(
  <div className="form-container">
   <div className="form-card">
    <h1>{isEdit?"✏️ Edit Event":"🎉 Create New Event"}</h1>
    <p>{isEdit?"Update the details for this event":"Fill in the details to publish a new event"}</p>

    <form onSubmit={submit} encType="multipart/form-data">
     <div className="form-group">
      <label>Event Title *</label>
      <input type="text" name="title" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. National Hackathon 2025" required/>
     </div>

     <div className="form-group">
      <label>Description *</label>
      <textarea name="description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="What is this event about? Who should attend?" required/>
     </div>

     <div className="form-row">
      <div className="form-group">
       <label>Event Start (Date &amp; Time) *</label>
       <input type="datetime-local" name="date" value={date} onChange={e=>setDate(e.target.value)} required/>
      </div>
      <div className="form-group">
       <label>Registration Deadline (Optional)</label>
       <input type="datetime-local" name="registrationDeadline" value={registrationDeadline} onChange={e=>setRegistrationDeadline(e.target.value)}/>
      </div>
     </div>

     <div className="form-group">
      <label>Venue *</label>
      <input type="text" name="venue" value={venue} onChange={e=>setVenue(e.target.value)} placeholder="e.g. Seminar Hall A, Ground Floor" required/>
     </div>

     <div className="form-row">
      <div className="form-group">
       <label>Category *</label>
       <select name="category" value={category} onChange={e=>setCategory(e.target.value)}>
        {categories.map(c=><option key={c} value={c}>{c}</option>)}
       </select>
      </div>
      <div className="form-group">
       <label>Duration (hours)</label>
       <input type="number" name="durationHours" value={durationHours} onChange={e=>setDurationHours(parseFloat(e.target.value))} min={0.5} step={0.5}/>
      </div>
     </div>

     <div className="form-row">
      <div className="form-group">
       <label>Max Seats (0 = unlimited)</label>
       <input type="number" name="maxSeats" value={maxSeats} onChange={e=>setMaxSeats(parseInt(e.target.value))} min={0}/>
      </div>
      <div className="form-group">
       <label>Team Size (1 = individual)</label>
       <input type="number" name="teamSize" value={teamSize} onChange={e=>setTeamSize(parseInt(e.target.value))} min={1}/>
      </div>
     </div>

     <div className="form-row">
      <div className="form-group">
       <label>Registration Type *</label>
       <select name="isPaid" value={String(isPaid)} onChange={e=>setIsPaid(e.target.value==="true")}>
        <option value="false">Free</option>
        <option value="true">Paid</option>
       </select>
      </div>
      {isPaid&&(
       <div className="form-group">
        <label>Registration Fee (₹) *</label>
        <input type="number" name="registrationFee" value={registrationFee} onChange={e=>setRegistrationFee(parseInt(e.target.value))} min={0} step={1} required/>
       </div>
      )}
     </div>

     <div className="form-group">
      <label>Event Image (optional)</label>
      <input type="file" name="image" accept="image/*" style={{color:"var(--muted)"}} onChange={e=>setImage(e.target.files?.[0]||null)}/>
      {event?.image&&<p style={{fontSize:"0.78rem",color:"var(--muted)",marginTop:"0.4rem"}}>Current: {event.image} — upload to replace</p>}
     </div>

     <div className="form-submit">
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading?"Saving...":(isEdit?"Save Changes":"Publish Event")}</button>
     </div>
    </form>

    <div style={{marginTop:"1rem"}}>
     <Link href={`${basePath}/events`} className="btn btn-outline">← Cancel</Link>
    </div>
   </div>
  </div>
 )
}