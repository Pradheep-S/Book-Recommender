// Import React and required hooks
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css"; // Importing the CSS file for styling

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for displaying error messages
  const username = localStorage.getItem('username');

  const API_KEY = "AIzaSyAmRw8ueEaAZInhJID9UeRfnyeJMjRYYv4";

  const fetchBooks = async () => {
    try {
      if (!searchTerm.trim() && !selectedCategory) {
        setErrorMessage("Please enter a search term or select a category.");
        setBooks([]);
        return;
      }

      setErrorMessage("");
      let query = searchTerm ? `q=${searchTerm}` : "q=";
      if (selectedCategory) {
        query += `+subject:${selectedCategory}`;
      }

      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?${query}&key=${API_KEY}`
      );
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setErrorMessage("Failed to fetch books. Please try again later.");
    }
  };

  const handleViewBook = (previewLink) => {
    window.open(previewLink, "_blank");
  };

  const [addedBooks, setAddedBooks] = useState({});

const handleAddToRead = async (book) => {
  try {
    const bookData = {
      username, 
      ISBN: book.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A",
      title: book.volumeInfo.title || "Unknown Title",
      author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
      yearOfPublication: parseInt(book.volumeInfo.publishedDate) || new Date().getFullYear(),
      publisher: book.volumeInfo.publisher || "Unknown Publisher",
      imageUrlS: book.volumeInfo.imageLinks?.smallThumbnail || "https://via.placeholder.com/150",
      imageUrlM: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
      imageUrlL: book.volumeInfo.imageLinks?.large || "https://via.placeholder.com/150",
    };

    console.log("Book Data:", bookData);
    const response = await axios.post("https://bookrecc.vercel.app/addToRead", bookData);
    console.log(response.data);

    // Update the state to indicate the book was added
    setAddedBooks((prevState) => ({
      ...prevState,
      [book.id]: true,
    }));
  } catch (error) {
    console.error("Error adding book to read:", error);
  }
};

  
  const handleRating = async (book) => {
    const rating = prompt("Enter a rating from 1 to 5:");
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      alert("Invalid rating. Please enter a number between 1 and 5.");
      return;
    }

    try {
      const response = await axios.post("https://bookrecc.vercel.app/rateBook", {
        username,
        ISBN: book.volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A",
        title: book.volumeInfo.title,
        rating: Number(rating),
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error rating book:", error);
    }
  };

  const handleSearch = () => {
    fetchBooks();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchBooks();
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchBooks();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            onKeyPress={handleKeyPress}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="dropdown-select"
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Nonfiction">Non-fiction</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Biography">Biography</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
          </select>
          <button onClick={handleSearch} className="search-button">
            Search Now
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="books-container">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="book-card">
                <div className="book-image">
                  <img
                    src={book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150"}
                    alt={book.volumeInfo.title}
                  />
                </div>
                <div className="book-details">
                  <h3>{book.volumeInfo.title}</h3>
                  <p><strong>Author(s):</strong> {book.volumeInfo.authors?.join(", ") || "N/A"}</p>
                  <p><strong>Description:</strong> {book.volumeInfo.description || "No description available."}</p>
                  <button
                    onClick={() => handleViewBook(book.volumeInfo.previewLink)}
                    className="view-button"
                  >
                    View Book
                  </button>
                  <button
                    onClick={() => handleAddToRead(book)}
                    className={`add-to-read-button ${addedBooks[book.id] ? "added" : ""}`}
                    disabled={!!addedBooks[book.id]} // Disable the button after it is clicked
                  >
                    {addedBooks[book.id] ? "Added!" : "Add to Read"}
                  </button>

                  <button
                    onClick={() => handleRating(book)}
                    className="rating-button"
                  >
                    Rate Book
                  </button>
                </div>
              </div>
            ))
          ) : (
            !errorMessage && <p className="no-results-message">No books found. Please try a different search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
