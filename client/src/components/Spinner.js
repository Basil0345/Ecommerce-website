import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';

const Spinner = ({ path = 'login' }) => {
    const [count, setCount] = useState(3);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const interval = setInterval(() => {
            setCount((PrevValue) => --PrevValue);
        }, 1000)

        count === 0 && navigate(`/${path}`, {
            state: location.pathname
        });
        return () => clearInterval(interval)
    }, [count, navigate, location, path])
    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center " style={{ height: '100vh' }}>
                <h1 className='Text-center'>redirecting to you in {count} second</h1>
                <div className="spinner-border" role="status">
                </div>
            </div>

        </>
    )
}

export default Spinner