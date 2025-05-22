"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useAnimation } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Baner() {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Fetch images from the API
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch("/api/catalog/images");
                const result = await response.json();
                if (result.success) {
                    setImages(result.data);
                } else {
                    console.error("Error fetching images:", result.error);
                }
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        const autoScroll = setInterval(() => {
            const currentX = x.get();
            const maxScroll = -(images.length / 2) * 500; // Increased width for larger images

            if (currentX <= maxScroll) {
                x.set(0); // Reset position when reaching the end
            } else {
                controls.start({
                    x: currentX - 10, // Move left by 10px
                    transition: { ease: "linear", duration: 0.1 },
                });
            }
        }, 50);

        return () => clearInterval(autoScroll);
    }, [x, controls, images]);

    if (loading) {
        return <div className="h-[500px] flex items-center justify-center">Loading images...</div>;
    }

    return (
        <div className="relative bg-stone-700 text-white pt-10 pb-20 px-6">
            <div className="relative w-full max-w-[2000px] mx-auto">
                <div
                    className="mb-8 w-full overflow-hidden"
                    ref={containerRef}
                >
                    <motion.div
                        className="flex space-x-4 py-4"
                        style={{ x }}
                        animate={controls}
                        drag="x"
                        dragConstraints={containerRef}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {images?.map((imageUrl, index) => (
                            <motion.div
                                key={`${imageUrl}-${index}`}
                                className="w-[500px] flex-shrink-0"
                            >
                                <div className="overflow-hidden rounded-lg">
                                    <Image
                                        src={imageUrl}
                                        alt={`Catalog image ${index + 1}`}
                                        width={500}
                                        height={400}
                                        className="h-[400px] w-full object-cover"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="text-center mt-8">
                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-4">
                        Explore Our Feature Tile
                    </h2>
                    <p className="text-sm md:text-base text-gray-200 mb-6">
                        Discover a curated selection of our top features designed to enhance your experience.
                        From intuitive tools to powerful integrations, explore what makes us unique.
                    </p>
                    <Button
                        variant="outline"
                        className="text-black border-2 hover:bg-amber-500 hover:border-black hover:text-white"
                        onClick={() => window.open('https://www.instagram.com/cadentile/', '_blank')}>
                        See our Instagram <ArrowUpRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
