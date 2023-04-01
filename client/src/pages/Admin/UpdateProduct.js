import React, { useEffect, useState } from 'react'
import Layout from './../../components/Layout/Layout';
import AdminMenu from './../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
const { Option } = Select;

const UpdateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();
    const params = useParams();

    //get single product function

    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`);
            setId(data.product._id);
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setCategory(data.product.category._id)


        } catch (error) {
            console.log(error);
            toast.error("Something went wrong ");
        }
    };

    useEffect(() => {
        getSingleProduct();
        //eslint-disable-next-line
    }, [])

    //get all categories function
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`)
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    //Update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            const { data } = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
                productData
            );
            if (data?.success) {
                toast.success(data?.message);
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    };

    //Delete product 

    const handleDelete = async () => {
        try {
            let answer = window.prompt("Are you sure you want delete this product ?");
            if (!answer) return
            const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/product/delete-product/${id}`);
            if (data?.success) {
                toast.success(data.message);
                navigate("/dashboard/admin/products");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    };

    useEffect(() => {
        getAllCategory();
    }, [photo])

    return (
        <Layout title={"Dashboard - Update Product"}>
            <div className='container-fluid p-3 '>
                <div className='row'>
                    <div className='col-md-3' >
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3>Update Product</h3>

                        {/* Selector  */}

                        <div className='m-1 w-75'>
                            <Select
                                bordered={false}
                                placeholder="Select a category"
                                size="large"
                                showSearch
                                className="form-select mb-3"
                                onChange={(value) => {
                                    setCategory(value);
                                }}
                                value={category}
                            >
                                {categories?.map((c) => (
                                    <Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Option>
                                ))}
                            </Select>

                            {/* Image upload section */}
                            <div className='mb-3'>
                                <label className='btn btn-outline-secondary col-md-12'>
                                    {photo ? photo.name : "Upload Image"}
                                    <input
                                        type="file"
                                        name='photo'
                                        accept='image/*'  //to restrict other files
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden //to hide input field inside label
                                    />
                                </label>
                            </div>

                            {/* Image preview section */}
                            <div className='mb-3'>
                                {photo ? (
                                    <div className='text-center'>
                                        <img src={URL.createObjectURL(photo)} alt="" height={'200px'} className="img img-responsive" />
                                    </div>
                                ) : (
                                    <div className='text-center'>
                                        <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`} alt="" height={'200px'} className="img img-responsive" />
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <input type='text'
                                    value={name}
                                    placeholder="Write a name"
                                    className='form-control'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <textarea type='text'
                                    value={description}
                                    placeholder="Write a description"
                                    className='form-control'
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <input type='number'
                                    value={price}
                                    placeholder="Write a price"
                                    className='form-control'
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <input type='number'
                                    value={quantity}
                                    placeholder="Write a quantity"
                                    className='form-control'
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <Select bordered={false}
                                    placeholder="Select Shipping"
                                    size='large'
                                    showSearch className='form-select mb-3'
                                    onChange={(value) => {
                                        setShipping(value);
                                    }}
                                    value={shipping ? "Yes" : "No"}
                                >

                                    <Option value="0">No</Option>
                                    <Option value="1">Yes</Option>
                                </Select>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
                            </div>
                            <div className='mb-3'>
                                <button className='btn btn-danger' onClick={handleDelete}>DELETE PRODUCT</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default UpdateProduct