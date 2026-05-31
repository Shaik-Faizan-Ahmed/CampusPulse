"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [organizations, setOrganizations] = useState<any[]>([])

  useEffect(() => {
    apiFetch("/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data.user) })
      .catch(() => {})

    apiFetch("/organizations/public")
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setOrganizations(data) })
      .catch(() => {})
  }, [])

  return (
    <>
      <div className="landing-hero" style={{ position: "relative", overflowX: "clip" }}>
        <style>{`
          .hero-polaroids {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 110%;
            max-width: 1600px;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
            z-index: 0;
            padding: 0 1rem;
          }
          .polaroid-card {
            background: #ffffff;
            padding: 12px 12px 50px 12px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            border-radius: 4px;
            width: 280px;
            pointer-events: auto;
            transition: transform 0.3s ease;
          }
          .polaroid-card:hover {
            transform: scale(1.05) rotate(0deg) !important;
            z-index: 10;
          }
          .polaroid-card img {
            width: 100%;
            height: 320px;
            object-fit: cover;
            display: block;
            background: #f0f0f0;
            border-radius: 2px;
          }
          .polaroid-left {
            transform: rotate(-6deg) translate(-30px, 20px);
          }
          .polaroid-right {
            transform: rotate(8deg) translate(30px, -20px);
          }
          .hero-content {
            position: relative;
            z-index: 2;
            background: transparent;
          }
          @media (max-width: 1100px) {
            .hero-polaroids {
              opacity: 0.15;
            }
          }
          @media (max-width: 768px) {
            .hero-polaroids {
              display: none;
            }
          }
        `}</style>

        <div className="hero-polaroids">
          <div className="polaroid-card polaroid-left">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80" alt="Team collaborating" />
          </div>
          <div className="polaroid-card polaroid-right">
            <img src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80" alt="Concert crowd" />
          </div>
        </div>

        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">Campus Events, Simplified</div>
          <h1 className="hero-title">
            Run better events<br />
            <span>for your campus.</span>
          </h1>
          <p className="hero-subtitle">
            Stop keeping track of registrations on messy spreadsheets. Set up a simple portal for your college fests, club meetings, and sports tournaments.
          </p>
          <div className="hero-actions" style={{ position: "relative", zIndex: 3 }}>
            {user ? (
              <>
                <Link href="/create-organization" className="btn btn-primary hero-btn">+ Create Your Organization</Link>
                <Link href="/my-organizations" className="btn btn-outline hero-btn">My Organizations</Link>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="btn btn-primary hero-btn">Get Started Free →</Link>
                <Link href="/auth/login" className="btn btn-outline hero-btn" style={{ background: "var(--surface)" }}>Sign In</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="landing-features">
        <div className="features-header">
          <h2>Built for <span>campus life</span></h2>
          <p>Everything you need to run college events smoothly, without the spreadsheets</p>
        </div>
        <div className="features-grid">
          <div className="feature-card"><div className="feature-icon">🏢</div><h3>Dedicated Hubs</h3><p>Set up a branded page for your college club or department. Give students one place to find what's happening.</p></div>
          <div className="feature-card"><div className="feature-icon">📱</div><h3>Fast Check-ins</h3><p>Ditch the paper lists. Generate unique QR codes for tickets so you can scan attendees at the door instantly.</p></div>
          <div className="feature-card"><div className="feature-icon">👥</div><h3>Team Collaboration</h3><p>Add your volunteers or coordinators and assign roles so everyone can help manage the crowd.</p></div>
          <div className="feature-card"><div className="feature-icon">📊</div><h3>Live Headcounts</h3><p>Know exactly how many seats are left and who actually showed up at any moment.</p></div>
          <div className="feature-card"><div className="feature-icon">🎨</div><h3>Smart Grouping</h3><p>Tag events as technical, sports, or workshops so students can filter and find exactly what they're into.</p></div>
          <div className="feature-card"><div className="feature-icon">🔒</div><h3>Fully Isolated</h3><p>Your college's data stays with your college. Keep your student registrations secure and private.</p></div>
        </div>
      </section>

      {organizations?.length > 0 && (
        <section className="landing-orgs">
          <div className="orgs-header">
            <h2>Active <span>Organizations</span></h2>
            <p>Explore events from organizations already on Campus Pulse</p>
          </div>
          <div className="orgs-grid">
            {organizations.map(org => (
              <Link key={org.id} href={`/${org.slug}/auth/login`} className="org-card">
                <div className="org-card-logo">
                  {org.logo ? <img src={org.logo} /> :
                    <span>{org.name.charAt(0).toUpperCase()}</span>}
                </div>
                <div className="org-card-info">
                  <h3>{org.name}</h3>
                  <p className="org-slug">/{org.slug}</p>
                  <div className="org-meta">
                    <span>👥 {org.memberCount} members</span>
                  </div>
                </div>
                <div className="org-card-arrow">→</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="landing-cta">
        <div className="cta-card">
          <h2>Ready to get started?</h2>
          <p>Set up your college or club group in seconds and make your next event a breeze.</p>
          {user ?
            <Link href="/create-organization" className="btn btn-primary hero-btn">+ Create Organization</Link>
            :
            <Link href="/auth/register" className="btn btn-primary hero-btn">Sign Up Free →</Link>
          }
        </div>
      </section>
    </>
  )
}
