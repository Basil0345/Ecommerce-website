import React, { useState, useEffect } from 'react'
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import "../../styles/AuthStyles.css";
import { useOtpAuth } from '../../context/otpAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    })

    const [otpAuth, setOtpAuth] = useOtpAuth();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle change function
    const handleChange = (e) => {
        const regPhone = /^[0-9\b\+]+$/;
        const regName = /^[A-Za-z][ A-Za-z]*$/
        if (e.target.name === 'name') {
            if (e.target.value === '' || regName.test(e.target.value)) {
                setUser({
                    ...user, [e.target.name]: e.target.value
                });
            }
        }
        else if (e.target.name === 'email') {
            const mailId = e.target.value.toLowerCase();
            setUser({
                ...user, [e.target.name]: mailId
            });
        }
        else if (e.target.name === 'phone') {
            if (e.target.value === '' || regPhone.test(e.target.value)) {
                setUser({
                    ...user, [e.target.name]: e.target.value
                });
            }
        }
        else {
            setUser({
                ...user, [e.target.name]: e.target.value
            });
        }
    }

    //validate form
    const validate = (values) => {
        const errors = {};
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

        if (!values.name) {
            errors.name = "Name is required";
        }
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
            errors.email = " This is not a valid email format"
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        if (!values.phone) {
            errors.phone = "Phone is required";
        } else if (!phoneRegex.test(values.phone)) {
            errors.phone = " This is not a valid phone format"
        }
        if (!values.address) {
            errors.address = "Address is required";
        }
        return errors;
    }

    // Form submit function -> validation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(user))
        setIsSubmit(true);
    }

    //submit function
    const submit = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/v1/auth/sendOtp/${user.email}`, user);
            if (res.data.success) {
                console.log(res.data)
                toast.success(res.data.message);
                setOtpAuth({
                    ...otpAuth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem("otpAuth", JSON.stringify(res.data));
                navigate("/verification/otp")
            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            submit();
        }
    }, [formErrors])

    return (
        <Layout title={"Register - Ecommerce App"}>
            <div className='form-container' style={{ minHeight: "90vh" }} >
                <form onSubmit={handleSubmit} className='mt-2 mb-2' >
                    <h4 className="title">REGISTER FORM</h4>
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            value={user.name}
                            name='name'
                            className="form-control"
                            placeholder="Enter Name"
                            onChange={handleChange}
                        />
                        <p className='text-danger'>{formErrors.name}</p>

                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.email}
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={handleChange}
                        />
                        <p className='text-danger'>{formErrors.email}</p>
                    </div>
                    <div className="form-group mb-3">
                        <input type="password"
                            value={user.password}
                            name="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                            onChange={handleChange}
                        />
                        <p className='text-danger'>{formErrors.password}</p>
                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.phone}
                            name="phone"
                            className="form-control"
                            placeholder="Enter Phone"
                            onChange={handleChange}
                        />
                        <p className='text-danger'>{formErrors.phone}</p>
                    </div>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.address}
                            name="address"
                            className="form-control"
                            placeholder="Enter Address"
                            onChange={handleChange}
                        />
                        <p className='text-danger'>{formErrors.address}</p>
                    </div>
                    <button type="submit" className="btn btn-primary">{loading ? "Loading..." : "Register"}</button>
                </form>

            </div>


        </Layout >
    )
}

export default Register