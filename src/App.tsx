import {useState, useEffect, useMemo} from 'react';
import {PlusIcon } from "./components/atoms.tsx";
import AddBookForm from "./components/forms/AddBookForm";
import {Book} from "./types/Book.tsx";
import Search from "./components/search";
import {BookFilters} from "./components/search/Search.tsx";
import BookCard from "./components/cards/book-card";



export default function App() {
    const [books, setBooks] = useState<Array<Book>>([]);
    const [filters, setFilters] = useState<BookFilters>({
        collections: [],
        genres: [],
        languages: [],
        query: '', formats: []})
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

    const onSubmit = () => {
        // TODO: call the book service
    }

    const onCancel = () => {
        setIsOpen(false);
    }

    const availableCollections = useMemo(() => {
        return [...new Set(books.map(book =>
            book.collection?.name
                ? book.collection?.name
                : "Unknown"
        ))];
    }, [books, filters])

    const availableGenres = useMemo(() => {
        return [...new Set(
            books.map(book =>
                book.genres.map(genre => genre)
                )
                .flatMap(genre => genre)
                .filter(genre => genre)
        )];
    }, [books, filters])

    const filteredBooks = useMemo(() => {
        const normalizedQuery = filters?.query?.toLowerCase();
        return books.filter(book => {
            const matchesQuery =
                !filters?.query ||
                book.title?.toLowerCase().includes(normalizedQuery) ||
                book.author?.toLowerCase().includes(normalizedQuery);

            const matchesFormat =
                !filters.formats?.length || book.formats.find(format => filters.formats.includes(format));

            const matchesGenre = !filters.genres?.length || book.genres.find(genre => filters.genres.includes(genre));

            const matchesCollection = !filters.collections?.length || filters.collections.includes(book.collection?.name ?? '')

            return matchesQuery && matchesFormat && matchesGenre && matchesCollection;
        });
    }, [books, filters])

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <span>📚</span> My Personal Library
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Manage, search, and the catalog with physical and digital books</p>
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
                <Search
                    filters={filters}
                    onFilterChange={setFilters}
                    availableGenres={availableGenres}
                    availableCollections={availableCollections}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <BookCard key={book.id} {...book} />
                    ))}
                </div>

                {isOpen && <AddBookForm onSubmit={onSubmit} onCancel={onCancel}/>}

            </div>
        </div>
    );
}