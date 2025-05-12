import Link from "next/link";

export default function Navbar() {
    return (
        <section className="flex justify-between items-cente bg-stone-400 text-white p-4">
            <ul className="flex gap-4">
                <Link href="/" className="hover:text-amber-300">Home</Link>
                <Link href="/about" className="hover:text-amber-300">About</Link>
                <Link href="/bookmark" className="hover:text-amber-300">Bookmark</Link>
            </ul>
        </section>
    )
}