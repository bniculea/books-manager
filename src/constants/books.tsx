export const COLLECTIONS = [
    'Mari Clasici ai Literaturii',
    'Biblioteca pentru copii'
] as const;

// Extract the type: 'Mari Clasici ai Literaturii' | 'Biblioteca pentru Toți' | ...
export type CollectionName = typeof COLLECTIONS[number];

export const SERIES = [
    'Dune',
    'The Lord of the Rings'
] as const;

export type SeriesName = typeof SERIES[number];

export const BOOK_STATUSES = [
    'Unread',
    'Reading',
    'Read',
    'Wishlist'
]

export type BookStatus = typeof BOOK_STATUSES[number];

export const BOOK_FORMAT = [
    'epub',
    'print'
]

export type BookFormat = typeof BOOK_FORMAT[number];