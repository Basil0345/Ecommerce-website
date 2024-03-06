import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";
import Layout from '../../components/Layout/Layout';
import { useOtpAuth } from '../../context/otpAuth';

const OtpVerification = ({ userDetails, updateParentState }) => {

    const navigate = useNavigate();
    const [value, setValue] = useState({
        code: ''
    })

    const [otpAuth, setOtpAuth] = useOtpAuth();

    // handle submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/v1/auth/verifyotp/${value.code}`, otpAuth.user);
            if (res.data.success) {
                toast.success(res.data.message);
                localStorage.removeItem('otpAuth');
                setOtpAuth([]);
                navigate('/login');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // resend otp
    const resendOtp = async () => {
        try {
            const res = await axios.post(`/api/v1/auth/sendOtp/${otpAuth.user.email}`, otpAuth.user);
            if (res.data.success) {
                console.log(res.data)
                toast.success(res.data.message);
                setOtpAuth({
                    ...otpAuth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("otpAuth", JSON.stringify(res.data));
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //handle change
    const handleChange = (e) => {
        const reg = /^[0-9\b]+$/;
        if (e.target.value === "" || reg.test(e.target.value)) {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    };

    return (
        <Layout title={"Register - Ecommerce App"}>
            <div className='form-container' style={{ minHeight: "91vh" }}>
                <form className='m-4' onSubmit={handleSubmit}>
                    <h4 className="title">Enter the code from your email</h4>
                    <p>Let us know that this email address belongs to you.<br /> Enter the code from the email sent to {otpAuth.user.email} </p>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={value.code}
                            name="code"
                            className="form-control"
                            placeholder="Enter code"
                            onChange={handleChange}
                            maxLength={4}
                            required
                        />
                    </div>
                    <div className='mb-3'>
                        <Link className='forgot-btn' onClick={resendOtp}>Resend OTP?</Link>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>

                </form>

            </div>
        </Layout>
    )
}

export default OtpVerification