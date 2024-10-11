import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import Link from "next/link"

export default function NavBar() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
            <NavigationMenuItem>
                <Link href="/">
                    <NavigationMenuTrigger className="text-4xl">Home</NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/studentLoginPage">
                    <NavigationMenuTrigger className="text-4xl">Student Login</NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <Link href="/teacherLoginPage">
                    <NavigationMenuTrigger className="text-4xl">Teacher Login</NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
                </NavigationMenuContent>
            </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}