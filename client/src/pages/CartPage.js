import React, { useState, useEffect } from 'react'
import Layout from './../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [clientToken, setClientToken] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price * item.qty;
            })
            return total.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR"
            })
        } catch (error) {
            console.log(error);
        }
    };

    const removeCartItem = (pid) => {
        try {
            const myCart = [...cart]
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem("cart", JSON.stringify(myCart));
        } catch (error) {
            console.log(error);
        }
    }

    //Increment cart item
    const incrementCartItem = (c) => {
        let myCart = [...cart];
        const check_index = myCart.findIndex(item => item._id === c._id);
        if (check_index !== -1) {
            if (myCart[check_index].qty < c.quantity) {
                myCart[check_index].qty++;
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
            } else {
                toast.error("max out");
            }
        }
    };

    //Decrement cart item
    const decrementCartItem = (c) => {
        let myCart = [...cart];
        const check_index = myCart.findIndex(item => item._id === c._id);
        if (check_index !== -1) {
            if (myCart[check_index].qty > 1) {
                myCart[check_index].qty--;
                setCart(myCart);
                localStorage.setItem('cart', JSON.stringify(myCart));
            } else {
                removeCartItem(c._id);
            }
        }
    };

    //get payment gateway token
    const getToken = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/braintree/token");
            setClientToken(data?.clientToken);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getToken();
    }, [auth?.token]);

    //handle Payments
    const handlePayment = async () => {
        try {
            setLoading(true);
            const { nonce } = await instance.requestPaymentMethod();
            const { data } = await axios.post("/api/v1/product/braintree/payment", {
                nonce, cart
            })
            setLoading(false);
            localStorage.removeItem("cart");
            setCart([]);
            navigate("/dashboard/user/orders");
            toast.success("Payment Completed Successfully")
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div className='cart-page ' style={{ minHeight: "92vh" }}>
                <div className='row m-0'>
                    <div className='col-md-12 p-2'>
                        <h3 className='text-center bg-light p-0'>
                            {!auth?.user ? "Hello Guest" : `Hello ${auth?.token && auth?.user?.name}`}
                        </h3>
                        <h5 className='text-center mb-0'>
                            {cart?.length > 0 ? `You Have ${cart?.length > 1 ? `${cart?.length} items` : `${cart?.length} item`}  in your cart ${auth?.token ? "" : " please login to checkout"
                                }` : "Your cart is Empty"}
                        </h5>
                    </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-8'>
                            {cart?.map((p) => (
                                <div className='row mb-2 p-3 card flex-row' key={p._id} >
                                    <div className='col-md-4'>
                                        <img src={`/api/v1/product/product-photo/${p._id}`}
                                            className="card-img-top"
                                            alt={p.name}
                                            width={"100%"}
                                        />
                                    </div>
                                    <div className='col-md-8'>
                                        <p>{p.name}</p>
                                        <p className='d-flex'>Price: <p className='text-success'> {p.price.toLocaleString("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                        })}</p></p>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <p className="text-dark">Qty:</p>
                                            </div>
                                            <div className="input-group w-auto justify-content-end align-items-center">
                                                <input type="button" onClick={() => {
                                                    decrementCartItem(p);
                                                }} defaultValue="-" className="button-minus border rounded-circle  icon-shape icon-sm mx-1 " data-field="quantity" />
                                                <input type="number" value={p.qty} disabled className="quantity-field border-0 text-center w-25" />
                                                <input type="button" onClick={() => {
                                                    incrementCartItem(p);
                                                }} defaultValue="+" className="button-plus border rounded-circle icon-shape icon-sm " data-field="quantity" />
                                            </div>
                                        </div>

                                        <button className='btn btn-danger'
                                            onClick={() => { removeCartItem(p._id) }}
                                        >Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='col-md-4 text-center'>
                            <h3>Cart Summary</h3>
                            <p>Total | Checkout | Payment</p>
                            <hr />
                            <h5>Total : {totalPrice()}</h5>
                            {auth?.user?.address ? (
                                <>
                                    <div className='mb-3'>
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button
                                            className='btn btn-outline-warning'
                                            onClick={() => {
                                                navigate("/dashboard/user/profile", {
                                                    state: "/cart"
                                                })
                                            }}
                                        >
                                            Update Address
                                        </button>
                                    </div>
                                </>
                            ) : (<>
                                <div className='mb-3'>
                                    {
                                        auth?.token ? (
                                            <button
                                                className='btn btn-outline-warning'
                                                onClick={() => {
                                                    navigate("/dashboard/user/profile", {
                                                        state: "/cart"
                                                    })
                                                }}
                                            >
                                                Update Address
                                            </button>
                                        ) : (
                                            <button
                                                className='btn btn-outline-warning'
                                                onClick={() => {
                                                    navigate("/login", {
                                                        state: "/cart"
                                                    })
                                                }}
                                            >
                                                Please Login to checkout
                                            </button>
                                        )
                                    }

                                </div>
                            </>)}
                            <div className='mt-2'>
                                {
                                    !clientToken || !cart?.length ? ("") : (
                                        <>
                                            <DropIn
                                                options={{
                                                    authorization: clientToken,
                                                    paypal: {
                                                        flow: "vault",
                                                    },
                                                }}
                                                onInstance={(instance) => setInstance(instance)}
                                            />

                                            <button className='btn btn-primary mb-5' onClick={handlePayment} disabled={loading || !instance || !auth?.user?.address}>
                                                {loading ? "Processing..." : "Make Payment"}
                                            </button>
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage