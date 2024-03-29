import React, { useState, useEffect } from 'react'
import Layout from './../../components/Layout/Layout';
import UserMenu from './../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import moment from 'moment';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/v1/auth/orders");
            setOrders(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token])

    return (
        <Layout title={"Your Orders"}>
            <div className="container-fluid pt-3" style={{ minHeight: "92vh" }}>
                <div className="row">
                    <div className="col-md-3">
                        <UserMenu />
                    </div>
                    <div className="col-md-9">
                        <h1 className="text-center pt-3">All Orders</h1>
                        {orders?.map((o, i) => {
                            return (
                                <div className="border shadow mt-3" key={o._id}>
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
                                                <td>{o?.status}</td>
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
        </Layout>
    )
}

export default Orders