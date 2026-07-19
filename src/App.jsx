import { useState, useEffect } from 'react';

// Configure your repository coordinates here
const REPO_OWNER = "bniculea";
const REPO_NAME = "books-manager";
const FILE_PATH = "public/books.json";

// Simple, error-proof SVG Icon Components (Replaces Lucide)
const SearchIcon = () => (
    <svg className="absolute left-3 top-3 text-gray-400 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const PlusIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
);
const UserIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const TagIcon = () => (
    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20n4 4V10H4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5h.01M5.666 16.334a8 8 0 1111.334-11.334L5.666 16.334z" /></svg>
);

export default function App() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    // Form & Auth State
    const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
    const [isOpen, setIsOpen] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', author: '', genre: '', status: 'Want to Read' });

    // 1. Load books on mount
    useEffect(() => {
        fetch('./books.json')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error loading library:", err));
    }, []);

    const handleSaveToken = (val) => {
        setToken(val);
        localStorage.setItem('gh_token', val);
    };

    // 2. Filter Logic
    const filteredBooks = books.filter(book => {
        const titleMatch = book.title?.toLowerCase().includes(search.toLowerCase()) || false;
        const authorMatch = book.author?.toLowerCase().includes(search.toLowerCase()) || false;
        const matchesSearch = titleMatch || authorMatch;
        const matchesGenre = selectedGenre === '' || book.genre === selectedGenre;
        return matchesSearch && matchesGenre;
    });

    const genres = [...new Set(books.map(b => b.genre))].filter(Boolean);

    // 3. API Write Logic
    const handleAddBook = async (e) => {
        e.preventDefault();
        if (!token) return alert("Please provide a GitHub Personal Access Token first!");

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

        try {
            const res = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
            if (!res.ok) throw new Error("Could not fetch file metadata from GitHub.");
            const fileData = await res.json();

            const currentContent = JSON.parse(atob(fileData.content));
            const updatedBook = { ...newBook, id: Date.now().toString() };
            const updatedContent = [...currentContent, updatedBook];

            const putRes = await fetch(url, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `📚 Added book: ${newBook.title}`,
                    content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedContent, null, 2)))),
                    sha: fileData.sha
                })
            });

            if (putRes.ok) {
                setBooks(updatedContent);
                setIsOpen(false);
                setNewBook({ title: '', author: '', genre: '', status: 'Want to Read' });
                alert("Success! Book saved to GitHub. The live page will refresh completely in a minute.");
            } else {
                alert("Failed to commit changes. Check your token scopes.");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <span>📚</span> My Physical Library
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage, search, and catalog physical books</p>
                    </div>

                    <div className="flex gap-3 items-center w-full md:w-auto">
                        <input
                            type="password"
                            placeholder="Paste GitHub Token to Edit"
                            value={token}
                            onChange={(e) => handleSaveToken(e.target.value)}
                            className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
                        />
                        <button
                            onClick={() => setIsOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 shrink-0 shadow-sm"
                        >
                            <PlusIcon /> Add Book
                        </button>
                    </div>
                </header>

                {/* Filters Panel */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                        <option value="">All Genres</option>
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                            <div>
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                  <TagIcon /> {book.genre || 'Uncategorized'}
                </span>
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{book.title}</h3>
                                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                    <UserIcon /> {book.author}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                    book.status === 'Read' ? 'bg-green-50 text-green-700' :
                        book.status === 'Reading' ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {book.status}
                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for adding books */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border">
                            <h2 className="text-xl font-bold mb-4">Add Physical Book</h2>
                            <form onSubmit={handleAddBook} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Book Title</label>
                                    <input required type="text" className="w-full border p-2 rounded-lg text-sm" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Author</label>
                                    <input required type="text" className="w-full border p-2 rounded-lg text-sm" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Genre</label>
                                    <input required type="text" placeholder="Fantasy, Sci-Fi, History" className="w-full border p-2 rounded-lg text-sm" value={newBook.genre} onChange={e => setNewBook({...newBook, genre: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Reading Status</label>
                                    <select className="w-full border p-2 rounded-lg text-sm bg-white" value={newBook.status} onChange={e => setNewBook({...newBook, status: e.target.value})}>
                                        <option value="Want to Read">Want to Read</option>
                                        <option value="Reading">Reading</option>
                                        <option value="Read">Read</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Save Book</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}