"use client"

import {useEffect} from "react"

export default function ThemeLoader(){
 useEffect(()=>{
  const saved=localStorage.getItem("cp-theme")||"dark"
  document.documentElement.setAttribute("data-theme",saved)
 },[])

 return null
}