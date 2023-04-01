import React, { useState } from 'react';
import Layout from './../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';


const ForgotPassword = () => {
    const [user, setUser] = useState({
        email: '',
        newPassword: '',
        answer: ''
    })

    const navigate = useNavigate();

    // Handle change function
    const handleChange = (e) => {
        setUser({
            ...user, [e.target.name]: e.target.value
        });
    }

    //Form submit function

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/forgot-password`, user);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            } else {
                toast.error(res.data.message);
                console.log(res.data)
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    return (
        <Layout title={"Forgot password - Ecommerce app"}>
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>
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
                        <input type="text"
                            value={user.answer}
                            name="answer"
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Your favourite sports"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="password"
                            value={user.newPassword}
                            name="newPassword"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="New Password"
                            onChange={handleChange}
                            required />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">Reset</button>
                    </div>
                </form>

            </div>
        </Layout>
    )
}

export default ForgotPassword