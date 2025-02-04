import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './Yourlist.css';

function Yourlist() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const username = localStorage.getItem('username');

    // Fetch user data and recommendations from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user's book list
                const response = await fetch(`https://bookrecc.vercel.app/api/userdata/${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const userData = await response.json();

                // Fetch book details using the Google Books API
                const booksWithDetails = await Promise.all(
                    userData.map(async (book) => {
                        try {
                            const apiKey = "AIzaSyAmRw8ueEaAZInhJID9UeRfnyeJMjRYYv4";
                            const googleBooksResponse = await fetch(
                                `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.ISBN}&key=${apiKey}`
                            );
                            if (!googleBooksResponse.ok) {
                                throw new Error("Failed to fetch book details");
                            }
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

                // Fetch recommendations from the backend
                const recommendationResponse = await fetch(`https://bookrecc.vercel.app/api/recommendations/${username}`);
                if (!recommendationResponse.ok) {
                    throw new Error("Failed to fetch recommendations");
                }
                const recommendationData = await recommendationResponse.json();
                setRecommendations(recommendationData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        } else {
            setError("No username found. Please log in.");
            setLoading(false);
        }
    }, [username]);

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="load-msg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Navbar />
                <div className="error-msg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="yourlist-container">
            <Navbar />
            <h1 className="title10">To-Read List</h1>
            <div className="yourlist-content">
                {/* Left Section */}
                <div className="yourlist-left">
                    <div className="yourlist-items-container">
                        {books.map((book, index) => (
                            <div key={index} className="yourlist-item-card">
                                <div className="yourlist-item-details">
                                    <h2>{book.title}</h2>
                                    {book.googleBookData ? (
                                        <div>
                                            <p>Author(s): {book.googleBookData.volumeInfo.authors?.join(", ") || 'Unknown Author'}</p>
                                            <button
                                                onClick={() => window.open(book.googleBookData.volumeInfo.previewLink, "_blank")}
                                                className="yourlist-button"
                                            >
                                                Preview
                                            </button>
                                        </div>
                                    ) : (
                                        <p>Details not available</p>
                                    )}
                                </div>
                                {book.googleBookData && book.googleBookData.volumeInfo.imageLinks?.thumbnail && (
                                    <div className="yourlist-item-image">
                                        <img
                                            src={book.googleBookData.volumeInfo.imageLinks.thumbnail}
                                            alt={book.googleBookData.volumeInfo.title || 'Book Cover'}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className="yourlist-right">
                    <h2><u>Recommendations</u></h2>
                    {recommendations.length > 0 ? (
                        <div className="recommendation-container">
                            {recommendations.map((rec, index) => (
                                <div key={index} className="recommendation-card">
                                    <h3>{rec.title}</h3>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(rec.title)}+book`)}
                                        className="yourlist-buttonrec"
                                    >
                                        See about the book
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No recommendations available at this time.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Yourlist;
