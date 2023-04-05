import React, { useState, useEffect } from 'react'
import Layout from './../../components/Layout/Layout';
import UserMenu from './../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {

    //context
    const [auth, setAuth] = useAuth();

    //States
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
    })

    // Handle change function
    const handleChange = (e) => {
        setUser({
            ...user, [e.target.name]: e.target.value
        });
    };

    // Form submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/profile`, user);
            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data?.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        const { name, email, password, phone, address } = auth?.user;
        setUser({
            name,
            email,
            phone,
            address
        })
    }, [auth?.user])

    return (
        <Layout title={"Your Profile"}>
            <div className='container-fluid p-3 '>
                <div className='row'>
                    <div className='col-md-3' >
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <div>
                            <div className='form-container '>
                                <form onSubmit={handleSubmit}>
                                    <h4 className="title">USER PROFILE</h4>
                                    <div className="form-group mb-3">
                                        <input
                                            type="text"
                                            value={user.name}
                                            name='name'
                                            className="form-control"
                                            // id="exampleInputEmail1"
                                            placeholder="Enter Name"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="email"
                                            value={user.email}
                                            name="email"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            placeholder="Enter email"
                                            onChange={handleChange}
                                            disabled
                                        />
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
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="text"
                                            value={user.phone}
                                            name="phone"
                                            className="form-control"
                                            // id="exampleInputEmail1"
                                            placeholder="Enter Phone"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group mb-3">
                                        <input type="text"
                                            value={user.address}
                                            name="address"
                                            className="form-control"
                                            // id="exampleInputEmail1"
                                            placeholder="Enter Address"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">UPDATE</button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile