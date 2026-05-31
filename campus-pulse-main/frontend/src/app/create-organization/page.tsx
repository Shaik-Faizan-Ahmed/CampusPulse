"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function CreateOrg() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData()
    form.append("name", name)
    form.append("slug", slug)
    form.append("description", description)
    if (logo) form.append("logo", logo)
    try {
      const res = await apiFetch("/create-organization", { method: "POST", body: form })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        router.push(data.slug ? `/${data.slug}/events` : "/my-organizations")
      } else {
        alert(data.error || "Failed to create organization")
      }
    } catch (err) {
      alert("Network error — please try again")
    }
    setLoading(false)
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>🏢 Create Organization</h1>
        <p>Set up your event portal — you'll get a unique URL to share with your community</p>

        <form onSubmit={submit} encType="multipart/form-data">
          <div className="form-group">
            <label>Organization Name *</label>
            <input type="text" name="name" placeholder="e.g. IIT Hyderabad, Tech Club, IEEE Chapter" required value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Custom URL Slug</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "0.25rem" }}>
              <span style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRight: "none", borderRadius: "var(--radius) 0 0 var(--radius)", padding: "0.65rem 0.75rem", fontSize: "0.85rem", color: "var(--muted)", whiteSpace: "nowrap" }}>campuspulse.com/</span>
              <input type="text" name="slug" placeholder="iit-hyderabad"
                style={{ borderRadius: "0 var(--radius) var(--radius) 0", flex: "1" }}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                title="Lowercase letters, numbers, and hyphens only"
                value={slug} onChange={e => setSlug(e.target.value)} />
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.4rem" }}>Leave empty to auto-generate from name. Use lowercase letters, numbers, and hyphens.</p>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="What does your organization do? Who are your members?" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Logo (optional)</label>
            <input type="file" name="logo" accept="image/*" style={{ color: "var(--muted)" }} onChange={e => setLogo(e.target.files?.[0] || null)} />
          </div>

          <div style={{ background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: "1.7" }}>
              <strong style={{ color: "var(--accent)" }}>👑 You'll be the admin.</strong> You can:<br />
              • Create and manage events<br />
              • Add coordinators and members<br />
              • Track registrations and attendance<br />
              • Share your unique org URL with your community
            </p>
          </div>

          <div className="form-submit">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Create Organization →"}</button>
          </div>
        </form>

        <div style={{ marginTop: "1rem" }}>
          <Link href="/" className="btn btn-outline">← Back</Link>
        </div>
      </div>
    </div>
  )
}
