// Homepage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [userData, setUserData] = useState(null);
    const [currentUser, setCurrentUser] = useState(''); // Added current user

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const year = now.getUTCFullYear();
            const month = String(now.getUTCMonth() + 1).padStart(2, '0');
            const day = String(now.getUTCDate()).padStart(2, '0');
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            
            setCurrentDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);

        // Get user data from localStorage
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUserData(userData);
                setCurrentUser(userData.nickname || 'anonymous');
            }
        } catch (error) {
            console.error('Error getting user data:', error);
            setCurrentUser('anonymous');
        }

        return () => clearInterval(timer);
    }, []);

    // Sample data for stats
    const stats = {
        totalPosts: 15234,
        activeMembers: 5678,
        communities: 89
    };

    // Top 7 confessions data
    const topConfessions = [
        {
            id: 1,
            title: "My Coffee Secret",
            content: "I've been pretending to like coffee for 5 years just to fit in at work.",
            community: "Work Life",
            likes: 1520,
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
        },
        {
            id: 2,
            title: "Hidden Talent",
            content: "I'm secretly a published author under a pen name, but none of my friends know.",
            community: "Creative Arts",
            likes: 2341,
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a"
        },
        {
            id: 3,
            title: "University Life",
            content: "I graduated top of my class by studying in the library bathroom because it was the quietest place.",
            community: "Student Life",
            likes: 1890,
            image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f"
        },
        {
            id: 4,
            title: "Wedding Confession",
            content: "I caught the bouquet at my friend's wedding but pretended to miss because I didn't want the attention.",
            community: "Relationships",
            likes: 2156,
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6"
        },
        {
            id: 5,
            title: "Food Secret",
            content: "I'm a professional chef who loves instant ramen more than gourmet food.",
            community: "Food & Cooking",
            likes: 3102,
            image: "https://images.unsplash.com/photo-1547928578-bca3e9c5a521"
        },
        {
            id: 6,
            title: "Gaming Achievement",
            content: "I let my little brother believe he beat me in his favorite game. It's been our tradition for 10 years.",
            community: "Gaming",
            likes: 2789,
            image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8"
        },
        {
            id: 7,
            title: "Travel Story",
            content: "I learned an entire language just to order food correctly at my favorite restaurant abroad.",
            community: "Travel",
            likes: 2567,
            image: "https://images.unsplash.com/photo-1533105079780-92b9be482077"
        }
    ];

    const trendingConfessions = [
        {
            id: 1,
            title: "University Confession",
            content: "I accidentally submitted the wrong file for my final thesis and somehow got an A+. I've been too scared to tell anyone.",
            likes: 456,
            comments: 89
        },
        {
            id: 2,
            title: "Office Life",
            content: "I'm the one who's been replacing all the coffee with decaf for the past month. Productivity actually went up!",
            likes: 789,
            comments: 234
        },
        {
            id: 3,
            title: "Family Secret",
            content: "I've been secretly taking cooking classes for 6 months to recreate my grandmother's legendary recipes.",
            likes: 567,
            comments: 123
        },
        {
            id: 4,
            title: "Wedding Drama",
            content: "I knew who objected at my sister's wedding but have kept it secret for 5 years.",
            likes: 999,
            comments: 345
        }
    ];

    const newConfessions = [
        {
            id: 1,
            title: "First Day Jitters",
            content: "Just started my dream job and I have no idea what I'm doing. Everyone thinks I'm doing great!",
            likes: 45,
            comments: 12
        },
        {
            id: 2,
            title: "Secret Talent",
            content: "I can perfectly mimic my boss's voice and have been entertaining coworkers at lunch.",
            likes: 67,
            comments: 23
        },
        {
            id: 3,
            title: "Midnight Gardener",
            content: "I've been secretly planting flowers in my neighbor's garden at night to cheer them up.",
            likes: 89,
            comments: 34
        },
        {
            id: 4,
            title: "Pizza Confession",
            content: "I'm a professional chef who prefers frozen pizza over anything I make at work.",
            likes: 78,
            comments: 45
        }
    ];

    const popularConfessions = [
        {
            id: 1,
            title: "Life Hack Confession",
            content: "I've been using my cat's Instagram fame to get free stuff from local businesses.",
            likes: 9876,
            comments: 543
        },
        {
            id: 2,
            title: "Birthday Surprise",
            content: "I forgot my wife's birthday but convinced her the surprise party was planned for the next day.",
            likes: 8765,
            comments: 432
        },
        {
            id: 3,
            title: "Office Hero",
            content: "Everyone thinks I saved the company millions, but I just fixed a typo in Excel.",
            likes: 7654,
            comments: 321
        },
        {
            id: 4,
            title: "Gaming Legend",
            content: "I'm known as an unbeatable gaming champion in my town, but I've been using cheat codes all along.",
            likes: 6543,
            comments: 210
        }
    ];

    return (
        <div className="homepage">
            <div className="user-info-display">
                <p className="datetime-display">
                    Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {currentDateTime}
                </p>
                <p className="user-display">
                    Current User's Login: {currentUser}
                </p>
            </div>

            <section className="top-confessions-section">
                <h2>Top 7 Confessions from Communities</h2>
                <div className="carousel-wrapper">
                    <div id="topConfessionsCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
                        <div className="carousel-indicators">
                            {topConfessions.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    data-bs-target="#topConfessionsCarousel"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : "false"}
                                    aria-label={`Slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>
                        
                        <div className="carousel-inner">
                            {topConfessions.map((confession, index) => (
                                <div key={confession.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <div className="carousel-content">
                                        <div className="carousel-text">
                                            <h3>{confession.title}</h3>
                                            <p>{confession.content}</p>
                                            <div className="confession-meta">
                                                <span className="community">
                                                    <i className="fas fa-users"></i> {confession.community}
                                                </span>
                                                <span className="likes">
                                                    <i className="fas fa-heart"></i> {confession.likes.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="carousel-image" 
                                             style={{ backgroundImage: `url(${confession.image})` }}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="carousel-control-prev" type="button" data-bs-target="#topConfessionsCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#topConfessionsCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <h2>Current Stats</h2>
                <div className="stats-container">
                    <div className="stat-card">
                        <i className="fas fa-file-alt"></i>
                        <h3>{stats.totalPosts.toLocaleString()}</h3>
                        <p>Total Confessions</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-users"></i>
                        <h3>{stats.activeMembers.toLocaleString()}</h3>
                        <p>Active Members</p>
                    </div>
                    <div className="stat-card">
                        <i className="fas fa-building"></i>
                        <h3>{stats.communities}</h3>
                        <p>Communities</p>
                    </div>
                </div>
            </section>

            <section className="trending-section">
                <div className="section-header">
                    <h2>Trending Confessions</h2>
                    <Link to="/trending" className="view-more-btn">
                        View More <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
                <div className="confessions-grid">
                    {trendingConfessions.map(confession => (
                        <div key={confession.id} className="confession-card">
                            <h3>{confession.title}</h3>
                            <p>{confession.content}</p>
                            <div className="confession-meta">
                                <span>
                                    <i className="fas fa-heart"></i> {confession.likes} likes
                                </span>
                                <span>
                                    <i className="fas fa-comment"></i> {confession.comments} comments
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="new-section">
                <div className="section-header">
                    <h2>New Confessions</h2>
                    <Link to="/new" className="view-more-btn">
                        View More <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
                <div className="confessions-grid">
                    {newConfessions.map(confession => (
                        <div key={confession.id} className="confession-card">
                            <h3>{confession.title}</h3>
                            <p>{confession.content}</p>
                            <div className="confession-meta">
                                <span>
                                    <i className="fas fa-heart"></i> {confession.likes} likes
                                </span>
                                <span>
                                    <i className="fas fa-comment"></i> {confession.comments} comments
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="popular-section">
                <div className="section-header">
                    <h2>Popular Confessions</h2>
                    <Link to="/popular" className="view-more-btn">
                        View More <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>
                <div className="confessions-grid">
                    {popularConfessions.map(confession => (
                        <div key={confession.id} className="confession-card">
                            <h3>{confession.title}</h3>
                            <p>{confession.content}</p>
                            <div className="confession-meta">
                                <span>
                                    <i className="fas fa-heart"></i> {confession.likes} likes
                                </span>
                                <span>
                                    <i className="fas fa-comment"></i> {confession.comments} comments
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Homepage;