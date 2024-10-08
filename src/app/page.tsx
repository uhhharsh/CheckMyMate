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
import Link from "next/link"
import NavBar from "@/components/ui/navBar";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        
        <div className="rounded sticky top-0"> {/* top container */}
          <NavBar />
        </div>
        
        <div className="flex items-center justify-center"> {/* bottom container */}
          <div className="p-4"> {/* left */}
            <Image
              src="/assets/mahdis-mousavi-hJ5uMIRNg5k-unsplash.jpg"
              alt="My Image"
              width={500} // Specify the width of the image
              height={300} // Specify the height of the image
            />
          </div>

          <div className="p-4"> {/* right */}
            <h1 className="text-3xl text-center">Hi, The model will help you evaluate <br />
            subject answers based on evaluation criterias </h1>
          </div>
        </div>
      </div>

    </>
  );
}
