
import { useState, useEffect } from 'react';
import { useOtpAuth } from '../../context/otpAuth';
import { Outlet } from "react-router-dom";
import axios from 'axios';
import Spinner from '../Spinner';

export default function OtpRoute() {
    const [ok, setOk] = useState(false);
    const [otpAuth, setOtpAuth] = useOtpAuth();

    useEffect(() => {
        const otpAuthCheck = async () => {
            const res = await axios.get("/api/v1/auth/openotp");
            if (res.data.ok) {
                setOk(true);
            } else {
                setOk(false);
            };
        };

        if (otpAuth?.token) { otpAuthCheck() };

    }, [otpAuth?.token]);

    return ok ? <Outlet /> : <Spinner />
};