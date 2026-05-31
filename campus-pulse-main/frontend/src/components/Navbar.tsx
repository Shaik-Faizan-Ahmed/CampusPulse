"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { apiFetch } from "@/lib/api"

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark"
  const next = current === "dark" ? "light" : "dark"
  document.documentElement.setAttribute("data-theme", next)
  localStorage.setItem("cp-theme", next)
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [org, setOrg] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [flashSuccess, setFlashSuccess] = useState<string | null>(null)
  const [flashError, setFlashError] = useState<string | null>(null)
  const params = useParams()
  const pathname = usePathname()
  const slug = params?.slug as string | undefined
  const isLanding = pathname === "/"

  useEffect(() => {
    apiFetch("/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data.user) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!slug) return
    apiFetch(`/auth/org/${slug}`, { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setOrg(d.org); setUserRole(d.userRole) } })
      .catch(() => {})
  }, [slug])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sp = new URLSearchParams(window.location.search)
    const s = sp.get("success")
    const e = sp.get("error")
    if (s) setFlashSuccess(s)
    if (e) setFlashError(e)
  }, [pathname])

  const basePath = slug ? `/${slug}` : ``

  return (
    <>
      <nav className="navbar">
        {org ? (
          <a href={`/${org.slug}/events`} className="logo">
            {org.logo && <img src={org.logo} alt={org.name} style={{ height: "24px", width: "24px", borderRadius: "6px", objectFit: "cover", marginRight: "6px", verticalAlign: "middle" }} />}
            {org.name}
          </a>
        ) : (
          <Link href="/" className="logo">campus<span>pulse</span></Link>
        )}

        <div className="nav-right">
          {user && (
            <>
              {org && userRole ? (
                <>
                  <span className="nav-user">
                    {userRole === "admin" ? "👑" : userRole === "coordinator" ? "🎯" : "🎓"} {user.name}
                  </span>
                  {userRole === "student" && (
                    <>
                      <Link href={`${basePath}/events/my-events`} className="nav-btn">My Events</Link>
                      <Link href={`${basePath}/announcements`} className="nav-btn">📢 Announcements</Link>
                    </>
                  )}
                  {(userRole === "admin" || userRole === "coordinator") && (
                    <>
                      <Link href={`${basePath}/events/new`} className="nav-btn primary">+ Create Event</Link>
                      <Link href={`${basePath}/announcements`} className="nav-btn">📢 Announcements</Link>
                    </>
                  )}
                  {userRole === "admin" && (
                    <>
                      <Link href={`${basePath}/analytics`} className="nav-btn">📊 Analytics</Link>
                      <div className="dropdown" style={{ position: "relative", display: "inline-block" }}>
                        <Link href={`${basePath}/manage`} className="nav-btn">⚙️ Manage ▾</Link>
                        <div className="dropdown-content">
                          <Link href={`${basePath}/manage`}>Members &amp; Settings</Link>
                          <Link href={`${basePath}/manage/customize`}>🎨 Customize Page</Link>
                        </div>
                      </div>
                    </>
                  )}
                  <Link href="/my-organizations" className="nav-btn" title="Switch Organization">🔄 Orgs</Link>
                </>
              ) : (
                <>
                  <span className="nav-user">{user.name}</span>
                  <Link href="/my-organizations" className="nav-btn">My Organizations</Link>
                  <Link href="/create-organization" className="nav-btn primary">+ Create Org</Link>
                </>
              )}
              <Link href="/auth/logout" className="nav-btn danger">Logout</Link>
            </>
          )}
          {isLanding && (
            <button onClick={toggleTheme} className="nav-btn" title="Toggle Theme" style={{ padding: "0.4rem 0.6rem" }}>🌓</button>
          )}
        </div>
      </nav>

      <style>{`.dropdown-content{display:none;position:absolute;top:100%;right:0;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:0.5rem;min-width:150px;z-index:100;box-shadow:0 4px 12px rgba(0,0,0,0.1)}.dropdown:hover .dropdown-content{display:block}.dropdown-content a:hover{background:var(--surface2);border-radius:4px}.dropdown-content a{display:block;padding:0.5rem;color:var(--text);text-decoration:none;font-size:0.85rem}`}</style>

      {flashSuccess && <div className="flash flash-success">{flashSuccess}</div>}
      {flashError && <div className="flash flash-error">{flashError}</div>}
    </>
  )
}
