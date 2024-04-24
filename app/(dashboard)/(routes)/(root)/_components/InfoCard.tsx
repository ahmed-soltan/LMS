import { IconBadge } from "@/components/icon"
import { LucideIcon } from "lucide-react";


interface InfoCardProps{
    variant?: "default"|"success";
    label:string;
    icon:LucideIcon;
    count:number
}

const InfoCard = ({
    variant,
    label,
    icon:Icon,
    count,
}:InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge variant={variant} icon={Icon}/>
        <div>
            <p className="font-medium">
                {label}
            </p>
            <p className="text-gray-500 text-sm">
                {count} {count<=1 ? "Course" :"Courses"} 
            </p>
        </div>
    </div>
  )
}

export default InfoCard