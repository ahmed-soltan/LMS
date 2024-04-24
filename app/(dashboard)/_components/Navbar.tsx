import NavbarRoutes from "@/components/navbar-routes"
import MobileSidebar from "./MobileSidebar"

const Navbar = () => {
  return (
    <div className="p-6 flex items-center bg-white shadow-sm border-b h-full">
        <MobileSidebar/>
        <NavbarRoutes/>
    </div>
  )
}

export default Navbar