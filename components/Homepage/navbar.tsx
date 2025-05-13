import Link from "next/link";

export default function Navbar() {
    return (
        <section className="flex justify-between items-cente bg-amber-100 text-black p-4">
            <ul className="flex gap-4">
                <Link href="/" className="hover:text-amber-500 text-md font-semibold">Home</Link>
                <Link href="/about" className="hover:text-amber-500 text-md font-semibold">About</Link>
                <Link href="/bookmark" className="hover:text-amber-500 text-md font-semibold">Bookmark</Link>
            </ul>
        </section>
    )
}