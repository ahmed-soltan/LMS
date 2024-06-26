"use client"

import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"
import SearchInput from "./SearchInput"


const NavbarRoutes = () => {
  const pathname = usePathname()
  const router = useRouter()

  const isTeacher = pathname?.startsWith('/teacher')
  const isPlayer = pathname?.startsWith('/courses')
  const isSearch = pathname==='/search'

  return (
    <>
    <div>
      {isSearch && (
        <div className="hidden md:block">
          <SearchInput/>
        </div>
      )}
    </div>
    <div className="flex gap-x-2 ml-auto">
      {isTeacher || isPlayer ?(
        <Link href={'/'}>
        <Button size={"sm"} variant={"ghost"}>
          <LogOut className="h-4 w-4 mr-2"/>
          Exit
        </Button>
        </Link>
      ):(
        <Link href={'/teacher/courses'}>
          <Button size={"sm"} variant={"ghost"}>
            Teacher Mode
          </Button>
        </Link>
      )}
        <UserButton afterSignOutUrl="/"/>
    </div>
      </>
  )
}

export default NavbarRoutes