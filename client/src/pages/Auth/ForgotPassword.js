import React, { useState } from 'react';
import Layout from './../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useOtpAuth } from '../../context/otpAuth';


const ForgotPassword = () => {
    const [user, setUser] = useState({
        email: '',
        newPassword: '',
    })

    const [otpAuth, setOtpAuth] = useOtpAuth();
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            const res = await axios.post(`/api/v1/auth/forgot-password/${user.email}`, user);
            if (res.data.success) {
                toast.success(res.data.message);
                setOtpAuth({
                    ...otpAuth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("otpAuth", JSON.stringify(res.data));
                navigate("/verification/reset-otp")
                console.log(res.data);
            } else {
                toast.error(res.data.message);
                console.log(res.data)
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            setLoading(false);
        }
    }
    return (
        <Layout title={"Forgot password - Ecommerce app"}>
            <div className='form-container' style={{ minHeight: "90vh" }}>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">RESET PASSWORD</h4>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.email}
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={handleChange}
                            required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="password"
                            value={user.newPassword}
                            name="newPassword"
                            className="form-control"
                            placeholder="New Password"
                            onChange={handleChange}
                            required />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">{loading ? "Loading" : "Reset"}</button>
                    </div>
                </form>

            </div>
        </Layout>
    )
}

export default ForgotPassword