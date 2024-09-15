import Image from "next/image";
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

export default function Home() {
  return (
    <>
      <div className="flex justify-center">
        <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-4xl">Home</NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-4xl">Model</NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-4xl">About Us</NavigationMenuTrigger>
            <NavigationMenuContent>
              {/* <NavigationMenuLink>Link</NavigationMenuLink> */}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>
      </div>

    </>
  );
}
