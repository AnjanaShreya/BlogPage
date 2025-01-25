import React from 'react'
import Logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='bg-[#155966] h-52 border-t-4 border-[#000000] '>
      <div className='text-gray-200 py-10 pe-12 flex items-center justify-around'>
        <div>
        <Link to='/'>
            <img src={Logo} alt='Logo' className='h-16' />
        </Link>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');`}
        </style> 
        <p style={{paddingLeft:'10px'}}>Founded By <span style={{fontFamily: "'Dancing Script', cursive", fontSize:"20px"}}>Mandeep Kaur</span></p>
        </div>
        <div className='text-gray-200'>
          <p className='text-2xl font-semibold underline leading-loose text-white'>Contact Us</p>
          <a className='cursor-pointer' href="mailto:abc@gmail.com">abc@gmail.com</a>
          <p className='cursor-pointer'>+91 1234567890</p>
          <div className="flex space-x-2">
            <a
              href="https://instagram.com" rel="instagram" className="hover:text-[#002a32] m-1">
              <FaInstagram size={20} />
            </a>
            <a href="https://linkedin.com" rel="linkdn" className="hover:text-[#002a32] m-1">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
        <div className='text-gray-200'>
            <p className='text-2xl font-semibold underline leading-loose text-white'>Address</p>
            <p>Mahindra University, <br/> Bahaduepally, Jeedimetla, <br /> Hyderabad, Tealngana, India - 500043</p>
        </div>
      </div>
      <div className='bg-[#d5be38] font-semibold text-gray-900 text-center p-2'>
        Copyright © 2024 Anjana Shreya. All rights reserved
      </div>
    </div>
  )
}

export default Footer
