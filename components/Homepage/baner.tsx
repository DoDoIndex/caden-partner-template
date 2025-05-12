import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";

export default function Baner() {
    return (
        <div
            className="relative bg-cover bg-[position:center_botton_2rem] text-white py-20 px-6 bg-[url(http://cadentile.com/wp-content/uploads/2025/03/Hermes-Verde-3x9-02.jpg)]">
            <div className="bg-black/30 absolute inset-0" />
            <div className="relative max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4">
                    Explore Our Feature Tile
                </h2>
                <p className="text-sm md:text-base text-gray-200 mb-6">
                    Discover a curated selection of our top features designed to enhance your experience.
                    From intuitive tools to powerful integrations, explore what makes us unique.
                </p>
                <Button
                    variant="outline"
                    className="text-black border-2 hover:bg-yellow-600 hover:text-white">
                    See our Instagram <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
