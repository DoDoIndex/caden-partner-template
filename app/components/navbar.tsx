"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, UserRound } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="flex gap-2.5 justify-center items-center w-full p-2.5 bg-amber-100">
            <div className="flex text-[32px] font-semibold w-2xs justify-center ">Caden Tile</div>
            <Input className="rounded-2xl border-gray-500" placeholder="Search Application, SKU, Product Name..." />
            <div className="flex">
                <UserRound />
                <ShoppingCart />
            </div>
        </nav>
    );
}



