import "./globals.css"
import Link from "next/link"

export default function RootLayout({children}:any){

return(

<html>
<body className="bg-slate-50">

<nav className="bg-white shadow p-4">

<div className="max-w-6xl mx-auto flex justify-between">

<Link href="/" className="font-bold text-xl">
</Link>

<Link href="/admin">
ADMIN
</Link>

</div>

</nav>

{children}

</body>
</html>

)

}