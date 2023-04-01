import React, { useState } from 'react'
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";


const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        answer: ''
    })

    const navigate = useNavigate();
    // Handle change function
    const handleChange = (e) => {
        setUser({
            ...user, [e.target.name]: e.target.value
        });
    }
    // Form submit function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/register`, user);
            if (res.data.success) {
                toast.success(res.data.message)
                navigate('/login');
            } else {
                toast.error(res.data.message);
                console.log(res.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
        // console.log(user);
        // toast.success("Register Successfully");
        // setUser({
        //     name: '',
        //     email: '',
        //     password: '',
        //     phone: '',
        //     address: ''
        // })
    }

    return (
        <Layout title={"Register - Ecommerce App"}>
            <div className='form-container '>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">REGISTER FORM</h4>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            value={user.name}
                            name='name'
                            className="form-control"
                            // id="exampleInputEmail1"
                            placeholder="Enter Name"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="email"
                            value={user.email}
                            name="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter email"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="password"
                            value={user.password}
                            name="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.phone}
                            name="phone"
                            className="form-control"
                            // id="exampleInputEmail1"
                            placeholder="Enter Phone"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.address}
                            name="address"
                            className="form-control"
                            // id="exampleInputEmail1"
                            placeholder="Enter Address"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.answer}
                            name="answer"
                            className="form-control"
                            // id="exampleInputEmail1"
                            placeholder="What is Your Favourite sports"
                            onChange={handleChange}
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>

            </div>
        </Layout>
    )
}

export default Register