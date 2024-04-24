"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, Lock, PlayCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface CourseSidebarItemProps{
    id:string,
    label:string
    isCompleted:boolean
    isLocked:boolean
    courseId:string
}

const CourseSidebarItem = ({
    id,
    label,
    isCompleted,
    isLocked,
    courseId
}:CourseSidebarItemProps) => {
    const pathname = usePathname()
    const router = useRouter()

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle)

    const isActive = pathname.includes(id)
    const onClick = ()=>{
        router.push(`/courses/${courseId}/chapters/${id}`)
    }
  return (
    <button className={cn(
        "flex items-center text-slate-500 gap-x-2 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 ",
        isActive && "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isActive && isCompleted && "bg-emerald-200/20"
    )}
        onClick={onClick}
        type="button"
    >
        <div className="flex items-center gap-x-2 py-4">
            <Icon size={22} className={cn(
                "text-slate-500",
                isActive && "text-slate-700",
                isCompleted && "text-emerald-700"
            )}/>
            {label}
        </div>
        <div className={cn(
            "ml-auto opacity-0 border-2 bg-slate-700 h-full transition-all",
            isActive && "opacity-100 border-sky-700 ",
            isCompleted && "border-emerald-700"
        )}/>
    </button>
  )
}

export default CourseSidebarItem