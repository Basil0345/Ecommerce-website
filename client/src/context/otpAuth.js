import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

const OtpAuthContext = createContext();

const OtpAuthProvider = ({ children }) => {
    const [otpAuth, setOtpAuth] = useState({
        user: null,
        token: ''
    });

    //default axios
    axios.defaults.headers.common['Authorization'] = otpAuth?.token;


    useEffect(() => {
        const data = localStorage.getItem("otpAuth");
        if (data) {
            const parseData = JSON.parse(data);
            setOtpAuth({
                ...otpAuth,
                user: parseData.user,
                token: parseData.token
            });
        }
        //eslint-disable-next-line
    }, []);

    return (
        <OtpAuthContext.Provider value={[otpAuth, setOtpAuth]}>
            {children}
        </OtpAuthContext.Provider>
    );

};

//Custom hook

const useOtpAuth = () => useContext(OtpAuthContext);

export { useOtpAuth, OtpAuthProvider }