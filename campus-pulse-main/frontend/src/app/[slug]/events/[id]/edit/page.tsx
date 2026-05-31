"use client"

import {useParams} from "next/navigation"
import EventForm from "../../new/EventForm"

export default function EditEventPage(){
 const params=useParams()
 const id=params.id as string
 return <EventForm editId={id}/>
}