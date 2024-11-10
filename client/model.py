from pymongo import MongoClient
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/bookrec')
db = client['bookrec']  # Replace with your actual database name
userdata_collection = db['userdata']
ratings_collection = db['ratings']

# Function to fetch similar books using Google Books API
def fetch_similar_books(isbn):
    api_key = "AIzaSyAmRw8ueEaAZInhJID9UeRfnyeJMjRYYv4"
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key={api_key}"
    response = requests.get(url)

    if response.status_code == 200:
        books = response.json().get("items", [])
        recommendations = []

        for book in books:
            volume_info = book.get("volumeInfo", {})
            recommendations.append({
                "title": volume_info.get("title"),
                "authors": volume_info.get("authors", []),
                "publishedDate": volume_info.get("publishedDate"),
                "description": volume_info.get("description"),
            })
        return recommendations
    return []

# Collaborative Filtering Function
def collaborative_filtering(username):
    # Get user's rated books
    user_ratings = list(ratings_collection.find({"username": username}))

    if not user_ratings:
        return None  # No ratings available for collaborative filtering

    # Collaborative filtering based recommendation (simplified example)
    similar_users = ratings_collection.find({"ISBN": {"$in": [rating['ISBN'] for rating in user_ratings]},
                                             "username": {"$ne": username}})
    similar_users_books = {book['ISBN'] for book in similar_users}

    recommendations = list(userdata_collection.find({"ISBN": {"$in": list(similar_users_books)}}))
    return recommendations if recommendations else None

# Content-Based Recommendation Function
def content_based_recommendation(username):
    user_data = userdata_collection.find_one({"username": username})

    if not user_data:
        return []

    # Fetch all books
    all_books = list(userdata_collection.find())
    all_titles = [book['title'] for book in all_books]

    # TF-IDF Vectorization
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(all_titles)

    # Compute similarity scores
    user_index = all_titles.index(user_data['title'])
    cosine_similarities = linear_kernel(tfidf_matrix[user_index], tfidf_matrix).flatten()

    # Get indices of similar books
    similar_indices = cosine_similarities.argsort()[:-5:-1]
    similar_books = [all_books[i] for i in similar_indices if i != user_index]

    return similar_books

# Recommendation Function
def generate_recommendations(username):
    # Try collaborative filtering first
    recommendations = collaborative_filtering(username)

    if recommendations:
        print(f"Collaborative Recommendations for {username}:")
        for rec in recommendations:
            print(f"- {rec['title']} by {rec['author']} (ISBN: {rec['ISBN']})")
    else:
        # Fallback to content-based recommendation
        print(f"Content-Based Recommendations for {username}:")
        recommendations = content_based_recommendation(username)

        for rec in recommendations:
            print(f"- {rec['title']} by {rec['author']} (ISBN: {rec['ISBN']})")

        # Fetch similar books using Google Books API as an additional suggestion
        user_data = userdata_collection.find_one({"username": username})
        if user_data and 'ISBN' in user_data:
            similar_books = fetch_similar_books(user_data['ISBN'])
            if similar_books:
                print("\nGoogle Books API Suggestions:")
                for book in similar_books:
                    print(f"- {book['title']} by {', '.join(book['authors'])} (Published: {book['publishedDate']})")
        else:
            print("\nNo additional suggestions available due to lack of user data.")
# Run recommendation for a specific user
generate_recommendations("user11")
