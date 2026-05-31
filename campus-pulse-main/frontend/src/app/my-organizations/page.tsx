"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function MyOrganizations() {
  const [orgs, setOrgs] = useState<any[]>([])

  useEffect(() => {
    apiFetch("/auth/my-organizations", { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setOrgs(data) })
      .catch(() => {})
  }, [])

  return (
    <div className="picker-container">
      <div className="picker-header">
        <h1>My <span>Organizations</span></h1>
        <p>Select an organization to manage its events</p>
      </div>

      {orgs.length > 0 ? (
        <div className="picker-grid">
          {orgs.map(org => (
            <Link key={org.id} href={`/${org.slug}/events`} className="picker-card">
              <div className="picker-card-top">
                <div className="picker-logo">
                  {org.logo ? <img src={org.logo} alt={org.name} /> : <span>{org.name.charAt(0).toUpperCase()}</span>}
                </div>
                <span className="badge" style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" }}>
                  {org.userRole === "admin" ? "👑 Admin" : org.userRole === "coordinator" ? "🎯 Coordinator" : "🎓 Student"}
                </span>
              </div>
              <h3>{org.name}</h3>
              <p className="picker-slug">/{org.slug}</p>
              <div className="picker-meta">
                <span>👥 {org.memberCount} members</span>
              </div>
              <div className="picker-arrow">Enter →</div>
            </Link>
          ))}

          <Link href="/create-organization" className="picker-card picker-card-new">
            <div className="picker-new-icon">+</div>
            <h3>Create Organization</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Start a new event portal</p>
          </Link>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "4rem 2rem" }}>
          <div className="empty-icon">🏢</div>
          <h3 style={{ fontFamily: "'Syne',sans-serif", marginBottom: "0.5rem" }}>No organizations yet</h3>
          <p>Create your first organization or join one via an invite link</p>
          <Link href="/create-organization" className="btn btn-primary" style={{ width: "auto", marginTop: "1.5rem" }}>+ Create Organization</Link>
        </div>
      )}
    </div>
  )
}
