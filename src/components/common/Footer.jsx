import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="footer-elements">
                    <div className="footer-icon">
                        {/* Using a placeholder or failing gracefully if image missing */}
                        <img src="https://gogophim.com/images/footer-icon.svg" alt="footer" width="500" height="700" onError={(e) => e.target.style.display = 'none'} />
                    </div>

                    <div className="side-left">
                        <div className="true-msg">
                            <div className="line-center">
                                <div className="inc-icon icon-20">
                                    <img src="https://gogophim.com/images/vn_flag.svg" alt="Vietnam" width="30" height="30" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <span>Hoàng Sa & Trường Sa là của Việt Nam!</span>
                            </div>
                        </div>

                        <div className="sl-brand line-center">
                            <a className="footer-logo" href="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '35px' }}>
                                <span style={{ color: 'yellow' }}>Thùng</span>
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
                            ThùngPhim - Trang xem phim online chất lượng cao miễn phí Vietsub, thuyết minh, lồng tiếng full HD.
                            Kho phim mới khổng lồ, phim chiếu rạp, phim bộ, phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản, Âu Mỹ… đa dạng thể loại.
                        </div>

                        <div className="sl-copyright">
                            © 2025 ThùngPhim
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
