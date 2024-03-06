import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from './../../components/Layout/Layout';
import AdminMenu from './../../components/Layout/AdminMenu';
import moment from 'moment';
import { useAuth } from '../../context/auth';
import { Select } from 'antd';
const { Option } = Select;


const AdminOrders = () => {
    const [status, setStatus] = useState(["Not Process", "Processing", "Shipped", "delivered", "cancel"]);

    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/all-orders");
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`,
                { status: value });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout title={"Dashboard - All Orders"}>
            <div className='container-fluid p-3 ' style={{ minHeight: "90vh" }}>
                <div className='row'>
                    <div className='col-md-3' >
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h3>Orders</h3>
                        {orders?.map((o, i) => {
                            return (
                                <div className="border shadow mt-3 table-responsive" key={o._id}>
                                    <table className="table">
                                        <thead className='bg-secondary'>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Buyer</th>
                                                <th scope="col"> date</th>
                                                <th scope="col">Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td className='p-0'>
                                                    <Select bordered={false} onChange={(value) => handleChange(o._id, value)} defaultValue={o?.status}>
                                                        {status.map((s, i) => (
                                                            <Option key={i} value={s}>{s}</Option>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>{o?.buyer?.name}</td>
                                                <td>{moment(o?.createdAt).fromNow()}</td>
                                                <td>{o?.payment.success ? "Success" : "Failed"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="container">
                                        {o?.products?.map((p, i) => (
                                            <div className="row mb-2 p-3 card flex-row" key={p._id}>
                                                <div className="col-md-4">
                                                    <img
                                                        src={`/api/v1/product/product-photo/${p._id}`}
                                                        className="card-img-top"
                                                        alt={p.name}
                                                        width={"100%"}
                                                    />
                                                </div>
                                                <div className="col-md-8">
                                                    <p>{p.name}</p>
                                                    <p>{p.description}</p>
                                                    <p>Price : {p.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <table className="table col-md-4">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">Item</th>
                                                <th scope="col">Qty</th>
                                                <th scope="col"> Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {o?.cartItems?.map((c, i) => (

                                                <tr key={c._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{c.name}</td>
                                                    <td>{c.qty}</td>
                                                    <td>{c.price * c.qty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p>Total: ₹{o?.payment?.transaction?.amount}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default AdminOrders