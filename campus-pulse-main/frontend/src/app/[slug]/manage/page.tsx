"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function ManageOrg() {
  const params = useParams()
  const slug = params.slug as string
  const basePath = `/${slug}`

  const [data, setData] = useState<any>(null)
  const [addEmail, setAddEmail] = useState("")
  const [addRole, setAddRole] = useState("student")
  const [rzpKeyId, setRzpKeyId] = useState("")
  const [rzpKeySecret, setRzpKeySecret] = useState("")

  useEffect(() => {
    apiFetch(`/${slug}/manage`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) { setData(d); setRzpKeyId(d.orgData?.razorpayKeyId || "") }
      })
  }, [slug])

  if (!data) return null
  const { org, activeMembers, pendingApplicants } = data
  const orgData = org  // org serves as orgData

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await apiFetch(`${basePath}/manage/add-member`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: addEmail, role: addRole }) })
    if (res.ok) { setAddEmail(""); window.location.reload() }
    else { const d = await res.json().catch(() => ({})); alert(d.error || "Failed") }
  }

  const changeRole = async (userId: string, role: string) => {
    await apiFetch(`${basePath}/manage/change-role`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role }) })
    window.location.reload()
  }

  const suspendMember = async (userId: string) => {
    if (!confirm("Suspend this member?")) return
    await apiFetch(`${basePath}/manage/suspend-member`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) })
    window.location.reload()
  }

  const removeMember = async (userId: string) => {
    if (!confirm("Remove this member?")) return
    await apiFetch(`${basePath}/manage/remove-member`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) })
    window.location.reload()
  }

  const approveApplicant = async (userId: string) => {
    await apiFetch(`${basePath}/manage/approve-organizer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) })
    window.location.reload()
  }

  const rejectApplicant = async (userId: string) => {
    if (!confirm("Reject this coordinator application?")) return
    await apiFetch(`${basePath}/manage/reject-organizer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) })
    window.location.reload()
  }

  const saveRazorpay = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await apiFetch(`${basePath}/manage/razorpay-config`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ keyId: rzpKeyId, keySecret: rzpKeySecret }) })
    if (res.ok) alert("Payment keys saved!")
    else { const d = await res.json().catch(() => ({})); alert(d.error || "Failed") }
  }

  return (
    <div className="manage-container">
      <Link href={`${basePath}/events`} style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.88rem" }}>← Back to Events</Link>

      <div style={{ marginTop: "1.25rem", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800 }}>
          Manage <span style={{ color: "var(--accent)" }}>{org.name}</span>
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "0.3rem" }}>/{org.slug} · {activeMembers.length + pendingApplicants.length} members</p>
      </div>

      {/* Razorpay Config */}
      <div className="form-card" style={{ marginBottom: "2rem", border: "1px solid var(--accent)", background: "rgba(99,102,241,0.03)" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "0.5rem" }}>💳 Payment Configuration (Razorpay)</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Payments for your events will go directly to your Razorpay account.{" "}
          <br /><span style={{ color: "var(--red)" }}>Note: If not configured, students won't be able to pay for your paid events.</span>
        </p>
        <form onSubmit={saveRazorpay}>
          <div className="form-row">
            <div className="form-group">
              <label>Razorpay Key ID</label>
              <input type="text" name="keyId" value={rzpKeyId} onChange={e => setRzpKeyId(e.target.value)} placeholder="rzp_test_..." required />
            </div>
            <div className="form-group">
              <label>Razorpay Key Secret</label>
              <input type="password" name="keySecret" value={rzpKeySecret} onChange={e => setRzpKeySecret(e.target.value)} placeholder="Required for verifying payments" required />
            </div>
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "1rem" }}>Find these in your Razorpay Dashboard &gt; Settings &gt; API Keys.</p>
          <button type="submit" className="btn btn-primary btn-sm" style={{ width: "auto" }}>Save Payment Keys</button>
        </form>
      </div>

      {/* Add Member */}
      <div className="form-card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "1rem" }}>➕ Add Member</h3>
        <form onSubmit={addMember}>
          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="user@college.edu" required value={addEmail} onChange={e => setAddEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={addRole} onChange={e => setAddRole(e.target.value)}>
                <option value="student">🎓 Student</option>
                <option value="coordinator">🎯 Coordinator</option>
                <option value="admin">👑 Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{ width: "auto" }}>Add Member</button>
        </form>
      </div>

      {/* Pending Coordinator Applications */}
      {pendingApplicants?.length > 0 && (
        <div className="form-card" style={{ marginBottom: "2rem", border: "1px solid rgba(234,179,8,0.4)", background: "rgba(234,179,8,0.04)" }}>
          <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "0.5rem" }}>
            ⏳ Pending Coordinator Applications{" "}
            <span style={{ fontSize: "0.85rem", color: "var(--yellow)", background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: "20px", padding: "0.15rem 0.6rem", marginLeft: "0.4rem" }}>{pendingApplicants.length}</span>
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>These students have applied to become coordinators. Review and approve or reject their applications.</p>
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th style={{ textAlign: "center" }}>Actions</th></tr></thead>
            <tbody>
              {pendingApplicants.map((m: any, i: number) => (
                <tr key={m.user.id}>
                  <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                  <td><strong>{m.user.name}</strong></td>
                  <td style={{ color: "var(--muted)" }}>{m.user.email}</td>
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                      <button onClick={() => approveApplicant(m.user.id)} className="btn btn-sm" style={{ width: "auto", padding: "0.3rem 0.75rem", fontSize: "0.78rem", background: "rgba(34,197,94,0.12)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.3)" }}>✅ Approve</button>
                      <button onClick={() => rejectApplicant(m.user.id)} className="btn btn-sm" style={{ width: "auto", padding: "0.3rem 0.75rem", fontSize: "0.78rem", background: "rgba(239,68,68,0.12)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.3)" }}>❌ Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Members Table */}
      <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "1rem" }}>👥 Members</h3>
      {activeMembers.length === 0 ? (
        <div className="empty-state"><p>No members yet</p></div>
      ) : (
        <table>
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th style={{ textAlign: "center" }}>Actions</th></tr>
          </thead>
          <tbody>
            {activeMembers.map((m: any, i: number) => (
              <tr key={m.user.id}>
                <td style={{ color: "var(--muted)" }}>{i + 1}</td>
                <td><strong>{m.user.name}</strong></td>
                <td style={{ color: "var(--muted)" }}>{m.user.email}</td>
                <td>
                  <span className="badge" style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" }}>
                    {m.role === "admin" ? "👑 Admin" : m.role === "coordinator" ? "🎯 Coordinator" : "🎓 Student"}
                  </span>
                </td>
                <td>
                  {m.status === "SUSPENDED" ? (
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "20px", background: "rgba(239,68,68,0.12)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.3)" }}>🚫 Suspended</span>
                  ) : (
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "20px", background: "rgba(34,197,94,0.12)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.3)" }}>• Active</span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {m.user.id !== orgData?.createdBy?.id ? (
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <div style={{ display: "inline-flex", gap: "0.3rem", alignItems: "center" }}>
                        <select defaultValue={m.role} onChange={e => changeRole(m.user.id, e.target.value)} style={{ padding: "0.3rem 0.5rem", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", color: "var(--text)", fontSize: "0.78rem" }}>
                          <option value="student">Student</option>
                          <option value="coordinator">Coordinator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      {m.status === "SUSPENDED" ? (
                        <button onClick={() => changeRole(m.user.id, m.role)} className="btn btn-sm" style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(34,197,94,0.12)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.3)" }}>↩️ Unsuspend</button>
                      ) : (
                        <button onClick={() => suspendMember(m.user.id)} className="btn btn-sm" style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(234,179,8,0.12)", color: "#eab308", border: "1px solid rgba(234,179,8,0.3)" }}>🚫 Suspend</button>
                      )}
                      <button onClick={() => removeMember(m.user.id)} className="btn btn-sm" style={{ width: "auto", padding: "0.3rem 0.6rem", fontSize: "0.75rem", background: "rgba(239,68,68,0.12)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.3)" }}>Remove</button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Creator</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Share Link */}
      <div className="form-card" style={{ marginTop: "2rem" }}>
        <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "0.75rem" }}>🔗 Share Invite Link</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>Share this link so people can register and join your organization:</p>
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.75rem 1rem", fontSize: "0.85rem", wordBreak: "break-all", color: "var(--accent)" }}>
          {typeof window !== "undefined" ? window.location.origin : ""}/{slug}/auth/register
        </div>
      </div>
    </div>
  )
}
