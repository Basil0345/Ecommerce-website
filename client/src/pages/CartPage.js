import React from 'react'
import Layout from './../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
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
            myCart[check_index].qty++;
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
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

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length > 0 ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : " please login to checkout"
                                }` : "Your cart is Empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {cart?.map((p) => (
                            <div className='row mb-2 p-3 card flex-row' key={p._id} >
                                <div className='col-md-4'>
                                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                                        className="card-img-top"
                                        alt={p.name}
                                        width="100px"
                                        height={"100px"}
                                    />
                                </div>
                                <div className='col-md-8'>
                                    <p>{p.name}</p>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <p>Price: {p.price}</p>
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
                        <h2>Cart Summary</h2>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total : {totalPrice()}</h4>
                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3'>
                                    <h4>Current Address</h4>
                                    <h5>{auth?.user?.address}</h5>
                                    <button
                                        className='btn btn-outline-warning'
                                        onClick={() => { navigate("/dashboard/user/profile") }}
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
                                            onClick={() => { navigate("/dashboard/user/profile") }}
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
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage