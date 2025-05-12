export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          About Caden Tile Partner Catalog
        </h1>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto">
          The Caden Tile Partner Catalog is a white-label product catalog designed for interior designers, home builders, and contractors.
          It empowers them to showcase and sell Caden Tile’s premium products under their own brand — without managing inventory or logistics.
        </p>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Create a branded catalog with your logo and name.</li>
              <li>Let your clients browse and bookmark their favorite tiles.</li>
              <li>Clients share their selection with you.</li>
              <li>You order directly from Caden Tile at base cost.</li>
              <li>Caden Tile handles all inventory and shipping.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Partners Love It</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Set your own prices — 30%, 200%, or any margin you want.</li>
              <li>No need to stock or ship anything.</li>
              <li>Clients enjoy a seamless and professional browsing experience.</li>
              <li>Grow your brand and your business with premium tile options.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Who It's For</h2>
          <p className="text-gray-600 mb-8">
            Whether you're a solo interior designer, a growing construction firm, or an established contractor — the Caden Tile Partner Catalog helps you scale with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-700">
            <span className="bg-gray-100 px-4 py-2 rounded-full">Interior Designers</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full">Home Builders</span>
            <span className="bg-gray-100 px-4 py-2 rounded-full">Contractors</span>
          </div>
        </div>
      </section>

      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Join the Network</h2>
          <p className="text-gray-300 mb-6">
            Start offering beautiful tile and vinyl flooring without ever holding inventory. Branded catalogs, easy ordering, and full support from Caden Tile.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Become a Partner
          </a>
        </div>
      </section>
    </div>
  );
}
