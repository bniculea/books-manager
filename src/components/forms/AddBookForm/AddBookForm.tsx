import {ChangeEvent, useState} from "react";
import {Book} from "../../../types/Book.tsx";
import {BookFormat, BookStatus} from "../../../constants/books.tsx";

interface AddBookFormProps {
    onSubmit: (bookData: Omit<Book, 'id'>) => void;
    onCancel: () => void;
    initialData?: Partial<Book>;
}

const AddBookForm = (props: AddBookFormProps) => {

    const [title, setTitle] = useState<string>(props.initialData?.title || '');
    const [author, setAuthor] = useState<string>(props.initialData?.author || '');
    const [genre, setGenre] = useState<string>(props.initialData?.genre || '');
    const [status, setStatus] = useState<BookStatus>(props.initialData?.status || '');
    const [format, setFormat] = useState<BookFormat>(props.initialData?.format || '');
    // TODO: add all the fields in the form
    // const [isbn, setIsbn] = useState<string>(props.initialData?.isbn || '');
    // const [publisher, setPublisher] = useState<string>(props.initialData?.publisher || '');

    const handleSubmit = (evt: { preventDefault: () => void; }) => {
        evt.preventDefault()
        props.onSubmit({
            isbn: "",
            publisher: "",
            author,
            genre,
            status,
            title,
            format
        })
    }

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border">
                <h2 className="text-xl font-bold mb-4">Add Physical Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Book Title</label>
                        <input required type="text" className="w-full border p-2 rounded-lg text-sm" value={title} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Author</label>
                        <input required type="text" className="w-full border p-2 rounded-lg text-sm" value={author} onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Genre</label>
                        <input required type="text" placeholder="Fantasy, Sci-Fi, History" className="w-full border p-2 rounded-lg text-sm" value={genre} onChange={e => setGenre(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Format</label>
                        <input required type="text" placeholder="Epub,Print" className="w-full border p-2 rounded-lg text-sm" value={format} onChange={e => setFormat(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Reading Status</label>
                        <select className="w-full border p-2 rounded-lg text-sm bg-white" value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Want to Read">Want to Read</option>
                            <option value="Reading">Reading</option>
                            <option value="Read">Read</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={props.onCancel} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">Save Book</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBookForm;