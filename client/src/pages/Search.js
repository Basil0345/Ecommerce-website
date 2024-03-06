import React, { useEffect } from 'react'
import Layout from './../components/Layout/Layout';
import { useSearch } from '../context/search';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';
import "../styles/CategoryProductStyle.css"
import axios from 'axios';

const Search = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [values, setValues] = useSearch();
    const [cart, setCart] = useCart();

    //Search product based on keywords 
    const searchKeyword = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/search/${params?.keyword}`);
            setValues({ ...values, results: data });
        } catch (error) {
            setValues({
                ...values,
                keyword: "",
                results: [],
            });
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
            myCart.push({ ...values.results.find(p => p._id === c._id), qty: 1 })
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
            toast.success("Item added to cart");
        }
    }

    useEffect(() => {
        if (params?.keyword) {
            searchKeyword()
        }
    }, [params])

    return (
        <Layout title={'Search results'}>
            <div className='container'>
                <div className='text-center category'>
                    <h1>Search Results</h1>
                    <h6>{values?.results.length < 1 ? "No product found" : `Found ${values?.results.length}`}</h6>
                    <div className='d-flex flex-wrap justify-content-evenly'>
                        {values?.results?.map((p) =>

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
                                            window.scrollTo({ top: 0, behavior: "smooth" })
                                        }}
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

export default Search