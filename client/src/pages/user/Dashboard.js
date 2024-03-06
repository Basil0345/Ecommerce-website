import React from 'react'
import Layout from './../../components/Layout/Layout';
import UserMenu from './../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
const Dashboard = () => {
    const [auth] = useAuth();
    return (
        <Layout title={"Dashboard - Ecommerce app"}>
            <div className='container-fluid  pt-3 ' style={{ minHeight: "90vh" }}>
                <div className='row'>
                    <div className='col-md-3' >
                        <UserMenu />
                    </div>
                    <div className='col-md-9 mt-4 d-flex justify-content-center'>
                        <div className='card w-75 p-3'>
                            <h3>Name: {auth?.user?.name}</h3>
                            <h3>Email: {auth?.user?.email}</h3>
                            <h3>Address: {auth?.user?.address}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;