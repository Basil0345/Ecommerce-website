import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);

    //initalp details
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);


    //get single product 
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error)
        }
    };

    //get similar products

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <Layout>
            <div className='row container mt-2'>
                <div className='col-md-6'>
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        height="300"
                        width={'350px'}
                    />
                </div>
                <div className='col-md-6'>
                    <h1 className='text-center'>Product Details</h1>
                    <h6>name: {product.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6>Price: {product.price}</h6>
                    <h6>Category: {product?.category?.name}</h6>
                    <button className="btn btn-secondary ms-1 mt-2">ADD TO CART</button>
                </div>
            </div>
            <hr />
            <div className='row container mt-2'>
                <h6>Similar Products</h6>
                {relatedProducts.length < 1 && (<p className='text-center'>No Similar Products found</p>)}
                <div className='d-flex flex-wrap'>
                    {relatedProducts?.map((p) =>

                        <div className="card m-2" style={{ width: '18rem' }} key={p._id} >
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 30)}</p>
                                <p className="card-text">₹{p.price}</p>
                                <button className="btn btn-secondary ms-1">ADD TO CART</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout >
    )
}

export default ProductDetails