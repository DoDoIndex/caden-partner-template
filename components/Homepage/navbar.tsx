import Link from "next/link";

export default function Navbar() {
    return (
        <section className="flex justify-between items-cente bg-gray-900 text-white p-4">
            <ul className="flex gap-4">
                <Link href="/" className="hover:text-sky-500 text-md font-semibold">Home</Link>
                <Link href="/bookmark" className="hover:text-sky-500 text-md font-semibold">Bookmark</Link>
                <Link href="/about" className="hover:text-sky-500 text-md font-semibold">About</Link>
            </ul>
        </section>
    )
}