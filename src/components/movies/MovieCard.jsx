import React from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    // Map API fields to UI - Updated for new API structure
    const imageUrl = movie.poster_url || movie.thumb_url;
    
    // Language mapping from new API
    const getLanguageBadge = () => {
        if (movie.lang_key) {
            if (movie.lang_key.includes('vs') && movie.lang_key.includes('lt')) {
                return 'PĐ + TM';
            } else if (movie.lang_key.includes('vs')) {
                return 'PĐ';
            } else if (movie.lang_key.includes('lt')) {
                return 'TM';
            }
        }
        return movie.lang || 'PĐ';
    };

    return (
        <div className="movie-card landscape">
            <Link to={`/${movie.slug}`}>
                <div className="card-image">
                    <img 
                        src={`https://img.ophim.live/uploads/movies/${movie.poster_url || movie.thumb_url}`} 
                        alt={movie.name} 
                        loading="lazy"
                    />
                    <div className="card-overlay">
                        <button className="play-btn-mini">
                            <Play size={16} fill="currentColor" />
                        </button>
                        {/* Badge Logic - Updated for new API */}
                        <span className={`card-badge ${movie.lang_key && movie.lang_key.includes('lt') ? 'pd' : 'tm'}`}>
                            {getLanguageBadge()} . {movie.episode_current}
                        </span>
                    </div>
                </div>
                <div className="card-info">
                    <h3 className="card-title">{movie.name}</h3>
                    <p className="card-subtitle">{movie.origin_name} ({movie.year || ''})</p>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;
