import React from 'react';
import '../App.css';

export default function Pagination({ page, totalPages, onChange }) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="pagination">
            <button
                className="btn"
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
            >
                Prev
            </button>
            {pages.map(p => (
                <button
                    key={p}
                    className={`btn ${p === page ? 'active' : ''}`}
                    onClick={() => onChange(p)}
                >
                    {p}
                </button>
            ))}
            <button
                className="btn"
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
