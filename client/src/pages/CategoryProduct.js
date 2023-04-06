import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const CategoryProduct = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [cart, setCart] = useCart();

    useEffect(() => {
        if (params?.slug) getProductsByCategory()
    }, [params?.slug])

    const getProductsByCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    };

    //Add to cart
    const addToCart = (c) => {
        let myCart = [...cart];
        const check_index = myCart.findIndex(item => item._id === c._id);
        if (check_index !== -1) {
            myCart[check_index].qty++;
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } else {
            myCart.push({ ...products.find(p => p._id === c._id), qty: 1 })
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        }
    }

    return (
        <Layout>
            <div className='container mt-3'>
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>{products.length} result found</h6>
                <div className='row'>
                    <div className='d-flex flex-wrap justify-content-evenly'>
                        {products?.map((p) =>

                            <div className="card m-2" style={{ width: '18rem' }} key={p._id} >
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <p className="card-text">₹{p.price}</p>
                                    <button className="btn btn-primary ms-1"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        More Details
                                    </button>
                                    <button className="btn btn-secondary ms-1"
                                        onClick={() => {
                                            addToCart(p);
                                            toast.success("Item added to cart");
                                        }}
                                    >ADD TO CART</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct