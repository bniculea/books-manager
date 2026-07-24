import { BookFormat} from "../../../constants/books.tsx";
import {
    BookOpenIcon,
    DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
interface BookCardProps {
    title: string;
    author: string;
    cover: string;
    formats: Array<BookFormat>;
}

const BookCard = (props: BookCardProps) => {
    return (
        <div className="flex gap-4 rounded-xl border border-gray-200 bg-amber-100 p-4 shadow-sm transition hover:shadow-md">
            <img
                src = {props.cover}
                alt = {props.title}
                className= "h-32 w-20 shrink-0 rounded-lg object-cover"
            />

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{props.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{props.author}</p>
                </div>

                <div className="mt-4 flex gap-2">
                    {props.formats.includes('epub') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            <DevicePhoneMobileIcon className="h-4 w-4" />
                            EPUB
                        </span>
                    )}

                    {props.formats.includes('print') && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            <BookOpenIcon className="h-4 w-4" />
                            PRINT
                        </span>
                    )}
                </div>

            </div>
        </div>
    )
}

export default BookCard;