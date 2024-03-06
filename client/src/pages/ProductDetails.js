import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/cart';


const ProductDetails = () => {
    const params = useParams();
    const [product, setProduct] = useState([]);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cart, setCart] = useCart();
    const navigate = useNavigate();


    //initalp details
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);


    //get single product 
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error)
        }
    };

    //get similar products

    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        }
    };

    //Add to cart
    const addToCart = (c) => {
        let myCart = [...cart];
        const check_index = myCart.findIndex(item => item._id === c._id);
        if (check_index !== -1) {
            if (myCart[check_index].qty < c.quantity) {
                myCart[check_index].qty++;
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
                toast.success("Item added to cart");
            } else {
                toast.error("max out");
            }
        } else {
            if (c.quantity === 0) {
                toast.error("max out")
            } else {
                myCart.push({ ...product, qty: 1 })
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
                toast.success("Item added to cart");
            }
        }
    }

    return (
        <Layout>
            <div className='row container mt-2 mx-auto'>
                <div className='col-md-6'>
                    <img src={`/api/v1/product/product-photo/${product._id}`}
                        className="object-fit-contain"
                        alt={product.name}
                        width={'300px'}
                    />
                </div>
                <div className='col-md-6 mt-4'>
                    <h3 className='text-center'>Product Details</h3>
                    <h6>Name: {product.name}</h6>
                    <h6>Description: {product.description}</h6>
                    <h6>{product.quantity === 0 ? (<p className='text-danger'>Out Of Stock</p>) : (<>Price: ₹{product.price}</>)}</h6>
                    <h6>Category: {product?.category?.name}</h6>
                    {product.quantity === 0 ? "" : (<button className="btn btn-dark ms-1 mt-2"
                        onClick={() => {
                            addToCart(product);
                        }}
                    >ADD TO CART</button>)}
                </div>
            </div>
            <hr />
            <div className='row container mt-2 mb-2'>
                <h4>Similar Products ➡️</h4>
                {relatedProducts.length < 1 && (<p className='text-center'>No Similar Products found</p>)}
                <div className='d-flex flex-wrap'>
                    {relatedProducts?.map((p) =>

                        <div className="card m-2" style={{ width: '18rem' }} key={p._id} >
                            <img
                                src={`/api/v1/product/product-photo/${p._id}`}
                                className="card-img-top mx-auto"
                                alt={p.name}
                                style={{ width: '200px' }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 30)}</p>
                                {p.quantity === 0 ? (
                                    <p className="card-text text-danger">Out Of Stock</p>
                                ) : (
                                    <p className="card-text">₹{p.price}</p>
                                )}
                                <button
                                    className="btn btn-info mt-2"
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        navigate(`/product/${p.slug}`)
                                    }}
                                >
                                    More Details
                                </button>
                            </div>
                        </div>

                    )}
                </div>
            </div>
        </Layout >
    )
}

export default ProductDetails