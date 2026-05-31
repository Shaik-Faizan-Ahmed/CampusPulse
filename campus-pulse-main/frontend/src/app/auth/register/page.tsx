"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const params = useSearchParams()
  const slug = params.get("slug")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) { alert("Passwords do not match"); return }
    setLoading(true)
    const res = await apiFetch(
      slug ? `/${slug}/auth/register` : "/auth/register",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password, confirmPassword }) }
    )
    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      router.push(data.redirect || (slug ? `/${slug}/events` : "/my-organizations"))
    } else {
      const data = await res.json().catch(() => ({}))
      alert(data.error || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-sub">{slug ? "Create an account and join this organization" : "Join the Campus Pulse event platform"}</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="Your full name" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="you@college.edu" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Min. 6 characters" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : (slug ? "Create Account & Join" : "Create Account")}
            </button>
          </div>
        </form>

        <p className="form-link">
          Already registered?{" "}
          <Link href={slug ? `/${slug}/auth/login` : "/auth/login"}>Login here</Link>
        </p>
        {slug && (
          <p className="form-link" style={{ marginTop: "0.5rem" }}>
            <Link href="/auth/register" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Register without joining org →</Link>
          </p>
        )}
      </div>
    </div>
  )
}
