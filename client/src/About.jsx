import { useState } from 'react';
import Navbar from './Navbar';
import './About.css'; // Combined CSS file

function AboutAndFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      alert('Please fill all fields.');
      return;
    }

    const response = await fetch('https://bookrecc.vercel.app/send-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Feedback submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      alert('Error submitting feedback.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="about-container">
        <h1 className="page-heading">About Our Book Recommendation Website</h1>
        <div className="about-content">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              We aim to revolutionize the way readers find books by providing personalized recommendations tailored to individual interests and reading patterns. Our system leverages collaborative filtering, state-of-the-art algorithms, and community-driven insights.
            </p>
          </div>
          <div className="about-section">
            <h2>How Our Recommendation Engine Works</h2>
            <p>
              Our recommendation engine analyzes user behavior, ratings, and preferences to suggest books that match your unique tastes. By continuously learning and adapting, it provides a highly curated selection of books for every genre.
            </p>
          </div>
          <div className="about-section">
            <h2>Key Features</h2>
            <ul>
              <li><strong>Personalized Recommendations:</strong> Get book suggestions tailored to your interests.</li>
              <li><strong>Community Reviews:</strong> Explore reviews and ratings shared by our passionate reader community.</li>
              <li><strong>Reading Lists:</strong> Create, customize, and share reading lists with friends and the community.</li>
              <li><strong>Genre-Based Search:</strong> Filter recommendations based on genres and categories you love.</li>
            </ul>
          </div>
          <div className="about-section">
            <h2>Our Community</h2>
            <p>
              Join thousands of readers worldwide who share your love for books. Rate your favorite books, share your recommendations, and connect with fellow book lovers.
            </p>
          </div>
          <div className="about-section">
            <h2>Meet the Team</h2>
            <p>
              Our team comprises Pradheep, Rammith and Sanjay committed to making book discovery engaging, intuitive, and personal.
            </p>
          </div>
        </div>
      </div>
      <div className="feedback-container">
        <h1 className="feedback-heading">Feedback Form</h1>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-field">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="feedback-field">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="feedback-field">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="feedback-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AboutAndFeedback;
