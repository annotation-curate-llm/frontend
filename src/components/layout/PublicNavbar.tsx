"use client";

import Link from "next/link";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    MobileNavToggle,
    NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

export default function PublicNavbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: "Features", link: "#features" },
        { name: "Dashboard", link: "/dashboard" },
    ];

    return (
        <Navbar className="top-0">
            {/* Desktop Navbar */}
            <NavBody>
                <Link
                    href="/"
                    className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
                >
                    <span className="text-2xl">💀</span>
                    <span className="font-bold text-black dark:text-white">
                        Curate-LLM
                    </span>
                </Link>

                <NavItems items={navItems} />

                <div className="flex items-center gap-2">
                    <NavbarButton className="bg-gradient-orange text-white" href="/login">
                        Get Started
                    </NavbarButton>
                </div>
            </NavBody>

            {/* Mobile Navbar */}
            <MobileNav>
                <MobileNavHeader>
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-sm font-normal text-black"
                    >
                        <span className="text-2xl">💀</span>
                        <span className="font-bold text-black dark:text-white">
                            Curate-LLM
                        </span>
                    </Link>

                    <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
                </MobileNavHeader>

                <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    {navItems.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.link}
                            className="text-neutral-600 dark:text-neutral-300"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-2 pt-4 w-full">
                        <NavbarButton className="bg-gradient-orange text-white" href="/login">
                            Get Started
                        </NavbarButton>
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}