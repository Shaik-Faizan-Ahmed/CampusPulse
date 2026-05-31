"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function Announcements() {
  const params = useParams()
  const slug = params.slug as string
  const basePath = `/${slug}`

  const [data, setData] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [targetType, setTargetType] = useState("ALL")
  const [eventId, setEventId] = useState("")

  useEffect(() => {
    apiFetch(`/${slug}/announcements`)
      .then(r => r.ok ? r.json() : null)
      .then(setData)
  }, [slug])

  const announcements = data?.announcements || []
  const canCreate = data?.canCreate || false
  const events = data?.events || []

  const postAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await apiFetch(`${basePath}/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, targetType, eventId: targetType === "EVENT" ? eventId : undefined })
    })
    if (res.ok) { setShowModal(false); setTitle(""); setMessage(""); setTargetType("ALL"); setEventId(""); window.location.reload() }
    else { const d = await res.json().catch(() => ({})); alert(d.error || "Failed") }
  }

  const deleteAnn = async (annId: string) => {
    if (!confirm("Delete this announcement?")) return
    await apiFetch(`${basePath}/announcements/${annId}?_method=DELETE`, { method: "POST" })
    window.location.reload()
  }

  return (
    <div className="announcements-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1.5rem 3rem" }}>
      <div className="page-header" style={{ textAlign: "left", padding: "2rem 0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 800 }}>📢 <span>Announcements</span></h1>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.4rem" }}>{canCreate ? "Post and manage announcements" : "Stay updated with the latest news"}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href={`${basePath}/events`} className="btn btn-outline btn-sm">← Events</Link>
            {canCreate && <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">+ Post Announcement</button>}
          </div>
        </div>
      </div>

      {announcements.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📢</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", color: "var(--muted)", marginBottom: "0.5rem" }}>No announcements yet</h3>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{canCreate ? "Click the button above to post the first announcement" : "Check back later for updates"}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {announcements.map((ann: any) => (
            <div key={ann._id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.5rem" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1rem" }}>{ann.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  {ann.targetType === "ALL" ? (
                    <span className="badge" style={{ background: "rgba(34,197,94,0.12)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.25)" }}>👥 All Members</span>
                  ) : (
                    <span className="badge" style={{ background: "rgba(59,130,246,0.12)", color: "var(--blue)", border: "1px solid rgba(59,130,246,0.25)" }}>📅 {ann.event?.title || "Event"}</span>
                  )}
                </div>
              </div>
              <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: "0.75rem" }}>{ann.message}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  🕐 {new Date(ann.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}{ann.createdBy ? ` · by ${ann.createdBy.name}` : ""}
                </span>
                {canCreate && (
                  <button onClick={() => deleteAnn(ann._id)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.78rem", padding: "0.25rem 0.5rem", borderRadius: "6px" }}>🗑️ Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {canCreate && showModal && (
        <div style={{ display: "flex", position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "2rem", width: "min(500px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.3rem" }}>📢 Post Announcement</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Notify members with an update</p>
            <form onSubmit={postAnnouncement}>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" placeholder="e.g. Important Update" required value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" placeholder="Write your announcement here..." required style={{ minHeight: "100px" }} value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Target Audience</label>
                <select name="targetType" value={targetType} onChange={e => setTargetType(e.target.value)}>
                  <option value="ALL">All Members</option>
                  <option value="EVENT">Specific Event</option>
                </select>
              </div>
              {targetType === "EVENT" && (
                <div className="form-group">
                  <label>Select Event</label>
                  <select name="eventId" value={eventId} onChange={e => setEventId(e.target.value)}>
                    <option value="">Select an event...</option>
                    {events.map((ev: any) => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Post Announcement</button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ width: "auto" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
