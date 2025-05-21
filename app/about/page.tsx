export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-stone-50 text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-100 opacity-50"></div>
        <div className="max-w-6xl mx-auto px-6 py-32 relative">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-stone-900 to-stone-600">
              About Caden Tile Partner Catalog
            </h1>
            <p className="text-xl md:text-2xl text-center text-stone-600 max-w-3xl mx-auto leading-relaxed">
              The Caden Tile Partner Catalog is a white-label product catalog designed for interior designers, home builders, and contractors.
              It empowers them to showcase and sell Caden Tile's premium products under their own brand — without managing inventory or logistics.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-stone-900">How It Works</h2>
            </div>
            <ul className="space-y-6">
              {[
                "Create a branded catalog with your logo and name.",
                "Let your clients browse and bookmark their favorite tiles.",
                "Clients share their selection with you.",
                "You order directly from Caden Tile at base cost.",
                "Caden Tile handles all inventory and shipping."
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-4 text-stone-700 group">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="mb-8">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold mb-6 text-stone-900">Why Partners Love It</h2>
            </div>
            <ul className="space-y-6">
              {[
                "Set your own prices — 30%, 200%, or any margin you want.",
                "No need to stock or ship anything.",
                "Clients enjoy a seamless and professional browsing experience.",
                "Grow your brand and your business with premium tile options."
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-4 text-stone-700 group">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </span>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-stone-200">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-semibold mb-8 text-stone-900">Who It's For</h2>
          <p className="text-xl text-stone-600 mb-16 max-w-3xl mx-auto">
            Whether you're a solo interior designer, a growing construction firm, or an established contractor — the Caden Tile Partner Catalog helps you scale with confidence.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Interior Designers",
                description: "Create beautiful spaces with premium tile options",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: "Home Builders",
                description: "Offer quality tile solutions to your clients",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                )
              },
              {
                title: "Contractors",
                description: "Streamline your tile installation projects",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                )
              }
            ].map((role, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6">
                  {role.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-stone-900">{role.title}</h3>
                <p className="text-stone-600">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-stone-800 to-stone-900 text-white py-32 px-6">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-semibold mb-8">Join the Network</h2>
          <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
            Start offering beautiful tile and vinyl flooring without ever holding inventory. Branded catalogs, easy ordering, and full support from Caden Tile.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="/partner"
              className="inline-flex items-center px-8 py-4 rounded-full font-medium bg-amber-500 text-white hover:bg-amber-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Become a Partner
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 rounded-full font-medium bg-transparent border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
