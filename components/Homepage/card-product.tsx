import { Bookmark } from "lucide-react";
import Image from "next/image";

export default function CardProduct() {
    return ( 
        <div className="flex flex-col gap-4 overflow-hidden shadow-lg bg-white h-[400px] p-4 group">
            <Image
                src="https://cadentile.com/wp-content/uploads/2025/01/Aphrodite-Dark-35x35-01-2.webp"
                alt="Product Image"
                width={250}
                height={250}
                className="transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tile's name</h3>
                    <Bookmark 
                    size={20}
                    />
                </div>
                <p className="text-sm font-semibold text-green-600">Price: </p>
            </div>
        </div>
    );
}
