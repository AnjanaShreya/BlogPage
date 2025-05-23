import React from 'react';
import './style.css'; 
import anjana from '../assets/anjana.png';
import vishal from '../assets/vishal.png';
import mandeep from "../assets/Mandeep.png" 
import { Link } from "react-router-dom";

const ProfileCard = () => {
  return (
    <div className="relative h-[400px]">
      {/* Content */}
      <div className="relative z-10">
        <h1 className='flex justify-center py-3 text-2xl font-medium'>MEET THE TEAM</h1>
        <div className='md:flex md:justify-center'>
          {/* Profile Card 1 */}
          <div className="person bg-gradient-to-br from-amber-50 to-gray-200 h-80 m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={mandeep} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Mandeep Kaur</div>
            <div className="title text-center">Associate Professor of Law <br />
              <Link to="" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </div>
          </div>

          {/* Profile Card 2 */}
          <div className="person bg-gradient-to-br from-amber-50 to-gray-200 h-80 m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={vishal} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Vishal Chintala</div>
            <div className="title text-center">Student <br />
              <Link to="" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </div>
          </div>

          {/* Profile Card 3 */}
          <div className="person bg-gradient-to-br from-amber-50 to-gray-200 h-80 m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={anjana} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Anjana Shreya</div>  
            <div className="title text-center">Developer <br />
              <Link to="" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
