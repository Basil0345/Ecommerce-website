import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import useCategory from '../hooks/useCategory';


const Categories = () => {
    const categories = useCategory();
    return (
        <Layout title={"All Categories"}>
            <div className='container mx-auto d-flex justify-content-center ' style={{ height: '100vh', marginTop: '100px' }}>
                <div className='row mx-auto'>
                    {categories?.map((c) => (
                        <div className='col-md-4 mt-5 mb-3 gx-4 gy-4' key={c._id} >
                            <Link to={`/category/${c.slug}`} onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                                className='btn cat-btn d-flex justify-content-center'>{c.name}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}


export default Categories