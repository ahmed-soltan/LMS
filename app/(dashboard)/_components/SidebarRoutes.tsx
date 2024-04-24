"use client"

import { BarChart, Compass, Layout, List } from "lucide-react"
import Link from "next/link"
import SidebarItem from "./SidebarItem"
import { usePathname } from "next/navigation"

const guestRoutes =[
    {
        icon:Layout,
        label:"Dashboard",
        path:"/"
    },
    {
        icon:Compass,
        label:"Browse",
        path:"/search"
    },

]
const teacherRoutes =[
    {
        icon:List,
        label:"Courses",
        path:"/teacher/courses"
    },
    {
        icon:BarChart,
        label:"Analytics",
        path:"/teacher/analytics"
    },

]

const SidebarRoutes = () => {
    const pathname = usePathname()
    
    const isTeacher = pathname?.includes('/teacher')
    const routes = isTeacher ?teacherRoutes : guestRoutes
  return (
    <div className="flex flex-col items-start w-full">
        {routes.map(route=>{
            return (
           <SidebarItem
            key={route.label}
            icon={route.icon}
            label={route.label}
            path={route.path}
           />
            )
        })}
    </div>
  )
}

export default SidebarRoutes