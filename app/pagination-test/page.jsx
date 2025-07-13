import Pagination from '../../components/pagination';

export default function PaginationTest() {
    return (
        <div className="container mt-5">
            <h1 className="mb-4">Pagination Component Test</h1>
            
            <div className="row">
                <div className="col-md-12">
                    <h3>Page 1 of 5</h3>
                    <Pagination currentPage={1} totalPages={5} />
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3>Page 3 of 5</h3>
                    <Pagination currentPage={3} totalPages={5} />
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-12">
                    <h3>Page 5 of 5</h3>
                    <Pagination currentPage={5} totalPages={5} />
                </div>
            </div>
        </div>
    );
}