import React from 'react'
import Layout from './../components/Layout/Layout';
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const Search = () => {
    const navigate = useNavigate();
    const [values, setValues] = useSearch();
    const [cart, setCart] = useCart();


    //Add to cart
    const addToCart = (c) => {
        let myCart = [...cart];
        const check_index = myCart.findIndex(item => item._id === c._id);
        if (check_index !== -1) {
            myCart[check_index].qty++;
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } else {
            myCart.push({ ...values.results.find(p => p._id === c._id), qty: 1 })
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        }
    }
    return (
        <Layout title={'Search results'}>
            <div className='container'>
                <div className='text-center'>
                    <h1>Search Results</h1>
                    <h6>{values?.results.length < 1 ? "No product found" : `Found ${values?.results.length}`}</h6>
                    <div className='d-flex flex-wrap justify-content-evenly mt-4'>
                        {values?.results.map((p) =>
                            <div className="card m-2" style={{ width: '18rem' }} >
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
        </Layout >
    )
}

export default Search