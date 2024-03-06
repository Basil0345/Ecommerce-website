import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import "../styles/CategoryProductStyle.css"


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
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`);
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
            if (myCart[check_index].qty < c.quantity) {
                myCart[check_index].qty++;
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
                toast.success("Item added to cart");
            } else {
                toast.error("max out");
            }
        } else {
            myCart.push({ ...products.find(p => p._id === c._id), qty: 1 })
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
            toast.success("Item added to cart");
        }
    }

    return (
        <Layout>
            <div className='container mt-3 category'>
                <h4 className='text-center'>Category - {category?.name}</h4>
                <h6 className='text-center'>{products.length} result found</h6>
                <div className='row'>
                    <div className='d-flex flex-wrap justify-content-evenly'>
                        {products?.map((p) =>

                            <div className="card mt-1 mb-3" key={p._id} >
                                <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <div className="card-name-price">
                                        <h5 className="card-title">{p.name}</h5>
                                        <h5 className="card-title card-price">
                                            {p.quantity === 0 ? (<p className='text-danger'>Out Of Stock</p>) : p.price.toLocaleString("en-IN", {
                                                style: "currency",
                                                currency: "INR",
                                            })}
                                        </h5>
                                    </div>
                                    <p className="card-text">{p.description.substring(0, 60)}...</p>
                                    <button className="btn btn-info ms-1 mb-2"
                                        onClick={() => {
                                            navigate(`/product/${p.slug}`)
                                            window.scrollTo({ top: 0, behaviour: "smooth" })
                                        }
                                        }
                                    >
                                        More Details
                                    </button>
                                    {p.quantity === 0 ? "" : (<button className="btn btn-dark ms-1"
                                        onClick={() => {
                                            addToCart(p);
                                        }}
                                    >ADD TO CART</button>)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default CategoryProduct