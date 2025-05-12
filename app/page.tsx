import Baner from "@/components/Homepage/baner";
import Sidebar from "@/components/Homepage/sidebar";
import CardProduct from "@/components/Homepage/card-product";
export default function HomePage() {
  return (
    <main>
      <Baner />
      <div className="flex gap-4">
        <Sidebar />
        <div className="grid grid-cols-4 gap-5">
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
        </div>
      </div>
    </main>
  )
}