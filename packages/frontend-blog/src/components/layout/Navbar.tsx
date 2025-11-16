import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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
import { cn } from "@/lib/utils";
import CommandPalette from "@/components/custom/CommandPalette";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const links = [
    { name: "Home", to: "/" },
    { name: "Blog", to: "/blog" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav className="flex items-end justify-between px-3 py-4">
      {/* Desktop nav */}
      <div className="hidden items-center space-x-6 md:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-0">
            {links.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.to}
                    className={cn(
                      "text-muted-foreground hover:text-foreground px-3 py-1 text-sm font-medium transition-colors",
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
              <NavigationMenuTrigger
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
                className="text-muted-foreground hover:text-foreground right-0 px-3 py-1 text-sm font-medium"
              >
                Account
              </NavigationMenuTrigger>
              <NavigationMenuContent
                id="dropdown"
                className="bg-background border-border/30 absolute right-0 z-50 min-w-40 rounded-md border p-2 shadow-sm"
              >
                <div className="flex flex-col">
                  {isAuthenticated ? (
                    <>
                      {user && user.role === "ADMIN" && (
                        <NavigationMenuLink asChild>
                          <Link
                            to="/admin/me"
                            className={cn(
                              "hover:bg-muted block rounded-md px-3 py-2 text-sm transition-colors",
                              location.pathname === "/api/admin/me" &&
                                "bg-muted",
                            )}
                          >
                            Admin Panel
                          </Link>
                        </NavigationMenuLink>
                      )}
                      {user && user.role === "USER" && (
                        <NavigationMenuLink asChild>
                          <Link
                            to="/user/me"
                            className={cn(
                              "hover:bg-muted block rounded-md px-3 py-2 text-sm transition-colors",
                              location.pathname === "/api/users/me" &&
                                "bg-muted",
                            )}
                          >
                            Profile
                          </Link>
                        </NavigationMenuLink>
                      )}

                      <button
                        onClick={handleLogout}
                        className="hover:bg-muted block rounded-md px-3 py-2 text-left text-sm transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/auth/login"
                          className={cn(
                            "hover:bg-muted block rounded-md px-3 py-2 text-sm transition-colors",
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
                            "hover:bg-muted mt-1 block rounded-md px-3 py-2 text-sm transition-colors",
                            location.pathname === "/auth/signup" && "bg-muted",
                          )}
                        >
                          Signup
                        </Link>
                      </NavigationMenuLink>
                    </>
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <CommandPalette />
        <ModeToggle />
      </div>

      {/* Mobile nav */}
      <div className="flex items-center gap-2 md:hidden">
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
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground text-lg font-medium transition-colors",
                    location.pathname === link.to && "text-foreground",
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-border/20 mt-4 border-t pt-4">
                <p className="text-muted-foreground mb-2 text-sm">Account</p>
                <Link
                  to="/auth/login"
                  onClick={() => setOpen(false)} // 👈 also close
                  className={cn(
                    "hover:bg-muted block rounded-md px-3 py-2 text-base font-medium transition-colors",
                    location.pathname === "/auth/login" && "bg-muted",
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setOpen(false)} // 👈 also close
                  className={cn(
                    "hover:bg-muted mt-2 block rounded-md px-3 py-2 text-base font-medium transition-colors",
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
