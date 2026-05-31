"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SlugRegister({ params }: { params: { slug: string } }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/auth/register?slug=${params.slug}`)
  }, [])
  return null
}
