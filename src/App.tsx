import { useState, useEffect } from 'react';
import {SearchIcon, PlusIcon, UserIcon, TagIcon} from "./components/atoms.tsx";
import AddBookForm from "./components/forms/AddBookForm";
import {Book} from "./types/Book.tsx";



export default function App() {
    const [books, setBooks] = useState<Array<Book>>([]);
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');

    // Form & Auth State
    const [token, setToken] = useState(localStorage.getItem('gh_token') || '');
    const [isOpen, setIsOpen] = useState(false);

    // 1. Load books on mount
    useEffect(() => {
        fetch('./books.json')
            .then(res => res.json())
            .then(data => setBooks(data))
            .catch(err => console.error("Error loading library:", err));
    }, []);

    const handleSaveToken = (val: string) => {
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
    const onSubmit = () => {
        // TODO: call the book service
    }

    const onCancel = () => {
        setIsOpen(false);
    }

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
                {isOpen && <AddBookForm onSubmit={onSubmit} onCancel={onCancel}/>}

            </div>
        </div>
    );
}