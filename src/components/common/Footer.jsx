import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-elements">
                    <div className="side-left">
                        <div className="true-msg">
                            <div className="line-center">
                                <span>Hoàng Sa & Trường Sa là của Việt Nam!</span>
                            </div>
                        </div>

                        <div className="sl-brand line-center">
                            <a className="footer-logo" href="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '35px' }}>
                                <span style={{ color: 'yellow' }}>Thau</span>
                                <span style={{ color: 'white' }}>Phim</span>
                            </a>
                        </div>

                        <div className="sl-menu mb-3">
                            <p>Hỏi Đáp</p>
                            <p>Chính sách bảo mật</p>
                            <p>Điều khoản sử dụng</p>
                            <p>Giới thiệu</p>
                            <p>Liên hệ</p>
                        </div>

                        <div className="sl-notice mb-2">
                            ThauPhim - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD.
                            Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
                        </div>

                        <div className="sl-copyright">
                            © 2025 ThauPhim
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
