import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ThemeLoader from "@/components/ThemeLoader"
export const metadata={
 title:'Campus Pulse',
 description:'Campus event platform'
}

export default function RootLayout({
 children,
}:{children:React.ReactNode}){
 return(
  <html lang="en" suppressHydrationWarning>
   <body>
    <ThemeLoader/>
<Navbar/>
{children}
<Footer/>
   </body>
  </html>
 )
}