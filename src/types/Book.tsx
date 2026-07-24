import {BookFormat, BookStatus} from "../constants/books.tsx";

export interface StorySeries {
    name: string;
    bookNumber: number;
    totalInSeries?: number;
}

export interface PublisherCollection {
    name: string;
    volumeNumber?: number;
}

export interface Book {
    id: string;
    title: string;
    cover: string;
    author: string;
    genres: Array<string>;
    status: BookStatus;
    isbn: string;
    publisher: string;
    series?: StorySeries | null;
    collection?: PublisherCollection | null;
    formats: Array<BookFormat>;
}