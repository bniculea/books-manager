import {BookFormat, Language} from "../../constants/books.tsx";
import { MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";
import styles from "./Search.module.css";

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
    const {filters, onFilterChange} = props;

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.iconWrapper}>
                    <MagnifyingGlassIcon className={styles.icon} aria-hidden={true} />
                </div>
                <input
                    className={styles.searchInput}
                    type="text"
                    value={filters.query}
                    placeholder={'Search for books titles, authors, etc.'}
                    onChange={e => onFilterChange({...filters, query: e.target.value})}
                />
                {filters.query && (
                    <button
                        type="button"
                        onClick={() => onFilterChange({...props.filters, query: ''})}
                        className={styles.clearSearch}
                        aria-label={'Clear search'}
                    >
                            <XMarkIcon className={styles.clearSearchIcon} />
                    </button>
                )}
            </div>
        </div>
    )
};

export default Search;