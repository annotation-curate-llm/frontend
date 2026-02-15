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
        { name: "Features", link: "/features" },
        { name: "Pricing", link: "/pricing" },
        { name: "About", link: "/about" },
    ];

    return (
        <Navbar className="top-0">
            {/* Desktop Navbar */}
            <NavBody>
                {/* Logo */}
                <Link
                    href="/"
                    className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
                >
                    <span className="text-2xl">💀</span>
                    <span className="font-bold text-black dark:text-white">
                        Curate-LLM
                    </span>
                </Link>

                {/* Nav Items */}
                <NavItems items={navItems} />

                {/* Right Side Buttons */}
                <div className="flex items-center gap-2">
                    <NavbarButton variant="secondary" href="/login">
                        Login
                    </NavbarButton>
                    <NavbarButton className="bg-gradient-orange text-white" href="/signup">
                        Get Started
                    </NavbarButton>
                </div>
            </NavBody>

            {/* Mobile Navbar */}
            <MobileNav>
                <MobileNavHeader>
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-sm font-normal text-black"
                    >
                        <span className="text-2xl">🎨</span>
                        <span className="font-bold text-black dark:text-white">
                            Annotate AI
                        </span>
                    </Link>

                    {/* Mobile Toggle */}
                    <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
                </MobileNavHeader>

                {/* Mobile Menu */}
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
                        <NavbarButton variant="secondary" href="/login" className="w-full">
                            Login
                        </NavbarButton>
                        <NavbarButton variant="gradient" href="/signup" className="w-full ">
                            Get Started
                        </NavbarButton>
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </Navbar>
    );
}