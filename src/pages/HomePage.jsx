import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/movies/HeroSection';
import CategoryRow from '../components/movies/CategoryRow';
import Top10Section from '../components/movies/Top10Section';
import MovieSlider from '../components/common/MovieSlider';
import { ChevronRight } from 'lucide-react';
import { 
    fetchKoreanMovies, 
    fetchChineseMovies, 
    fetchVietnameseMovies, 
    fetchPhimBo, 
    fetchPhimLe, 
    fetchTvShows, 
    fetchPhimChieuRap, 
    fetchPhimSapChieu,
    fetchHoatHinh
} from '../services/api';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [koreanMovies, setKoreanMovies] = useState([]);
    const [chineseMovies, setChineseMovies] = useState([]);
    const [vietnameseMovies, setVietnameseMovies] = useState([]);
    const [phimBo, setPhimBo] = useState([]);
    const [phimLe, setPhimLe] = useState([]);
    const [tvShows, setTvShows] = useState([]);
    const [phimChieuRap, setPhimChieuRap] = useState([]);
    const [phimSapChieu, setPhimSapChieu] = useState([]);
    const [hoatHinh, setHoatHinh] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const [kr, cn, us, pb, pl, ts, pc, ps, hh] = await Promise.all([
                fetchKoreanMovies(1),
                fetchChineseMovies(1),
                fetchVietnameseMovies(1),
                fetchPhimBo(1),
                fetchPhimLe(1),
                fetchTvShows(1),
                fetchPhimChieuRap(1),
                fetchPhimSapChieu(1),
                fetchHoatHinh(1),
            ]);
            setKoreanMovies(kr);
            setChineseMovies(cn);
            setVietnameseMovies(us);
            setPhimBo(pb);
            setPhimLe(pl);
            setTvShows(ts);
            setPhimChieuRap(pc);
            setPhimSapChieu(ps);
            setHoatHinh(hh);
        };
        loadData();
    }, []);

    return (
        <div id="wrapper" className="home-page">
            <HeroSection />

            <div className="fluid-gap">
                <CategoryRow />
                <div className="container">
                    {/* Section: Phim Hàn Quốc */}
                    {koreanMovies.length > 0 && (
                        <section className="movie-section horizontal">
                            <div className="section-header-side">
                                <div className="header-titles">
                                    <h2 className="text-highlight">Phim Hàn Quốc mới</h2>
                                    <a 
                                        className="view-more-link" 
                                        href="/xem-toan-bo/phim-han-quoc"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/xem-toan-bo/phim-han-quoc');
                                        }}
                                    >
                                        <span>Xem toàn bộ</span>
                                        <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                            <div className="slider-container-flex">
                                <MovieSlider movies={koreanMovies} />
                            </div>
                        </section>
                    )}

                    {/* Section: Phim Trung Quốc */}
                    {chineseMovies.length > 0 && (
                        <section className="movie-section horizontal">
                            <div className="section-header-side">
                                <div className="header-titles">
                                    <h2 className="text-highlight-yellow">Phim Trung Quốc mới</h2>
                                    <a 
                                        className="view-more-link" 
                                        href="/xem-toan-bo/phim-trung-quoc"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/xem-toan-bo/phim-trung-quoc');
                                        }}
                                    >
                                        <span>Xem toàn bộ</span>
                                        <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                            <div className="slider-container-flex">
                                <MovieSlider movies={chineseMovies} />
                            </div>
                        </section>
                    )}

                    {/* Section: Phim Việt Nam */}
                    {vietnameseMovies.length > 0 && (
                        <section className="movie-section horizontal">
                            <div className="section-header-side">
                                <div className="header-titles">
                                    <h2 className="text-highlight-pink">Phim Việt Nam Mới</h2>
                                    <a
                                        className="view-more-link" 
                                        href="/xem-toan-bo/phim-viet-nam"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            navigate('/xem-toan-bo/phim-viet-nam');
                                        }}
                                    >
                                        <span>Xem toàn bộ</span>
                                        <ChevronRight size={14} />
                                    </a>
                                </div>
                            </div>
                            <div className="slider-container-flex">
                                <MovieSlider movies={vietnameseMovies} />
                            </div>
                        </section>
                    )}
                </div>
                <Top10Section movies={phimChieuRap} title="Top 10 phim chiếu rạp hôm nay" viewMoreUrl="/xem-toan-bo/phim-chieu-rap" />
                <Top10Section movies={phimSapChieu} title="Top 10 phim sắp chiếu" viewMoreUrl="/xem-toan-bo/phim-sap-chieu" />
                <Top10Section movies={phimBo} title="Top 10 phim bộ hôm nay" viewMoreUrl="/xem-toan-bo/phim-bo" />
                <Top10Section movies={phimLe} title="Top 10 phim lẻ hôm nay" viewMoreUrl="/xem-toan-bo/phim-le" />
                <Top10Section movies={hoatHinh} title="Top 10 hoạt hình hôm nay" viewMoreUrl="/xem-toan-bo/hoat-hinh" />
                <Top10Section movies={tvShows} title="Top 10 TV shows hôm nay" viewMoreUrl="/xem-toan-bo/tv-shows" />
            </div>
        </div>
    );
};

export default HomePage;
