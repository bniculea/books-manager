import {BOOK_FORMAT, BookFormat, Language} from "../../constants/books.tsx";
import {useState} from "react";
import {FunnelIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";

export interface BookFilters {
    query: string;
    formats: Array<BookFormat>;
    languages: Array<Language>;
    genres: Array<string>;
    collections: Array<string>;
}

interface SearchProps {
    filters: BookFilters;
    onFilterChange: (updatedFilters: BookFilters) => void;
    availableGenres: Array<string>;
    availableCollections: Array<string>;
}
const Search = (props: SearchProps) => {
    const {filters, onFilterChange, availableCollections, availableGenres} = props;
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
    const activeFilterCount = filters.formats.length + filters.languages.length + filters.genres.length + filters.collections.length;

    const updateQuery = (query: string) => {
        onFilterChange({...filters, query})
    }

    const toggleFormat = (format: BookFormat) => {
        const nextFormats = filters.formats.includes(format)
            ? filters.formats.filter(f => f !== format)
            : [...filters.formats, format];
        onFilterChange({...filters, formats: nextFormats})
    }

    const resetFilters = () => {
        onFilterChange({
            ...filters,
            formats: [],
            languages: [],
            genres: [],
            collections: []
        })
    }

    const handleChange = (field: keyof BookFilters, value: string) => {
        props.onFilterChange({
            ...props.filters,
            [field]: value
        })
    }

    return (
        <div className="mb-6 space-y-3">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Search by title, author..."
                        value={filters.query}
                        onChange={(e)=> updateQuery(e.target.value)}
                        className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sma text-gray-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                        />
                </div>
                <button
                    onClick={()=> setIsMobileDrawerOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
                >
                    <FunnelIcon className="h4 w-4 text-gray-500" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="rounded-full bg-amber-600 px-2 py-0.5 text-xs font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
            <div className="hidden flex-wrap items-center gap-3 md:flex">
                <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-0.5">
                    {/*    TODO use the book formats*/}
                    {(['epub', 'print'] as BookFormat[]).map(format => {
                        const isActive = filters.formats.includes(format);
                        return (
                            <button
                                key={format}
                                type="button"
                                onClick={() => toggleFormat(format)}
                                className={`rounded-md px-3 py-1 text-xs font-semibold uppercase transition ${
                                    isActive
                                        ? "bg-amber-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                {format}
                            </button>
                        );
                    })}
                </div>
                {/* Language Select */}
                <select
                    value={filters.languages[0] || ""}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            languages: e.target.value ? [(e.target.value as Language)] : [],
                        })
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm focus:outline-none"
                >
                    <option value="">All Languages</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="ro">🇷🇴 Română</option>
                    <option value="fr">🇫🇷 Français</option>
                </select>
                {/* Genre Select */}
                <select
                    value={filters.genres[0] || ""}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            genres: e.target.value ? [e.target.value] : [],
                        })
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm focus:outline-none"
                >
                    <option value="">All Genres</option>
                    {availableGenres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                {/* Collection Select */}
                <select
                    value={filters.collections[0] || ""}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            collections: e.target.value ? [e.target.value] : [],
                        })
                    }
                    className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm focus:border-amber-500 focus:outline-none"
                >
                    <option value="">All Collections</option>
                    {availableCollections.map((col) => (
                        <option key={col} value={col}>
                            {col}
                        </option>
                    ))}
                </select>

                {/* Clear Filters Button */}
                {activeFilterCount > 0 && (
                    <button
                        onClick={resetFilters}
                        className="text-xs font-medium text-amber-700 hover:underline"
                    >
                        Clear filters ({activeFilterCount})
                    </button>
                )}
            </div>
            {/* 3. Mobile Filter Drawer / Sheet */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm md:hidden">
                    <div className="flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6 overflow-y-auto py-4">
                            {/* Formats */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Format
                                </label>
                                <div className="mt-2 flex gap-2">
                                    {(['epub', 'print'] as BookFormat[]).map((fmt) => (
                                        <button
                                            key={fmt}
                                            type="button"
                                            onClick={() => toggleFormat(fmt)}
                                            className={`flex-1 rounded-md border py-2 text-xs font-semibold uppercase ${
                                                filters.formats.includes(fmt)
                                                    ? "border-amber-600 bg-amber-600 text-white"
                                                    : "border-gray-300 text-gray-700"
                                            }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Language
                                </label>
                                <select
                                    value={filters.languages[0] || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            languages: e.target.value ? [(e.target.value as Language)] : [],
                                        })
                                    }
                                    className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800"
                                >
                                    <option value="">All Languages</option>
                                    <option value="en">🇬🇧 English</option>
                                    <option value="ro">🇷🇴 Română</option>
                                    <option value="fr">🇫🇷 Français</option>
                                </select>
                            </div>

                            {/* Genres */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Genre
                                </label>
                                <select
                                    value={filters.genres[0] || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            genres: e.target.value ? [e.target.value] : [],
                                        })
                                    }
                                    className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800"
                                >
                                    <option value="">All Genres</option>
                                    {availableGenres.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Collections */}
                            <div>
                                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Collection
                                </label>
                                <select
                                    value={filters.collections[0] || ""}
                                    onChange={(e) =>
                                        onFilterChange({
                                            ...filters,
                                            collections: e.target.value ? [e.target.value] : [],
                                        })
                                    }
                                    className="mt-2 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-800"
                                >
                                    <option value="">All Collections</option>
                                    {availableCollections.map((col) => (
                                        <option key={col} value={col}>
                                            {col}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="w-full text-center text-xs font-medium text-gray-500 hover:underline"
                                >
                                    Reset all filters
                                </button>
                            )}
                            <button
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="w-full rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow hover:bg-amber-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;