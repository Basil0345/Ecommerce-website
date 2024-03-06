import React, { useEffect, useState } from 'react'
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

    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);

    const [auth, setAuth] = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    //validate form
    const validate = (values) => {
        const errors = {};
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!values.email) {
            errors.email = "Email is required";
        } else if (!regex.test(values.email)) {
            errors.email = " This is not a valid email format"
        }
        if (!values.password) {
            errors.password = "Password is required";
        }
        return errors;
    }

    // Handle change function
    const handleChange = (e) => {

        if (e.target.name === 'email') {
            const mailId = e.target.value.toLowerCase();
            setUser({
                ...user, [e.target.name]: mailId
            });
        }
        else {
            setUser({
                ...user, [e.target.name]: e.target.value
            });
        }
    }

    //Form submit function -> validation

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors(validate(user))
        setIsSubmit(true);
    }

    //submit function
    const submit = async () => {
        try {
            const res = await axios.post("/api/v1/auth/login", user);
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
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");

        }
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            submit();
        }
    }, [formErrors])

    return (
        <Layout title={"Login - Ecommerce App"}>
            <div className='form-container' style={{ minHeight: "90vh" }}>
                <form onSubmit={handleSubmit}>
                    <h4 className="title">LOGIN FORM</h4>
                    <div className="form-group mb-3">
                        <input type="text"
                            value={user.email}
                            name="email"
                            className="form-control"
                            id="exampleInputEmail1"
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