import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './Top10Section.css';

const getBadgeText = (movie) => {
    const lang = movie.lang || '';
    const ep = movie.episode_current || '';
    let part = 'TM';
    if (movie.lang_key) {
        if (movie.lang_key.includes('vs') && movie.lang_key.includes('lt')) part = 'PĐ + TM';
        else if (movie.lang_key.includes('vs')) part = 'PĐ';
        else if (movie.lang_key.includes('lt')) part = 'TM';
    }
    return ep ? `${part}. ${ep}` : part;
};

const getBadgeClass = (movie) => {
    if (movie.lang_key && movie.lang_key.includes('lt')) return 'pd';
    return 'tm';
};

const Top10Section = ({ movies, title }) => {
    const top10 = (movies || []).slice(0, 10);
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

    const checkButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft: sl, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftBtn(sl > 0);
            setShowRightBtn(sl < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkButtons();
        window.addEventListener('resize', checkButtons);
        return () => window.removeEventListener('resize', checkButtons);
    }, [movies]);

    const handleMouseDown = (e) => {
        if (!sliderRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
        checkButtons();
    };

    const scroll = (direction) => {
        if (!sliderRef.current) return;
        const firstItem = sliderRef.current.firstElementChild;
        if (!firstItem) return;
        const itemWidth = firstItem.offsetWidth;
        const gap = 15;
        const scrollAmount = itemWidth + gap;
        sliderRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(checkButtons, 500);
    };

    if (top10.length === 0) return null;

    return (
        <section className="top-10-section">
            <h2 className="top-10-title">{title}</h2>

            <div className="top-10-wrapper">
                {showLeftBtn && (
                    <button className="slider-btn prev" onClick={() => scroll('left')} aria-label="Trước">
                        <ChevronLeft size={24} />
                    </button>
                )}

                <div
                    className="top-10-slider"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onScroll={checkButtons}
                >
                    {top10.map((movie, index) => (
                        <div className="top-10-item" key={movie.id || movie.slug || index}>
                            <Link to={`/${movie.slug}`} className="top-10-link">
                                <div className="top-10-poster">
                                    <img
                                        src={`https://img.ophim.live/uploads/movies/${movie.thumb_url || movie.poster_url}`}
                                        alt={movie.name}
                                        loading="lazy"
                                    />
                                    <span className={`top-10-badge ${getBadgeClass(movie)}`}>
                                        {getBadgeText(movie)}
                                    </span>
                                </div>
                                <div className="top-10-info">
                                    <span className={`rank-number rank-${index + 1}`}>{index + 1}</span>
                                    <div className="top-10-text">
                                        <h3 className="top-10-card-title">{movie.name}</h3>
                                        <p className="top-10-original">{movie.origin_name}</p>
                                        <p className="top-10-episode">
                                            {movie.episode_current || (movie.year ? `(${movie.year})` : '')}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                {showRightBtn && (
                    <button className="slider-btn next" onClick={() => scroll('right')} aria-label="Sau">
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </section>
    );
};

export default Top10Section;
