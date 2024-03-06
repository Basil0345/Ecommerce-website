import React from 'react';
import { useSearch } from '../../context/search';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    return (
        <div className='m-2'>
            <div className="d-flex" role="search">
                <input className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={values.keyword}
                    onChange={(e) => setValues({ ...values, keyword: e.target.value })}
                />
                <button className="btn btn-outline-success" onClick={() => {
                    if (values?.keyword) {
                        navigate(`/search/${values.keyword}`);
                    }
                }}
                >Search</button>
            </div>
        </div>
    )
}

export default SearchInput