import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    //Filter states
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);

    //get category function
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`)
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory();
    }, [])

    //get all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product`);
            setProducts(data?.products);
            toast.success(data?.message);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    //Filter by category

    const handleFilter = async (value, id) => {
        let all = [...checked]
        if (value) {
            all.push(id);
        } else {
            all = all.filter((c) => c !== id);
        }
        setChecked(all);
        console.log(all);
    };



    useEffect(() => {
        if (!checked.length || !radio.length) filterProduct();
    }, [checked, radio])

    useEffect(() => {
        if (checked.length || radio.length) filterProduct();
    }, [checked, radio])


    //get filters
    const filterProduct = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filter`, { checked, radio });
            setProducts(data?.products);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout title={"All prdoducts - Best Offers"}>
            <div className='row m-0 mt-3'>
                <div className='col-md-2 border-right'>
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

                <div className='col-md-10'>
                    <h1 className='text-center p-3'>All Products</h1>
                    <div className='d-flex flex-wrap justify-content-evenly'>
                        {products?.map((p) =>

                            <div className="card m-2" style={{ width: '18rem' }} >
                                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name}</h5>
                                    <p className="card-text">{p.description.substring(0, 30)}</p>
                                    <p className="card-text">₹{p.price}</p>
                                    <button className="btn btn-primary ms-1">More Details</button>
                                    <button className="btn btn-secondary ms-1">ADD TO CART</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage