import { ModeToggle } from "../mode-toggle.tsx";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Home", to: "/" },
    { name: "Blog", to: "/blog" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      {/* Left side: site title */}
      <h1 className="text-xl font-bold tracking-tight">Daktilo Blog</h1>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-6">
            {links.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                      location.pathname === link.to && "text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-2">
        <ModeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="mt-8 flex flex-col space-y-4 pl-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "text-lg font-medium text-muted-foreground hover:text-foreground transition-colors",
                    location.pathname === link.to && "text-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
