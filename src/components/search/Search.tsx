import {SearchIcon} from "../atoms.tsx";
import {BOOK_FORMAT} from "../../constants/books.tsx";

export interface BookFilters {
    query: string;
    format: string;
}

interface SearchProps {
    filters: BookFilters;
    onFilterChange: (updatedFilters: BookFilters) => void;
}
const Search = (props: SearchProps) => {

    const handleChange = (field: keyof BookFilters, value: string) => {
        props.onFilterChange({
            ...props.filters,
            [field]: value
        })
    }

    return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
            <SearchIcon />
            <input
                type="text"
                placeholder="Search by title or author..."
                value={props.filters?.query}
                onChange={e => handleChange('query', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
        </div>
        <select
            value={props.filters?.format}
            onChange={(e) => handleChange('format', e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
            <option value="">All Formats</option>
            {BOOK_FORMAT.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
        </select>
    </div>
    )
}

export default Search;