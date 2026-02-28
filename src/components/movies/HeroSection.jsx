import React, { useState, useEffect } from 'react';
import { Play, Info, Heart } from 'lucide-react';
import { fetchPhimDangChieu } from '../../services/api';
import './HeroSection.css';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const [movies, setMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadMovies = async () => {
            const data = await fetchPhimDangChieu();
            if (data && data.length > 0) {
                setMovies(data.slice(0, 5)); // Take top 5 for rotator
            }
        };
        loadMovies();
    }, []);

    if (movies.length === 0) return null; // Or skeleton

    const currentMovie = movies[currentIndex];
    // Year parsing - Updated for new API
    const year = currentMovie.year || '2024';

    return (
        <div className="hero-container">
            <div className="hero-background">
                {/* Use thumb_url for landscape background if possible, fallbacks handled by img error if needed but we assume thumb_url is good */}
                <img
                    key={currentMovie.poster_url}
                    src={`https://img.ophim.live/uploads/movies/${currentMovie.poster_url}`}
                    alt="Hero Background"
                    className="fade-in"
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="hero-content container-fluid">
                <div className="hero-left">
                    <h1 className="hero-title">{currentMovie.name}</h1>
                    <p className="hero-subtitle">{currentMovie.origin_name}</p>

                    <div className="hero-meta">
                        <span className="meta-tag imdb" >{currentMovie.quality}</span>
                        <span className="meta-tag year">{year}</span>
                        <span className="meta-tag ep">{currentMovie.episode_current}</span>
                        <span className="meta-tag lang">{currentMovie.lang}</span>
                    </div>

                    {/* Genres are not easily available in this simple item view without detail fetch, 
                        so we skip or put static placeholders/logic if needed, or parse from somewhere else.
                        For now, omit or keep static if unsure, but user wants real data. 
                        We'll omit to be safe or use simple category name if passed.
                    */}

                    <div
                        className="hero-description"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        dangerouslySetInnerHTML={{ __html: currentMovie.description }}
                    ></div>

                    <div className="hero-actions">
                        <Link to={`/${currentMovie.slug}`}>
                            <button className="btn-play-circle">
                                <Play size={32} fill="currentColor" className="icon-play" />
                            </button>
                        </Link>
                        <button className="btn-icon-circle">
                            <Heart size={20} />
                        </button>
                        <button className="btn-icon-circle">
                            <Info size={20} />
                        </button>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="thumb-gallery">
                        {movies.map((movie, index) => (
                            <div
                                key={movie.id || index}
                                className={`thumb-item ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img src={`https://img.ophim.live/uploads/movies/${movie.thumb_url}`} alt={movie.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
