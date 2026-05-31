"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SlugLogin({ params }: { params: { slug: string } }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/auth/login?slug=${params.slug}`)
  }, [])
  return null
}
