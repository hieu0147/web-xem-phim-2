import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Film } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';
import { 
    fetchKoreanMovies, 
    fetchChineseMovies, 
    fetchVietnameseMovies, 
    fetchPhimBo, 
    fetchPhimLe, 
    fetchTvShows,
    fetchMoviesByGenre,
    fetchMoviesByCountry
} from '../services/api';
import './AllMoviesPage.css';

const AllMoviesPage = () => {
    const { type, slug } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [title, setTitle] = useState('');
    const [fetchFunction, setFetchFunction] = useState(null);

    // Map type to fetch function and title
    const typeConfig = {
        'phim-han-quoc': {
            title: 'Phim Hàn Quốc',
            fetchFunction: fetchKoreanMovies
        },
        'phim-trung-quoc': {
            title: 'Phim Trung Quốc',
            fetchFunction: fetchChineseMovies
        },
        'phim-viet-nam': {
            title: 'Phim Việt Nam',
            fetchFunction: fetchVietnameseMovies
        },
        'phim-bo': {
            title: 'Phim Bộ',
            fetchFunction: fetchPhimBo
        },
        'phim-le': {
            title: 'Phim Lẻ',
            fetchFunction: fetchPhimLe
        },
        'tv-shows': {
            title: 'TV Shows',
            fetchFunction: fetchTvShows
        },
        'the-loai': {
            title: `Thể loại: ${slug}`,
            fetchFunction: (page) => fetchMoviesByGenre(slug, page)
        },
        'quoc-gia': {
            title: `Quốc gia: ${slug}`,
            fetchFunction: (page) => fetchMoviesByCountry(slug, page)
        }
    };

    useEffect(() => {
        const config = typeConfig[type];
        if (config) {
            setTitle(config.title);
            setFetchFunction(() => config.fetchFunction);
            setCurrentPage(1);
            setMovies([]);
        }
    }, [type, slug]);

    useEffect(() => {
        if (fetchFunction) {
            loadMovies(currentPage);
        }
    }, [fetchFunction, currentPage]);

    const loadMovies = async (page) => {
        if (!fetchFunction) return;
        
        setLoading(true);
        try {
            const newMovies = await fetchFunction(page);
            if (page === 1) {
                setMovies(newMovies);
            } else {
                setMovies(prev => [...prev, ...newMovies]);
            }
            setHasMore(newMovies.length > 0);
        } catch (error) {
            // console.error('Error loading movies:', error);
            setMovies([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    if (loading && currentPage === 1) {
        return (
            <div className="all-movies-page">
                <div className="movies-loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải phim...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="all-movies-page">
            <div className="movies-header">
                <button className="back-btn" onClick={handleBack}>
                    <ChevronLeft size={20} />
                    <span>Quay lại</span>
                </button>
                <h1 className="page-title">{title}</h1>
            </div>

            <div className="movies-content container">
                {movies.length > 0 ? (
                    <>
                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <div key={movie.slug} className="movie-item">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                        
                        {hasMore && (
                            <div className="load-more-section">
                                <button 
                                    className="load-more-btn"
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang tải...' : 'Xem thêm'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-movies">
                        <Film size={48} className="no-movies-icon" />
                        <h3>Không tìm thấy phim nào</h3>
                        <p>Thử lại sau hoặc xem danh mục khác nhé</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllMoviesPage;
