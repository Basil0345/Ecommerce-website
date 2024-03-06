import React, { useState, useEffect } from 'react'
import Layout from './../../components/Layout/Layout';
import AdminMenu from './../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
const Users = () => {
    const [users, setUsers] = useState([]);
    const [auth, setAuth] = useAuth();

    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/all-users");
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getUsers();
        }
    }, [auth?.token])
    return (
        <Layout title={"Dashboard - All Users"}>
            <div className='container-fluid p-3 ' style={{ minHeight: "92vh" }}>
                <div className='row'>
                    <div className='col-md-3' >
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center pt-3">All Users</h1>
                        <div className="border shadow mt-3">
                            <div className='table-responsive'>
                                <table className="table">
                                    <thead className='bg-secondary'>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">email</th>
                                            <th scope="col">phone</th>
                                            <th scope="col">address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users?.map((u, i) => {
                                            return (
                                                <tr key={u._id}>
                                                    <th scope="row">{i + 1}</th>
                                                    <td>{u?.name}</td>
                                                    <td>{u?.email}</td>
                                                    <td>{u?.phone}</td>
                                                    <td>{u?.address}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Users