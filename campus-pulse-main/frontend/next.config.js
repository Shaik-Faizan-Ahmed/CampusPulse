/** @type {import('next').NextConfig} */
const nextConfig = {
 async rewrites(){
  return [
   {
    source: "/:path*",
    has: [
     {
      type: "header",
      key: "accept",
      value: "application/json"
     }
    ],
    destination: "http://localhost:5000/:path*"
   }
  ]
 },

 images:{
  remotePatterns:[
   {protocol:"https",hostname:"**"},
   {protocol:"http",hostname:"**"}
  ]
 }
}

module.exports = nextConfig