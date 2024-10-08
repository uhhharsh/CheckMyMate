import React from "react";
import NavBar from "@/components/ui/navBar";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function StudentDashboard() {
    return (
        <>
        {/* navBar container */}
        <div className="flex flex-col items-center justify-center gap-4 p-4"> 
            <div className="rounded sticky top-0"> 
                <NavBar />
            </div>
        </div>

        {/* dashboard container */}
        <div className="flex min-h-screen w-full">
        {/* <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <TooltipProvider>
                <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                prefetch={false}
                >
                <div className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme School</span>
                </Link>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                    >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Courses</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Courses</TooltipContent>
                </Tooltip>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                    >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Grades</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Grades</TooltipContent>
                </Tooltip>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                    >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Schedule</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Schedule</TooltipContent>
                </Tooltip>
                <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    prefetch={false}
                    >
                    <div className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </nav>
        </aside> */}
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex items-center gap-4">
                <img
                src="/assets/mahdis-mousavi-hJ5uMIRNg5k-unsplash.jpg"
                width={36}
                height={36}
                alt="Avatar"
                className="rounded-full"
                style={{ aspectRatio: "36/36", objectFit: "cover" }}
                />
                <div className="grid gap-0.5">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">Student</div>
                </div>
            </div>
            <div className="ml-auto flex items-center gap-4">
                {/* this button use ?? */}
                {/* <Button variant="outline" size="icon" className="rounded-full">
                <div className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
                </Button> */}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                    <img
                        src="/assets/mahdis-mousavi-hJ5uMIRNg5k-unsplash.jpg"
                        width={36}
                        height={36}
                        alt="Avatar"
                        className="rounded-full"
                        style={{ aspectRatio: "36/36", objectFit: "cover" }}
                    />
                    <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="sm:col-span-2">
                <CardHeader>
                    <CardTitle>Exams</CardTitle>
                    <CardDescription>Your current exams for the semester.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Introduction to Computer Science</div>
                        <div className="text-sm text-muted-foreground">Professor: Jane Smith</div>
                        </div>
                        <Button size="sm" variant="outline">
                        View
                        </Button>
                    </div>
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Calculus I</div>
                        <div className="text-sm text-muted-foreground">Professor: John Doe</div>
                        </div>
                        <Button size="sm" variant="outline">
                        View
                        </Button>
                    </div>
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Introduction to Psychology</div>
                        <div className="text-sm text-muted-foreground">Professor: Sarah Lee</div>
                        </div>
                        <Button size="sm" variant="outline">
                        View
                        </Button>
                    </div>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>Your results for the semester exams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Data Structures and Algorithms</div>
                        <div className="text-sm text-muted-foreground">Professor : abc</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Computer Networks</div>
                        <div className="text-sm text-muted-foreground">Professor : def</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-lg bg-background p-4">
                        <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <div className="h-5 w-5" />
                        </div>
                        <div>
                        <div className="font-medium">Databases</div>
                        <div className="text-sm text-muted-foreground">Professor : ghi</div>
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>
            </div>
            </main>
        </div>
        </div>
        </>
    );
}