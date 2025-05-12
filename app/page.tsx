import Baner from "@/components/Homepage/baner";
import CardProduct from "@/components/Homepage/card-product";
import Navbar from "@/components/Homepage/navbar";
import Sidebar from "@/components/Homepage/sidebar";
import { Ban } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Baner />
      <div className="flex gap-4">
        <Sidebar />
        <div>
          <CardProduct />
        </div>
      </div>
    </main>
  )
}