import { useState, useContext, useEffect, createContext } from 'react';

const CartContext = createContext();

const CartProvider = ({ children }) => {

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const existingCartItem = localStorage.getItem("cart");
        if (existingCartItem) {
            const parseData = JSON.parse(existingCartItem);
            setCart([...parseData]);
        }
        //eslint-disable-next-line
    }, []);

    return (
        <CartContext.Provider value={[cart, setCart]}>
            {children}
        </CartContext.Provider>
    );

};

//Custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider }