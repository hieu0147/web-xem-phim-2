import React from 'react';
import { ChevronRight } from 'lucide-react';
import './CategoryRow.css';

const CATEGORIES = [
    { id: 1, title: 'Marvel', color: 'linear-gradient(135deg, #4b3fe3 0%, #2e26a6 100%)' },
    { id: 2, title: 'Sitcom', color: 'linear-gradient(135deg, #2a9d75 0%, #1a6b4d 100%)' },
    { id: 3, title: 'Lồng Tiếng Cực Mạnh', color: 'linear-gradient(135deg, #8a4bce 0%, #5f3291 100%)' },
    { id: 4, title: 'Xuyên Không', color: 'linear-gradient(135deg, #e38e4b 0%, #a6622e 100%)' },
    { id: 5, title: 'Cổ Trang', color: 'linear-gradient(135deg, #c7453f 0%, #8f2e2a 100%)' },
    { id: 7, title: '4k', color: 'linear-gradient(135deg, #6c708c 0%, #464a63 100%)' },
    { id: 6, title: '+1 chủ đề', color: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)' },
];

const CategoryRow = () => {
    return (
        <div className="category-section">
            <h2 className="cat-header-title">Bạn đang quan tâm gì?</h2>
            <div className="category-grid">
                {CATEGORIES.map(cat => (
                    <div key={cat.id} className="cat-card" style={{ background: cat.color }}>
                        <h3 className="cat-title">{cat.title}</h3>
                        <div className="cat-link">
                            Xem chủ đề <ChevronRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryRow;
