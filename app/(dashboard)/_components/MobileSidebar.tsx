import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden pr-4 hover:opacity-75 transition-all">
        <Button variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 h-full">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
