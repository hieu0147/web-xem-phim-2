import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MovieCard from '../movies/MovieCard';
import './MovieSlider.css';

const MovieSlider = ({ movies }) => {
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);

    const checkButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setShowLeftBtn(scrollLeft > 0);
            setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkButtons();
        window.addEventListener('resize', checkButtons);
        return () => window.removeEventListener('resize', checkButtons);
    }, [movies]);

    const handleMouseDown = (e) => {
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
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        sliderRef.current.scrollLeft = scrollLeft - walk;
        checkButtons();
    };

    const scroll = (direction) => {
        if (sliderRef.current) {
            const firstItem = sliderRef.current.firstElementChild;
            if (!firstItem) return;

            const itemWidth = firstItem.offsetWidth;
            const gap = 15; // From CSS
            const scrollAmount = itemWidth + gap;

            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkButtons, 500);
        }
    };

    return (
        <div className="slider-wrapper">
            {showLeftBtn && (
                <button className="slider-btn prev" onClick={() => scroll('left')}>
                    <ChevronLeft size={24} />
                </button>
            )}

            <div
                className="movie-slider"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onScroll={checkButtons}
            >
                {movies.map(movie => (
                    <div className="slider-item" key={movie.id || movie.slug}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>

            {showRightBtn && (
                <button className="slider-btn next" onClick={() => scroll('right')}>
                    <ChevronRight size={24} />
                </button>
            )}
        </div>
    );
};

export default MovieSlider;
