"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const slug = params.get("slug")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await apiFetch(
      slug ? `/${slug}/auth/login` : "/auth/login",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }
    )
    if (res.ok) { router.push(slug ? `/${slug}/events` : "/my-organizations") }
    else { alert("Invalid credentials") }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to access your campus events</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="you@college.edu" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-submit">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          </div>
        </form>

        <p className="form-link">
          Don't have an account?{" "}
          <Link href={slug ? `/${slug}/auth/register` : "/auth/register"}>Register here</Link>
        </p>
        {slug && (
          <p className="form-link" style={{ marginTop: "0.5rem" }}>
            <Link href="/auth/login" style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Use global login instead →</Link>
          </p>
        )}
      </div>
    </div>
  )
}
