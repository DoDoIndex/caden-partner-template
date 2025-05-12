export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 text-gray-800">
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="space-y-6">
          <h1 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            About Caden Tile Partner Catalog
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The Caden Tile Partner Catalog is a white-label product catalog designed for interior designers, home builders, and contractors.
            It empowers them to showcase and sell Caden Tile's premium products under their own brand — without managing inventory or logistics.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">How It Works</h2>
            <ul className="space-y-4">
              {[
                "Create a branded catalog with your logo and name.",
                "Let your clients browse and bookmark their favorite tiles.",
                "Clients share their selection with you.",
                "You order directly from Caden Tile at base cost.",
                "Caden Tile handles all inventory and shipping."
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">Why Partners Love It</h2>
            <ul className="space-y-4">
              {[
                "Set your own prices — 30%, 200%, or any margin you want.",
                "No need to stock or ship anything.",
                "Clients enjoy a seamless and professional browsing experience.",
                "Grow your brand and your business with premium tile options."
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3 text-gray-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8 text-gray-900">Who It's For</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Whether you're a solo interior designer, a growing construction firm, or an established contractor — the Caden Tile Partner Catalog helps you scale with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Interior Designers", "Home Builders", "Contractors"].map((role, index) => (
              <span
                key={index}
                className="bg-white px-6 py-3 rounded-full text-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-6">Join the Network</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Start offering beautiful tile and vinyl flooring without ever holding inventory. Branded catalogs, easy ordering, and full support from Caden Tile.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Become a Partner
          </a>
        </div>
      </section>
    </div>
  );
}
