import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './Yourlist.css';

function Yourlist() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    // Fetch user data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's book list
                const response = await fetch(`http://localhost:5000/userdata/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();

                // Get detailed book info from Google Books API
                const booksWithDetails = await Promise.all(
                    userData.map(async (book) => {
                        try {
                            const apiKey = "AIzaSyAmRw8ueEaAZInhJID9UeRfnyeJMjRYYv4";
                            const googleBooksResponse = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}&key=${apiKey}`
                            );
                            const googleBooksData = await googleBooksResponse.json();
                            const bookDetails = googleBooksData.items ? googleBooksData.items[0] : null;

                            return {
                                ...book,
                                googleBookData: bookDetails,
                            };
                        // eslint-disable-next-line no-unused-vars
                        } catch (error) {
                            console.error("Failed to fetch details for ISBN:", book.ISBN);
                            return { ...book, googleBookData: null };
                        }
                    })
                );

                setBooks(booksWithDetails);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="yourlist-container">
            <Navbar />
            <h1 className="title10">To-Read List</h1>
            <div className="yourlist-items-container">
                {books.map((book, index) => (
                    <div key={index} className="yourlist-item-card">
                        <div className="yourlist-item-details">
                            <h2>{book.title}</h2>
                            {book.googleBookData ? (
                                <div>
                                    <p>Author(s): {book.googleBookData.volumeInfo.authors?.join(", ")}</p>
                                    <button
                                    onClick={() => window.open(book.googleBookData.volumeInfo.previewLink, "_blank")}
                                    className="yourlist-button"
                                    >
                                    Preview
                                    </button>

                                    
                                </div>
                            ) : (
                                <p>Details not available from Google Books API</p>
                            )}
                        </div>
                        {book.googleBookData && book.googleBookData.volumeInfo.imageLinks?.thumbnail && (
                            <div className="yourlist-item-image">
                                <img
                                    src={book.googleBookData.volumeInfo.imageLinks.thumbnail}
                                    alt={book.googleBookData.volumeInfo.title}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Yourlist;
