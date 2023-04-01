import React, { useState } from 'react'
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";
import { useAuth } from '../../context/auth';

const Login = () => {

    const [user, setUser] = useState({
        email: '',
        password: ''
    })

    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
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
            const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/auth/login`, user);
            if (res.data.success) {
                toast.success(res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || '/');
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
        <Layout title={"Login - Ecommerce App"}>
            <div className='form-container '>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">LOGIN FORM</h4>
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
                    <div className='mb-3'>
                        <Link className='forgot-btn' to="/forgot-password">Forgotten Password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary">LOGIN</button>
                </form>

            </div>
        </Layout>
    )
}

export default Login