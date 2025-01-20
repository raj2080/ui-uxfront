// Communities.jsx
import React, { useState } from 'react';
import './Communities.css';

const Communities = () => {
    // Sample communities data
    const [communities, setCommunities] = useState([
        {
            id: 1,
            name: "Work Life",
            description: "Share your office confessions, workplace stories, and career moments.",
            members: 12543,
            confessions: 4567,
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
            isJoined: false,
            topics: ["Office", "Career", "Workplace", "Professional"],
            recentConfessions: 156,
            activeMembers: 789
        },
        {
            id: 2,
            name: "Student Life",
            description: "University tales, study adventures, and campus confessions.",
            members: 18234,
            confessions: 6789,
            image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
            isJoined: true,
            topics: ["University", "Study", "Campus", "Education"],
            recentConfessions: 234,
            activeMembers: 1023
        },
        {
            id: 3,
            name: "Love & Relationships",
            description: "Stories of love, heartbreak, and everything in between.",
            members: 15678,
            confessions: 7890,
            image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
            isJoined: false,
            topics: ["Dating", "Romance", "Relationships", "Marriage"],
            recentConfessions: 189,
            activeMembers: 867
        },
        {
            id: 4,
            name: "Food & Cooking",
            description: "Culinary confessions, recipe secrets, and food adventures.",
            members: 9876,
            confessions: 3456,
            image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352",
            isJoined: true,
            topics: ["Cooking", "Recipes", "Cuisine", "Food"],
            recentConfessions: 145,
            activeMembers: 567
        }
    ]);

    // Toggle join/leave community
    const toggleJoin = (communityId) => {
        setCommunities(communities.map(community => 
            community.id === communityId 
                ? { ...community, isJoined: !community.isJoined }
                : community
        ));
    };

    return (
        <div className="communities-page">
            <div className="communities-header">
                <div className="header-content">
                    <h1>Communities</h1>
                    <p>Join communities that interest you and start sharing your confessions</p>
                    <div className="communities-stats">
                        <div className="stat">
                            <h3>{communities.length}</h3>
                            <p>Total Communities</p>
                        </div>
                        <div className="stat">
                            <h3>{communities.reduce((acc, curr) => acc + curr.members, 0).toLocaleString()}</h3>
                            <p>Total Members</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="communities-grid">
                {communities.map(community => (
                    <div key={community.id} className="community-card">
                        <div className="community-image" style={{ backgroundImage: `url(${community.image})` }}>
                            <button 
                                className={`join-btn ${community.isJoined ? 'joined' : ''}`}
                                onClick={() => toggleJoin(community.id)}
                            >
                                {community.isJoined ? 'Joined' : 'Join'}
                            </button>
                        </div>
                        <div className="community-content">
                            <h2>{community.name}</h2>
                            <p className="description">{community.description}</p>
                            <div className="community-stats">
                                <span><i className="fas fa-users"></i> {community.members.toLocaleString()} members</span>
                                <span><i className="fas fa-comment-alt"></i> {community.confessions.toLocaleString()} confessions</span>
                            </div>
                            <div className="topics">
                                {community.topics.map(topic => (
                                    <span key={topic} className="topic-tag">{topic}</span>
                                ))}
                            </div>
                            <div className="activity-stats">
                                <div className="activity">
                                    <h4>{community.recentConfessions}</h4>
                                    <p>New Confessions This Week</p>
                                </div>
                                <div className="activity">
                                    <h4>{community.activeMembers}</h4>
                                    <p>Active Members</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Communities;