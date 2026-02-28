import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Film } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';
import { searchFilms } from '../services/api';
import './SearchPage.css';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const searchQuery = searchParams.get('q');
        if (searchQuery) {
            setQuery(searchQuery);
            performSearch(searchQuery, 1);
        }
    }, [searchParams]);

    const performSearch = async (searchQuery, page = 1) => {
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        try {
            const movies = await searchFilms(searchQuery, page);
            if (page === 1) {
                setResults(movies);
            } else {
                setResults(prev => [...prev, ...movies]);
            }
            setHasMore(movies.length > 0);
        } catch (error) {
            // console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        performSearch(query, nextPage);
    };

    return (
        <div className="search-page">
            <div className="search-content container">
                {query && (
                    <div className="search-info">
                        <h2 className="search-title">
                            {loading ? 'Đang tìm kiếm...' : `Kết quả cho "${query}"`}
                        </h2>
                        {!loading && results.length > 0 && (
                            <p className="search-count">Tìm thấy {results.length} kết quả</p>
                        )}
                    </div>
                )}

                {loading && currentPage === 1 ? (
                    <div className="search-loading">
                        <div className="loading-spinner"></div>
                        <p>Đang tìm kiếm phim...</p>
                    </div>
                ) : (
                    <>
                        {results.length > 0 ? (
                            <>
                                <div className="search-results-grid">
                                    {results.map((movie) => (
                                        <div key={movie.slug} className="search-result-item">
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
                        ) : query && !loading ? (
                            <div className="no-results">
                                <Film size={48} className="no-results-icon" />
                                <h3>Không tìm thấy phim nào</h3>
                                <p>Thử tìm kiếm với từ khóa khác nhé</p>
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
