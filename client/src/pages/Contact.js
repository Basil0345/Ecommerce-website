import React from 'react'
import Layout from '../components/Layout/Layout';
import { BiMailSend, BiPhoneCall, BiSupport } from 'react-icons/bi'

function Contact() {
    return (
        <Layout title={"Contact us - Ecommerce App"}>
            <div className='row contactus' style={{ minHeight: "90vh" }}>
                <div className='col-md-6 col-sd-4' >
                    <img
                        src="/images/contactus.jpeg"
                        alt='contactus'
                        style={{ width: "100%" }}
                    />
                </div>
                <div className='col-md-4' >
                    <h1 className="bg-dark p-2 text-white text-center">CONTACT US</h1>
                    <p className='text-justify mt-2'>any query and info about product feel free to call anytime we 24X7
                        available</p>
                    <p className='mt-3'> <BiMailSend /> : dummymail@gmail.com</p>
                    <p className='mt-3'> <BiPhoneCall />: +91 0000 0000 </p>
                    <p className='mt-3'> <BiSupport /> : +91 0000 000 (toll free) </p>
                </div>
            </div>
        </Layout >
    )
}

export default Contact