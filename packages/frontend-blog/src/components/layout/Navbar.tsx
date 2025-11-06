import ModeToggle from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import CommandPalette from "../custom/CommandPalette";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Public page links (Account actions are handled in a dropdown)
  const links = [
    { name: "Home", to: "/" },
    { name: "Blog", to: "/blog" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav className="flex items-end justify-between px-3 py-4">
      {/* Desktop nav */}
      <div className="hidden md:flex items-center space-x-6">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-0">
            {links.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground px-3 py-1",
                      location.pathname === link.to && "text-foreground",
                    )}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* Account dropdown — anchored to this item */}
            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger className="text-sm right-0 font-medium text-muted-foreground hover:text-foreground px-3 py-1">
                Account
              </NavigationMenuTrigger>

              <NavigationMenuContent
                id="dropdown"
                className="absolute right-0 min-w-40 p-2 bg-background border border-border/30 rounded-md shadow-sm z-50"
              >
                <div className="flex flex-col">
                  <NavigationMenuLink asChild>
                    <Link
                      to="/auth/login"
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors",
                        location.pathname === "/auth/login" && "bg-muted",
                      )}
                    >
                      Login
                    </Link>
                  </NavigationMenuLink>

                  <NavigationMenuLink asChild>
                    <Link
                      to="/auth/signup"
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm mt-1 hover:bg-muted transition-colors",
                        location.pathname === "/auth/signup" && "bg-muted",
                      )}
                    >
                      Signup
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <CommandPalette />
        <ModeToggle />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-2">
        <CommandPalette />
        <ModeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
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
                  onClick={() => setOpen(false)} // 👈 closes menu on click
                  className={cn(
                    "text-lg font-medium text-muted-foreground hover:text-foreground transition-colors",
                    location.pathname === link.to && "text-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-border/20 mt-4 pt-4">
                <p className="text-sm text-muted-foreground mb-2">Account</p>
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)} // 👈 also close
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium hover:bg-muted transition-colors",
                    location.pathname === "/auth/login" && "bg-muted",
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setOpen(false)} // 👈 also close
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium mt-2 hover:bg-muted transition-colors",
                    location.pathname === "/auth/signup" && "bg-muted",
                  )}
                >
                  Signup
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
