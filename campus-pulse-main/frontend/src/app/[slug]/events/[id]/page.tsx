"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function EventDetail() {
  const params = useParams()
  const slug = params.slug as string
  const id = params.id as string
  const basePath = `/${slug}`

  const [data, setData] = useState<any>(null)

  useEffect(() => {
    apiFetch(`/${slug}/events/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(setData)
  }, [slug, id])

  if (!data) return null

  const { event, user, userRole, isRegistered } = data
  const pct = event.maxSeats > 0 ? Math.round((event.registeredCount / event.maxSeats) * 100) : 0

  const handleRegister = async () => {
    const res = await apiFetch(`${basePath}/events/${id}/register`, { method: "POST" })
    if (res.ok) { window.location.reload() }
    else { const d = await res.json().catch(() => ({})); alert(d.error || "Registration failed") }
  }

  const handlePay = async () => {
    try {
      const res = await apiFetch(`${basePath}/events/${id}/create-order`, { method: "POST", headers: { "Content-Type": "application/json" } })
      const result = await res.json()
      if (!res.ok) { alert("Error: " + result.error); return }
      const win = window as any
      const options = {
        key: result.key_id, amount: result.order.amount, currency: result.order.currency,
        name: event.title, description: "Registration Fee", order_id: result.order.id,
        handler: (response: any) => {
          const form = document.createElement("form")
          form.method = "POST"
          form.action = `${basePath}/events/${id}/verify-payment`
          ;["razorpay_payment_id", "razorpay_order_id", "razorpay_signature"].forEach(k => {
            const inp = document.createElement("input")
            inp.type = "hidden"; inp.name = k; inp.value = response[k]
            form.appendChild(inp)
          })
          document.body.appendChild(form); form.submit()
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#6366f1" }
      }
      const rzp = new win.Razorpay(options)
      rzp.on("payment.failed", (r: any) => { alert("Payment Failed! " + r.error.description) })
      rzp.open()
    } catch { alert("Something went wrong. Please try again later.") }
  }

  return (
    <div className="detail-container">
      <Link href={`${basePath}/events`} style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.88rem" }}>← Back to Events</Link>

      <div className="detail-header" style={{ marginTop: "1.25rem" }}>
        <div className="detail-img">
          {event.image ? <img src={event.image} alt={event.title} /> : <span>{event.catEmoji}</span>}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <span className={`badge badge-${event.category}`}>{event.catEmoji} {event.category}</span>
          <span className={`badge badge-${event.status}`}>{event.status}</span>
          <span className="badge badge-price" style={{ background: event.isPaid ? "var(--yellow)" : "var(--green)", color: "#000" }}>
            {event.isPaid ? `₹${event.registrationFee}` : "Free"}
          </span>
          {event.featured && <span className="badge" style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", border: "1px solid rgba(234,179,8,0.3)" }}>⭐ Featured</span>}
        </div>
        <h1 className="detail-title">{event.title}</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Created by <strong style={{ color: "var(--text)" }}>{event.createdBy?.name}</strong></p>
      </div>

      <div className="detail-body">
        <div>
          <h3 style={{ fontFamily: "var(--font-main)", marginBottom: "0.75rem", fontSize: "1.1rem" }}>About this Event</h3>
          <p className="detail-desc">{event.description}</p>

          {user && userRole === "student" ? (
            isRegistered ? (
              <>
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1rem" }}>
                  <p style={{ color: "var(--green)", fontWeight: 600, marginBottom: "0.4rem" }}>✓ You're registered for this event!</p>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Check My Events to see your attendance QR during the event.</p>
                </div>
                <Link href={`${basePath}/events/my-events`} className="btn btn-outline" style={{ width: "auto" }}>Go to My Events</Link>
              </>
            ) : event.status === "Completed" ? (
              <button className="btn btn-muted" style={{ width: "auto" }} disabled>Event has ended</button>
            ) : event.maxSeats > 0 && event.registeredCount >= event.maxSeats ? (
              <button className="btn btn-muted" style={{ width: "auto" }} disabled>Event is Full</button>
            ) : event.isPaid ? (
              <>
                <script src="https://checkout.razorpay.com/v1/checkout.js" async />
                <button className="btn btn-primary" id="payButton" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={handlePay}>Pay ₹{event.registrationFee} &amp; Register →</button>
              </>
            ) : (
              <button className="btn btn-primary" style={{ width: "auto", padding: "0.7rem 2rem" }} onClick={handleRegister}>Register for this Event →</button>
            )
          ) : user && (userRole === "admin" || userRole === "coordinator") ? (
            <div className="btn-group" style={{ flexWrap: "wrap" }}>
              <Link href={`${basePath}/events/${id}/scan`} className="btn btn-primary btn-sm" style={{ width: "auto", background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>📷 Scan Entry QR</Link>
              <Link href={`${basePath}/events/${id}/participants`} className="btn btn-outline btn-sm" style={{ width: "auto" }}>👥 Participants</Link>
              <Link href={`${basePath}/events/${id}/qr`} className="btn btn-outline btn-sm" style={{ width: "auto" }}>📱 Event QR</Link>
              <Link href={`${basePath}/events/${id}/edit`} className="btn btn-outline btn-sm" style={{ width: "auto" }}>✏️ Edit</Link>
              <button onClick={async()=>{ if(!confirm("Are you sure you want to delete this event? This action cannot be undone."))return; const res=await apiFetch(`${basePath}/events/${id}`,{method:"DELETE"}); if(res.ok)window.location.href=`${basePath}/events` }} className="btn btn-sm confirm-delete" style={{ width: "auto", background: "rgba(239,68,68,0.12)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.3)" }}>🗑️ Delete</button>
            </div>
          ) : null}
        </div>

        <div className="detail-info-card">
          <h3 style={{ fontFamily: "var(--font-main)", marginBottom: "1rem", fontSize: "1rem" }}>Event Details</h3>
          {[
            { icon: "📅", label: "Date & Time", val: new Date(event.date).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" }) },
            { icon: "📍", label: "Venue", val: event.venue },
            { icon: "⏱", label: "Duration", val: `${event.durationHours} hours` },
            { icon: "🏷", label: "Category", val: `${event.catEmoji} ${event.category}` },
            { icon: "👥", label: "Registrations", val: `${event.registeredCount} registered${event.maxSeats > 0 ? ` / ${event.maxSeats} seats` : " (unlimited)"}` },
            { icon: "🤝", label: "Team Size", val: `${event.teamSize || 1} ${(event.teamSize || 1) === 1 ? "member (Individual)" : "members"}` },
          ].map(row => (
            <div key={row.label} className="info-row">
              <span className="icon">{row.icon}</span>
              <div><div className="label">{row.label}</div><div className="val">{row.val}</div></div>
            </div>
          ))}
          {event.registrationDeadline && (
            <div className="info-row">
              <span className="icon">🏁</span>
              <div>
                <div className="label">Reg. Deadline</div>
                <div className="val" style={{ color: event.deadlinePassed ? "var(--red)" : "" }}>
                  {new Date(event.registrationDeadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  {event.deadlinePassed ? " (Closed)" : ""}
                </div>
              </div>
            </div>
          )}
          {event.maxSeats > 0 && (
            <div className="seats-bar" style={{ marginTop: "0.5rem" }}>
              <div className="seats-fill" style={{ width: `${pct}%`, background: pct > 90 ? "var(--red)" : pct > 60 ? "var(--yellow)" : "var(--accent)" }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
