import React from "react";
import Navbar from "../../components/Navbar";

const Homepage = () => {
    return (
        <>
           
            
            <div className="container mt-4">
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img 
                                src="https://kidlingoo.com/wp-content/uploads/flowers_name_in_english.jpg" 
                                className="d-block mx-auto" 
                                alt="..." 
                                style={{ maxWidth: '100%', height: '400px' }} // Adjust the size here
                            />
                        </div>
                        <div className="carousel-item">
                            <img 
                                src="https://i.pinimg.com/736x/90/40/03/9040034f5d635f46a4fb92128964fcca.jpg" 
                                className="d-block mx-auto" 
                                alt="..." 
                                style={{ maxWidth: '100%', height: '400px' }} // Adjust the size here
                            />
                        </div>
                        <div className="carousel-item">
                            <img 
                                src="https://hips.hearstapps.com/hmg-prod/images/hummingbird-feeding-at-bleeding-heart-bloom-royalty-free-image-1656108706.jpg?crop=0.536xw:1.00xh;0.116xw,0&resize=980:*" 
                                className="d-block mx-auto" 
                                alt="..." 
                                style={{ maxWidth: '100%', height: '400px' }} // Adjust the size here
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Homepage;