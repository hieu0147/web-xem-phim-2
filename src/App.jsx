import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BackToTop from './components/common/BackToTop';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AllMoviesPage from './pages/AllMoviesPage';
import WatchMoviePage from './pages/WatchMoviePage';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <main style={{ minHeight: '80vh', paddingTop: '0' }}>
                    {/* Padding top 0 because Hero is full screen, usually handle spacing in pages or components */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tim-kiem" element={<SearchPage />} />
                        <Route path="/xem-toan-bo/:type" element={<AllMoviesPage />} />
                        <Route path="/xem-toan-bo/:type/:slug" element={<AllMoviesPage />} />
                        <Route path="/:movieSlug" element={<WatchMoviePage />} />
                    </Routes>
                </main>
                <Footer />
                <BackToTop />
            </div>
        </Router>
    );
}

export default App;
