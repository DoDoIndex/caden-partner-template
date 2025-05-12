export default function BookmarkPage() {
    const bookmarks = [
        {
            title: "OpenAI",
            url: "https://openai.com",
            description: "Artificial Intelligence research and deployment company",
            favicon: "https://www.google.com/s2/favicons?domain=openai.com",
            folder: "AI",
        },
        {
            title: "MDN Web Docs",
            url: "https://developer.mozilla.org",
            description: "Resources for developers, by developers",
            favicon: "https://www.google.com/s2/favicons?domain=developer.mozilla.org",
            folder: "Docs",
        },
    ];

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">📚 My Bookmarks</h1>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search bookmarks..."
                    className="w-full p-2 rounded border border-gray-300"
                />
            </div>

            <div className="grid gap-4">
                {bookmarks.map((bookmark, index) => (
                    <a
                        key={index}
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-white rounded-xl shadow hover:shadow-md p-4 transition"
                    >
                        <img
                            src={bookmark.favicon}
                            alt="favicon"
                            className="w-6 h-6 mr-4"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">{bookmark.title}</h2>
                            <p className="text-sm text-gray-500">{bookmark.description}</p>
                            <p className="text-xs text-gray-400 mt-1">📂 {bookmark.folder}</p>
                        </div>
                    </a>
                ))}
            </div>
        </main>
    );
}
  