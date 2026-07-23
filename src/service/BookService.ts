import {FILE_PATH, REPO_NAME, REPO_OWNER} from "../config.ts";
import {Book} from "../types/Book.tsx";

export const handleAddBook = async (token: string, book: Book) => {
    if (!token) return alert("Please provide a GitHub Personal Access Token first!");

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    try {
        const res = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
        if (!res.ok) throw new Error("Could not fetch file metadata from GitHub.");
        const fileData = await res.json();

        const currentContent = JSON.parse(atob(fileData.content));
        const updatedBook = { ...book, id: Date.now().toString() };
        const updatedContent = [...currentContent, updatedBook];

        const putRes = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: `📚 Added book: ${book.title}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(updatedContent, null, 2)))),
                sha: fileData.sha
            })
        });

        if (putRes) {
            console.log("Book added successfully!");
        }

        //TODO: handle action after book is added
        // if (putRes.ok) {
        //     setBooks(updatedContent);
        //     setIsOpen(false);
        //     setNewBook({ title: '', author: '', genre: '', status: 'Want to Read' });
        //     alert("Success! Book saved to GitHub. The live page will refresh completely in a minute.");
        // } else {
        //     alert("Failed to commit changes. Check your token scopes.");
        // }
    } catch (err: unknown) {
        if (err instanceof Error) {
            alert(err.message); // Safe! TypeScript knows err is an Error here.
        } else {
            alert('An unexpected error occurred.');
        }
    }
};
