'use client';

import Link from "next/link";
import { Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    return (
        <section className="bg-stone-900 text-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <h2 className="text-xl font-semibold">Caden Tile</h2>

                    {/* Desktop Menu */}
                    <ul className="hidden md:flex gap-4 items-center">
                        <Link href="/" className="hover:text-white text-stone-300 text-md font-semibold">Home</Link>
                        <Link href="/bookmark" className="hover:text-white text-md text-stone-300 font-semibold">Bookmark</Link>
                        <Link href="/designer" className="hover:text-white text-md text-stone-300 font-semibold">Design</Link>
                        <Link href="/about" className="hover:text-white text-md text-stone-300 font-semibold">About</Link>
                    </ul>

                    {/* Mobile Menu Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="md:hidden p-2 hover:bg-stone-800 rounded-lg transition-colors">
                            <Menu size={24} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-stone-900 border-stone-700">
                            <DropdownMenuItem asChild>
                                <Link href="/" className="text-stone-300 hover:text-white cursor-pointer">
                                    Home
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/bookmark" className="text-stone-300 hover:text-white cursor-pointer">
                                    Bookmark
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/designer" className="text-stone-300 hover:text-white cursor-pointer">
                                    Design
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/about" className="text-stone-300 hover:text-white cursor-pointer">
                                    About
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </section>
    );
}