const API_BASE = 'https://ophim1.com/v1/api/danh-sach';
const API_FILM = 'https://ophim1.com/v1/api/phim';

/* ----- Tìm kiếm phim ----- */
export const searchFilms = async (keyword, page = 1) => {
    try {
        const response = await fetch(`https://ophim1.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        // Handle 304 Not Modified
        if (response.status === 304) {
            console.log('Search data not modified, using cached version');
            const cacheKey = `search_${keyword}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        
        const data = await response.json();
        
        // Cache the response
        if (data.status === 'success') {
            const cacheKey = `search_${keyword}_page_${page}`;
            localStorage.setItem(cacheKey, JSON.stringify(data.data.items || []));
            return data.data.items || [];
        }
        return [];
    } catch (error) {
        console.error('Error searching films:', error);
        // Fallback to cached data on error
        try {
            const cacheKey = `search_${keyword}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        } catch (cacheError) {
            console.error('Error reading cached search data:', cacheError);
        }
        return [];
    }
};

/* ----- Phim theo thể loại ----- */
export const fetchMoviesByGenre = async (genreSlug, page = 1) => {
    try {
        const response = await fetch(`https://ophim1.com/v1/api/the-loai/${genreSlug}?page=${page}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        // Handle 304 Not Modified
        if (response.status === 304) {
            console.log('Genre data not modified, using cached version');
            const cacheKey = `genre_${genreSlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        
        const data = await response.json();
        
        // Cache the response
        if (data.status === 'success') {
            const cacheKey = `genre_${genreSlug}_page_${page}`;
            localStorage.setItem(cacheKey, JSON.stringify(data.data.items || []));
            return data.data.items || [];
        }
        return [];
    } catch (error) {
        console.error(`Error fetching genre ${genreSlug}:`, error);
        // Fallback to cached data on error
        try {
            const cacheKey = `genre_${genreSlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        } catch (cacheError) {
            console.error('Error reading cached genre data:', cacheError);
        }
        return [];
    }
};

/** Thể loại (tên → slug thường dùng): Hành Động, Phiêu Lưu, Hoạt Hình, Hài, Hình Sự, Tài Liệu, Chính Kịch, Gia Đình, Giả Tưởng, Lịch Sử, Kinh Dị, Nhạc, Bí Ẩn, Lãng Mạn, Khoa Học Viễn Tưởng, Gây Cấn, Chiến Tranh, Tâm Lý, Tình Cảm, Cổ Trang, Miền Tây */
export const GENRE_SLUGS = {
    'hanh-dong': 'Hành Động',
    'phieu-luu': 'Phiêu Lưu',
    'hoat-hinh': 'Hoạt Hình',
    'hai': 'Hài',
    'hinh-su': 'Hình Sự',
    'tai-lieu': 'Tài Liệu',
    'chinh-kich': 'Chính Kịch',
    'gia-dinh': 'Gia Đình',
    'gia-tuong': 'Giả Tưởng',
    'lich-su': 'Lịch Sử',
    'kinh-di': 'Kinh Dị',
    'nhac': 'Nhạc',
    'bi-an': 'Bí Ẩn',
    'lang-man': 'Lãng Mạn',
    'khoa-hoc-vien-tuong': 'Khoa Học Viễn Tưởng',
    'gay-can': 'Gây Cấn',
    'chien-tranh': 'Chiến Tranh',
    'tam-ly': 'Tâm Lý',
    'tinh-cam': 'Tình Cảm',
    'co-trang': 'Cổ Trang',
    'mien-tay': 'Miền Tây',
};

/* ----- Lấy danh sách quốc gia ----- */
export const fetchCountries = async () => {
    try {
        const response = await fetch('https://ophim1.com/v1/api/quoc-gia');
        const data = await response.json();
        if (data.status === 'success') {
            return data.data || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
};

/* ----- Phim theo quốc gia ----- */
export const fetchMoviesByCountry = async (countrySlug, page = 1) => {
    try {
        const response = await fetch(`https://ophim1.com/v1/api/quoc-gia/${countrySlug}?sort_field=modified.time&sort_type=desc&page=${page}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        // Handle 304 Not Modified
        if (response.status === 304) {
            console.log('Country data not modified, using cached version');
            const cacheKey = `country_${countrySlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        
        const data = await response.json();
        
        // Cache response
        if (data.status === 'success') {
            const cacheKey = `country_${countrySlug}_page_${page}`;
            // Filter out trailer movies
            const filteredMovies = (data.data.items || []).filter(movie => {
                // Check if movie has episodes with actual data
                return movie.status !== 'trailer'
            });
            localStorage.setItem(cacheKey, JSON.stringify(filteredMovies));
            return filteredMovies;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching movies for ${countrySlug}:`, error);
        // Fallback to cached data on error
        try {
            const cacheKey = `country_${countrySlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        } catch (cacheError) {
            console.error('Error reading cached country data:', cacheError);
        }
        return [];
    }
};

/** Quốc gia (slug → tên): Âu Mỹ, Anh, Trung Quốc, Indonesia, Việt Nam, Pháp, Hồng Kông, Hàn Quốc, Nhật Bản, Thái Lan, Đài Loan, Nga, Hà Lan, Philippines, Ấn Độ, Quốc gia khác */
export const COUNTRY_SLUGS = {
    'au-my': 'Âu Mỹ',
    'anh': 'Anh',
    'trung-quoc': 'Trung Quốc',
    'indonesia': 'Indonesia',
    'viet-nam': 'Việt Nam',
    'phap': 'Pháp',
    'hong-kong': 'Hồng Kông',
    'han-quoc': 'Hàn Quốc',
    'nhat-ban': 'Nhật Bản',
    'thai-lan': 'Thái Lan',
    'dai-loan': 'Đài Loan',
    'nga': 'Nga',
    'ha-lan': 'Hà Lan',
    'philippines': 'Philippines',
    'an-do': 'Ấn Độ',
    'quoc-gia-khac': 'Quốc gia khác',
};

export const fetchKoreanMovies = (page) => fetchMoviesByCountry('han-quoc', page);
export const fetchChineseMovies = (page) => fetchMoviesByCountry('trung-quoc', page);
export const fetchVietnameseMovies = (page) => fetchMoviesByCountry('viet-nam', page);

/* ----- Thông tin phim & danh sách tập phim ----- */
export const fetchFilmDetail = async (slug) => {
    try {
        console.log('Fetching film detail for slug:', slug);
        const response = await fetch(`${API_FILM}/${slug}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        console.log('API response status:', response.status);
        
        // Handle 304 Not Modified
        if (response.status === 304) {
            console.log('Data not modified, using cached version');
            // Try to get from localStorage or return cached data
            const cachedData = localStorage.getItem(`film_${slug}`);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        
        // Cache response
        if (data.status === 'success') {
            const movieData = data.data?.item || data.item || data.data || data;
            console.log('Extracted movieData:', movieData);
            localStorage.setItem(`film_${slug}`, JSON.stringify(movieData));
            return movieData;
        }
        
        console.error('API returned non-success status:', data);
        return null;
    } catch (error) {
        console.error(`Error fetching film ${slug}:`, error);
        // Fallback to cached data on error
        try {
            const cachedData = localStorage.getItem(`film_${slug}`);
            if (cachedData) {
                console.log('Using cached data as fallback');
                return JSON.parse(cachedData);
            }
        } catch (cacheError) {
            console.error('Error reading cached data:', cacheError);
        }
        return null;
    }
};

/* ----- Phim theo danh mục (TV shows, Phim lẻ, Phim bộ, Phim đang chiếu) ----- */
export const fetchMoviesByCategory = async (categorySlug, page = 1) => {
    try {
        const response = await fetch(`${API_BASE}/${categorySlug}?page=${page}&sort_field=year&sort_type=desc`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        // Handle 304 Not Modified
        if (response.status === 304) {
            console.log('Category data not modified, using cached version');
            const cacheKey = `category_${categorySlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        }
        
        const data = await response.json();
        
        // Cache response
        if (data.status === 'success') {
            const cacheKey = `category_${categorySlug}_page_${page}`;
            localStorage.setItem(cacheKey, JSON.stringify(data.data.items || []));
            return data.data.items || [];
        }
        return [];
    } catch (error) {
        console.error(`Error fetching category ${categorySlug}:`, error);
        // Fallback to cached data on error
        try {
            const cacheKey = `category_${categorySlug}_page_${page}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
        } catch (cacheError) {
            console.error('Error reading cached category data:', cacheError);
        }
        return [];
    }
};

/** Danh mục (slug → tên): phim-moi, phim-bo, phim-le, tv-shows, hoat-hinh, phim-vietsub, phim-thuyet-minh, phim-long-tien, phim-bo-dang-chieu, phim-bo-hoan-thanh, phim-sap-chieu, subteam, phim-chieu-rap */
export const CATEGORY_SLUGS = {
    'phim-moi': 'Phim Mới',
    'phim-bo': 'Phim Bộ',
    'phim-le': 'Phim Lẻ',
    'tv-shows': 'TV Shows',
    'hoat-hinh': 'Hoạt Hình',
    'phim-vietsub': 'Phim Vietsub',
    'phim-thuyet-minh': 'Phim Thuyết Minh',
    'phim-long-tien': 'Phim Lồng Tiếng',
    'phim-bo-dang-chieu': 'Phim Bộ Đang Chiếu',
    'phim-bo-hoan-thanh': 'Phim Bộ Hoàn Thành',
    'phim-sap-chieu': 'Phim Sắp Chiếu',
    'subteam': 'Subteam',
    'phim-chieu-rap': 'Phim Chiếu Rạp',
};

export const fetchPhimDangChieu = (page = 1) => fetchMoviesByCategory('phim-moi', page);
export const fetchPhimChieuRap = (page = 1) => fetchMoviesByCategory('phim-chieu-rap', page);
export const fetchPhimLe = (page = 1) => fetchMoviesByCategory('phim-le', page);
export const fetchPhimBo = (page = 1) => fetchMoviesByCategory('phim-bo', page);
export const fetchHoatHinh = (page = 1) => fetchMoviesByCategory('hoat-hinh', page);
export const fetchTvShows = (page = 1) => fetchMoviesByCategory('tv-shows', page);
export const fetchPhimSapChieu = (page = 1) => fetchMoviesByCategory('phim-sap-chieu', page);
