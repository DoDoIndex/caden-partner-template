import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

const application = [
    "Outdoor Wall",
    "Outdoor Floor",
    "Indoor Wall",
    "Indoor Floor",
    "Shower Wall",
    "Shower Floor",
    "Heated Floor",
    "Commercial Floor",
    "Steam Room",
    "Swimming Pool"
]

export default function Sidebar() {
    return (
        <section className="space-y-4 border-1 rounded-xl shadow p-5">
            <h3 className="flex gap-2 font-bold text-xl"><SlidersHorizontal />Filter Products</h3>
            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <h4 className="font-semibold text-md bg-stone-200 rounded-2xl pl-2 p-1">Categories</h4>
                <ul className="pl-4">
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />All products</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Vinyl Planks</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Wall tiles</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Floor tiles</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Pool tiles</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Subway tiles</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Mosaic tiles</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Pavers</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Slabs</li>
                </ul>
            </div>

            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <h4 className="font-semibold text-md bg-stone-200 rounded-2xl pl-2 p-1">Material</h4>
                <ul className="pl-4">
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Ceramic</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Glass</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Granite</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Limestone</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Marble</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Natural Stone</li>
                    <li className="flex gap-2 items-center"><Checkbox className="border-sky-950" />Pocerlain</li>
                </ul>
            </div>

            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <h4 className="font-semibold text-md bg-stone-200 rounded-2xl pl-2 p-1">Application</h4>
                <div>
                    {application.map((app, index) => (
                        <div key={index} className="pl-4 flex gap-2 items-center">
                            <Checkbox className="border-sky-950" />
                            <span >{app}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div>
                <h4 className="font-semibold text-lg">Application</h4>
                <ul>
                    <li>Outdoor Wall</li>
                    <li>Outdoor Floor</li>
                    <li>Indoor Wall</li>
                    <li>Indoor Floor</li>
                    <li>Shower Wall</li>
                    <li>Shower Floor</li>
                    <li>Heated Floor</li>
                    <li>Commercial Floor</li>
                    <li>Steam Room</li>
                    <li>Swimming Pool</li>
                </ul>
            </div> */}

            <div className="flex flex-col gap-2 border-b-2 pb-4">
                <h4 className="font-semibold text-md bg-stone-200 rounded-2xl pl-2 p-1">Color</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex gap-2 items-center"><Checkbox className="bg-amber-100 rounded-full size-6" />Beige</div>
                    <div className="flex gap-2 items-center"><Checkbox className="bg-black rounded-full size-6" />Black</div>
                    <div className="flex gap-2 items-center"><Checkbox className="bg-blue-400 rounded-full size-6" />Blue</div>
                    <div className="flex gap-2 items-center"><Checkbox className="bg-amber-900 rounded-full size-6" />Brown</div>
                    <div className="flex gap-2 items-center"><Checkbox className="bg-lime-500 rounded-full size-6" />Green</div>
                    <div className="flex gap-2 items-center"><Checkbox className="bg-gray-400 rounded-full size-6" />Grey</div>
                </div>

            </div>

        </section>
    )
}