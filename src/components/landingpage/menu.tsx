"use client"

import Link from "next/link"
import Image from "next/image"

export function MenuNavbar() {
  return (
    <nav className="flex items-center justify-between mb-16">
    <div className="flex items-center gap-8">
      <div className=" rounded-full p-2">
        <Link href="/">
        <Image 
        src="/images/auxsol-name.png" 
        alt="Logo"
        width={80}
        height={80}/>
         </Link>
      </div>
      <div className="hidden md:flex sm:flex items-center gap-6">
        <Link href={"/sobre"} className="text-black hover:underline">
          Sobre
        </Link>
        <Link href={"/planos"} className="text-black hover:underline">
          Planos
        </Link>
      </div>
    </div>
    <Link href={"/sign-in"} className="bg-black text-white px-4 py-2 rounded-full">
    Login
    </Link>
  </nav>
   )
} 