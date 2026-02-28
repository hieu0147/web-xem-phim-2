import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchFilmDetail } from '../services/api';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BackToTop from '../components/common/BackToTop';
import './WatchMoviePage.css';

const WatchMoviePage = () => {
    const { movieSlug } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState('vietsub');
    const [selectedServer, setSelectedServer] = useState(0);
    const [isEpisodesExpanded, setIsEpisodesExpanded] = useState(true);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                console.log('Loading movie with slug:', movieSlug);
                const data = await fetchFilmDetail(movieSlug);
                console.log('API response:', data);
                
                if (data) {
                    setMovie(data);
                    
                    // Auto-select first available language and play first episode
                    if (data.episodes && data.episodes.length > 0) {
                        // Check if Vietsub is available (server with "Vietsub" in name)
                        const vietsubServer = data.episodes.findIndex(ep => 
                            ep.server_name.toLowerCase().includes('vietsub')
                        );
                        
                        // Check if Thuyết Minh is available (server with "Lồng" in name)
                        const thuyetminhServer = data.episodes.findIndex(ep => 
                            ep.server_name.toLowerCase().includes('lồng') || 
                            ep.server_name.toLowerCase().includes('thuyết minh')
                        );
                        
                        if (vietsubServer !== -1) {
                            setSelectedServer(vietsubServer);
                            setSelectedLanguage('vietsub');
                        } else if (thuyetminhServer !== -1) {
                            setSelectedServer(thuyetminhServer);
                            setSelectedLanguage('thuyet-minh');
                        } else {
                            setSelectedServer(0); // First server as fallback
                        }
                    }
                } else {
                    console.error('No movie data received');
                }
            } catch (error) {
                console.error('Error loading movie:', error);
            } finally {
                setLoading(false);
            }
        };
        
        if (movieSlug) {
            loadMovie();
            // Scroll to top immediately when entering watch page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.error('No movie slug provided');
            setLoading(false);
        }
    }, [movieSlug]);

    const handlePlayVideo = () => {
        setIsPlaying(true);
    };

    const handleLanguageChange = (language, serverIndex) => {
        setSelectedLanguage(language);
        setSelectedServer(serverIndex);
        setSelectedEpisode(1); // Reset to first episode when changing language
        setIsPlaying(false); // Stop playing when changing language
        
        // Scroll to video section when changing language
        setTimeout(() => {
            const videoSection = document.querySelector('.watch-header');
            if (videoSection) {
                videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleEpisodeSelect = (episodeNumber) => {
        setSelectedEpisode(episodeNumber);
        setIsPlaying(false); // Stop playing when changing episode
        
        // Scroll to video section when changing episode
        setTimeout(() => {
            const videoSection = document.querySelector('.watch-header');
            if (videoSection) {
                videoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // Handle comment submission
        console.log('Comment submitted:', comment);
        setComment('');
    };

    if (loading) {
        return (
            <div className="watch-movie-page">
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải phim...</p>
                </div>
                <Footer />
                <BackToTop />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="watch-movie-page">
                <Header />
                <div className="error-container">
                    <h3>Không tìm thấy phim</h3>
                    <p>Phim bạn tìm không tồn tại hoặc đã bị xóa.</p>
                    <button onClick={() => navigate('/')} className="back-home-btn">
                        Về trang chủ
                    </button>
                </div>
                <Footer />
                <BackToTop />
            </div>
        );
    }

    // Process movie data from API
    const movieData = {
        title: movie?.name || 'N/A',
        originalTitle: movie?.origin_name || 'N/A',
        imdbRating: movie?.imdb?.vote_average?.toFixed(1) || '0.0',
        year: movie?.year || '2024',
        genre: movie?.category?.[0]?.name || 'N/A',
        airedEpisodes: movie?.episode_current || '1',
        totalEpisodes: movie?.episode_total || '1',
        description: movie?.content ? movie.content.replace(/<[^>]*>/g, '').replace(/\\u003C|\\u003E|\\u002F/g, '') : 'Không có mô tả.',
        poster_url: movie?.poster_url || movie?.thumb_url || 'poster-default.jpg',
        rating: movie?.tmdb?.vote_average?.toFixed(1) || '0.0',
        cast: movie?.actor?.map(name => ({ 
            name, 
            avatar: `https://img.ophim.live/uploads/movies/actor-${name}.jpg` 
        })) || [],
        episodes: movie?.episodes?.[selectedServer]?.server_data?.map(ep => ({
            name: ep.name,
            slug: ep.slug,
            filename: ep.filename,
            link_embed: ep.link_embed,
            link_m3u8: ep.link_m3u8
        })) || [],
        quality: movie?.quality || 'HD',
        lang: movie?.lang || 'Vietsub',
        lang_key: movie?.lang_key || ['vs'],
        time: movie?.time || 'N/A',
        availableServers: movie?.episodes?.map(ep => ep.server_name) || []
    };

    // Debug logging
    console.log('Processed movieData:', movieData);
    console.log('Selected server:', selectedServer, 'Language:', selectedLanguage);

    return (
        <div className="watch-movie-page">
            <Header />
            
            <div className="watch-container">
                {/* Header */}
                <div className="watch-header">
                    <button className="back-btn" onClick={handleBack}>
                        <ArrowLeft size={20} />
                        <span>Xem phim {movieData.title}</span>
                    </button>
                </div>

                {/* Video Player Section */}
                <div className="video-section">
                    <div className="video-player">
                        {isPlaying && movieData.episodes.length > 0 ? (
                            <video
                                key={`${selectedServer}-${selectedEpisode}`}
                                controls
                                autoPlay
                                className="video-element"
                                poster={`https://img.ophim.live/uploads/movies/${movieData.poster_url}`}
                            >
                                <source 
                                    src={movieData.episodes[selectedEpisode - 1]?.link_m3u8} 
                                    type="application/x-mpegURL"
                                />
                                <source 
                                    src={movieData.episodes[selectedEpisode - 1]?.link_embed} 
                                    type="video/mp4"
                                />
                                Your browser does not support video tag.
                            </video>
                        ) : (
                            <div className="video-placeholder" onClick={handlePlayVideo}>
                                <img 
                                    src={`https://img.ophim.live/uploads/movies/${movieData.poster_url}`}
                                    alt={movieData.title}
                                    className="video-poster"
                                />
                                <div className="play-overlay">
                                    <Play size={60} fill="currentColor" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    {/* Left Column */}
                    <div className="left-column">
                        {/* Movie Info */}
                        <div className="movie-info">
                            <div className="movie-poster-section">
                                <img 
                                    src={`https://img.ophim.live/uploads/movies/${movieData.poster_url}`}
                                    alt={movieData.title}
                                    className="movie-poster"
                                />
                                <div className="movie-details">
                                    <h1 className="movie-title">{movieData.title}</h1>
                                    <h2 className="movie-original-title">{movieData.originalTitle}</h2>
                                    <div className="movie-meta">
                                        <span className="imdb-rating">IMDb {movieData.imdbRating}</span>
                                        <span className="year">{movieData.year}</span>
                                        <span className="genre">{movieData.genre}</span>
                                        <span className="quality">{movieData.quality}</span>
                                        <span className="language">{movieData.lang}</span>
                                    </div>
                                    <div className="episode-info">
                                        Đã chiếu: {movieData.airedEpisodes} - {movieData.time}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="movie-description">
                                <p>{movieData.description}</p>
                                <a href="#" className="more-info-link">Thông tin phim {'>'}</a>
                            </div>
                        </div>

                        {/* Episode Selection */}
                        <div className="episode-section">
                            <div className="episode-header">
                                {/* <h3>Phần 1</h3> */}
                                <div className="language-tabs">
                                    {movieData.availableServers.map((serverName, index) => {
                                        const isVietsub = serverName.toLowerCase().includes('vietsub');
                                        const isThuyetMinh = serverName.toLowerCase().includes('lồng') || 
                                                          serverName.toLowerCase().includes('thuyết minh');
                                        
                                        return (
                                            <button 
                                                key={index}
                                                className={`lang-tab ${selectedServer === index ? 'active' : ''}`}
                                                onClick={() => handleLanguageChange(
                                                    isVietsub ? 'vietsub' : isThuyetMinh ? 'thuyet-minh' : 'other',
                                                    index
                                                )}
                                            >
                                                {isVietsub ? 'Vietsub' : isThuyetMinh ? 'Thuyết Minh' : serverName}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button 
                                    className="expand-btn"
                                    onClick={() => setIsEpisodesExpanded(!isEpisodesExpanded)}
                                >
                                    {isEpisodesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    {isEpisodesExpanded ? 'Rút gọn' : 'Mở rộng'}
                                </button>
                            </div>
                            
                            {isEpisodesExpanded && (
                                <div className="episodes-grid">
                                {movieData.episodes.map((episode) => (
                                    <button
                                        key={`episode-${episode.slug || episode.name}`}
                                        className={`episode-btn ${selectedEpisode === parseInt(episode.name) ? 'active' : ''}`}
                                        onClick={() => handleEpisodeSelect(parseInt(episode.name))}
                                    >
                                        Tập {episode.name}
                                    </button>
                                ))}
                            </div>
                            )}
                        </div>

                        {/* Comment Section */}
                        <div className="comment-section">
                            <div className="comment-tabs">
                                <button className="tab active">Bình luận (5)</button>
                                <button className="tab">Đánh giá</button>
                                <button className="tab">Lịch chiếu</button>
                            </div>
                            
                            <div className="comment-form">
                                <p className="login-prompt">Vui lòng đăng nhập để tham gia bình luận.</p>
                                <form onSubmit={handleCommentSubmit}>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Viết bình luận hoặc gõ /lichchieu để đóng góp lịch chiếu"
                                        className="comment-input"
                                        maxLength="1000"
                                    />
                                    <div className="comment-actions">
                                        <label className="anonymous-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                            />
                                            Tối mật?
                                        </label>
                                        <div className="comment-submit">
                                            <span className="char-count">{comment.length}/1000</span>
                                            <button type="submit" className="submit-btn" disabled={!comment.trim()}>
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="action-btn">
                                <Star size={20} />
                                <span>Đánh giá</span>
                            </button>
                            <button className="action-btn">
                                <MessageCircle size={20} />
                                <span>Bình luận</span>
                            </button>
                            <button className="action-btn">
                                <Star size={20} />
                                <span>Đánh giá {movieData.rating}</span>
                            </button>
                        </div>

                        {/* Cast */}
                        <div className="cast-section">
                            <h3>Diễn viên</h3>
                            <div className="cast-grid">
                                {movieData.cast && movieData.cast.map((actor, index) => (
                                    <div key={`actor-${index}`} className="cast-member">
                                        <img 
                                            src={actor.avatar} 
                                            alt={actor.name}
                                            className="cast-avatar"
                                        />
                                        <span className="cast-name">{actor.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BackToTop />
        </div>
    );
};

export default WatchMoviePage;
