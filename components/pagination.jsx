import Link from 'next/link';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, baseUrl = '/' }) => {
    const pages = [];
    
    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    
    return (
        <nav aria-label="Article pagination" className="d-flex justify-content-center">
            <ul className="pagination">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Link 
                        href={currentPage === 1 ? '#' : `${baseUrl}?page=${currentPage - 1}`}
                        className="page-link"
                        aria-label="Previous"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </Link>
                </li>
                
                {/* Page numbers */}
                {pages.map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                        <Link 
                            href={`${baseUrl}?page=${page}`}
                            className="page-link"
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </Link>
                    </li>
                ))}
                
                {/* Next button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Link 
                        href={currentPage === totalPages ? '#' : `${baseUrl}?page=${currentPage + 1}`}
                        className="page-link"
                        aria-label="Next"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    baseUrl: PropTypes.string,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};

export default Pagination;