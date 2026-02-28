import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, SkipForward, Settings, Maximize, Maximize2 } from 'lucide-react';
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
    
    // Video controls states
    const [isPaused, setIsPaused] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [isVolumeDragging, setIsVolumeDragging] = useState(false);
    const videoRef = React.createRef();

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

    // Add global mouse event listeners for volume dragging
    useEffect(() => {
        const handleGlobalMouseMove = (e) => {
            handleVolumeMouseMove(e);
        };

        const handleGlobalMouseUp = () => {
            handleVolumeMouseUp();
        };

        if (isVolumeDragging) {
            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isVolumeDragging]);

    // Handle fullscreen change events
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
            
            setIsFullscreen(isCurrentlyFullscreen);
            
            // Unlock orientation if exiting fullscreen
            if (!isCurrentlyFullscreen && screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    const handlePlayVideo = () => {
        setIsPlaying(true);
        setIsPaused(false);
    };

    // Video control functions
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.play();
                setIsPaused(false);
            } else {
                videoRef.current.pause();
                setIsPaused(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        if (videoRef.current) {
            videoRef.current.currentTime = percent * duration;
            setCurrentTime(percent * duration);
        }
    };

    const handleVolumeChange = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newVolume = Math.max(0, Math.min(1, percent));
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const handleVolumeMouseDown = (e) => {
        e.preventDefault();
        setIsVolumeDragging(true);
        handleVolumeChange(e);
    };

    const handleVolumeMouseMove = (e) => {
        if (isVolumeDragging) {
            handleVolumeChange(e);
        }
    };

    const handleVolumeMouseUp = () => {
        setIsVolumeDragging(false);
    };

    const toggleMute = () => {
        if (videoRef.current) {
            if (isMuted) {
                videoRef.current.volume = volume;
                setIsMuted(false);
            } else {
                videoRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    };

    const skipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, currentTime - 10);
        }
    };

    const skipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, currentTime + 10);
        }
    };

    const toggleFullscreen = () => {
        const videoContainer = document.querySelector('.video-player');
        if (!isFullscreen) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            }
            // Force landscape orientation on mobile
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {
                    // Fallback for browsers that don't support orientation lock
                    console.log('Orientation lock not supported');
                });
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            // Unlock orientation when exiting fullscreen
            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(window.controlsTimeout);
        window.controlsTimeout = setTimeout(() => {
            if (!isPaused) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleControlsMouseEnter = () => {
        clearTimeout(window.controlsTimeout);
        setShowControls(true);
    };

    const handleControlsMouseLeave = () => {
        if (!isPaused) {
            window.controlsTimeout = setTimeout(() => {
                setShowControls(false);
            }, 1000);
        }
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
                    <div className="video-player" onMouseMove={handleMouseMove}>
                        {isPlaying && movieData.episodes.length > 0 ? (
                            <>
                                <video
                                    ref={videoRef}
                                    key={`${selectedServer}-${selectedEpisode}`}
                                    autoPlay
                                    className="video-element"
                                    poster={`https://img.ophim.live/uploads/movies/${movieData.poster_url}`}
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onClick={togglePlayPause}
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
                                
                                {/* Custom Video Controls Overlay */}
                                <div 
                                    className={`video-controls ${showControls ? 'visible' : 'hidden'}`}
                                    onMouseEnter={handleControlsMouseEnter}
                                    onMouseLeave={handleControlsMouseLeave}
                                >
                                    {/* Progress Bar */}
                                    <div className="progress-bar" onClick={handleSeek}>
                                        <div className="progress-buffer"></div>
                                        <div 
                                            className="progress-played" 
                                            style={{ width: `${(currentTime / duration) * 100}%` }}
                                        ></div>
                                    </div>
                                    
                                    {/* Controls Container */}
                                    <div className="controls-container">
                                        {/* Left Controls */}
                                        <div className="controls-left">
                                            <button className="control-btn play-pause-btn" onClick={togglePlayPause}>
                                                {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} />}
                                            </button>
                                            
                                            <div className="volume-control">
                                                <button className="control-btn volume-btn" onClick={toggleMute}>
                                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                                </button>
                                                <div 
                                                    className="volume-slider" 
                                                    onMouseDown={handleVolumeMouseDown}
                                                    onClick={handleVolumeChange}
                                                >
                                                    <div 
                                                        className="volume-level" 
                                                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            
                                            <span className="time-display">
                                                {formatTime(currentTime)} / {formatTime(duration)}
                                            </span>
                                        </div>
                                        
                                        {/* Right Controls */}
                                        <div className="controls-right">
                                            <button className="control-btn skip-btn" onClick={skipBackward}>
                                                <RotateCcw className="skip-icon" size={28} />
                                                <span className="skip-text">10</span>
                                            </button>
                                            
                                            <button className="control-btn skip-btn" onClick={skipForward}>
                                                <RotateCw className="skip-icon" size={28} />
                                                <span className="skip-text">10</span>
                                            </button>
                                            
                                            <button className="control-btn">
                                                <SkipForward className="skip-icon" size={20} />
                                            </button>
                                            
                                            <button className="control-btn">
                                                <Settings className="skip-icon" size={20} />
                                            </button>
                                            
                                            <button className="control-btn" onClick={toggleFullscreen}>
                                                {isFullscreen ? <Maximize2 className="skip-icon" size={20} /> : <Maximize className="skip-icon" size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
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
