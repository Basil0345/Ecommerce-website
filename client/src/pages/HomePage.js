import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import "../styles/HomePage.css";
import { AiOutlineReload } from "react-icons/ai";


function HomePage() {
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    //Filter states
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [hideLoadMore, setHideLoadMore] = useState(false);

    //pagination
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page])

    //load more
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    //get category function
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category")
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
        getTotal();
    }, [])

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data?.products]);
            toast.success(data?.message);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Something went wrong");
        }
    };

    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    //Filter by category

    const handleFilter = async (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setProducts([]);
        setPage(1);
        setChecked(all);
    };



    useEffect(() => {
        if (!checked.length && !radio.length) {
            setProducts([]);
            // setPage(1);
            getAllProducts();
            setHideLoadMore(false);
        }
    }, [checked.length, radio.length])

    useEffect(() => {
        if (checked.length || radio.length) {
            setHideLoadMore(true);
            filterProduct();
        }
    }, [checked, radio])


    //get filters
    const filterProduct = async () => {
        try {
            const { data } = await axios.post("/api/v1/product/product-filter", { checked, radio });
            setProducts(data?.products);

        } catch (error) {
            console.log(error);
        }
    }

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
                myCart.push({ ...products.find(p => p._id === c._id), qty: 1 })
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
                toast.success("Item added to cart");
            }
        }
    }

    return (
        <Layout title={"All Products - Best Offers"}>
            {/* banner image */}
            <img
                src="/images/banner.jpeg"
                className="banner-img"
                alt="bannerimage"
                width={"100%"}
            />
            {/* banner image */}
            <div className='container-fluid row m-0 home-page'>
                <div className='col-md-3 filters'>
                    {/* filter by category */}
                    <h4 className='text-center '>Filter by Category</h4>
                    <div className='d-flex flex-column'>
                        {categories.map((c) => (
                            <Checkbox className='m-0' key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>{c.name}</Checkbox>
                        ))}
                    </div>
                    {/* filter by price */}
                    <h4 className='text-center mt-4'>Filter by Price</h4>
                    <div className='d-flex flex-column'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map((p) => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className='d-flex flex-column'>
                        <button className="btn btn-danger" onClick={() => window.location.reload()} >RESET FILTER</button>
                    </div>
                </div>

                <div className='col-md-9'>
                    <h1 className='text-center p-2'>All Products</h1>
                    <div className='d-flex flex-wrap justify-content-evenly'>
                        {products?.map((p) =>

                            <div className="card m-2" style={{ width: '18rem' }} key={p._id} >
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
                                    <p className="card-text"> {p.description.substring(0, 60)}...</p>
                                    <div className="card-name-price">
                                        <button className="btn btn-info ms-1"
                                            onClick={() => {
                                                navigate(`/product/${p.slug}`)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
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
                            </div>
                        )}
                    </div>
                    <div className='m-2 p-3'>
                        {hideLoadMore ? (<>
                            <h5>Found {products.length} </h5>
                        </>) : (<>
                            {products && products.length < total && (
                                <button className='btn loadmore'
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setPage(page + 1);
                                    }}
                                >
                                    {loading ? "Loading" : <>Loadmore < AiOutlineReload /></>}
                                </button>
                            )}
                        </>)}

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage