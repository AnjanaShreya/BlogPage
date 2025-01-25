import React from 'react';
import './style.css'; 
import anjana from '../assets/anjana.png';
import vishal from '../assets/vishal.png';
import { Link } from "react-router-dom";

const ProfileCard = () => {
  return (
    <div className="relative h-[500px]">
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      {/* Content */}
      <div className="relative z-10">
        <h1 className='flex justify-center pt-3 text-2xl font-medium text-white'>MEET THE TEAM</h1>
        <div className='md:flex md:justify-center'>
          {/* Profile Card 1 */}
          <div className="person bg-gray-100 h-auto m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={anjana} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Anjana Shreya</div>
            <div className="title">Developer |{" "}
              <Link to="" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </div>
          </div>

          {/* Profile Card 2 */}
          <div className="person bg-gray-100 h-auto m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={vishal} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Vishal Chintala</div>
            <div className="title">Lawyer | {" "}
              <Link to="" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </div>
          </div>

          {/* Profile Card 3 */}
          <div className="person bg-gray-100 h-auto m-4 rounded-xl shadow-xl">
            <div className="container-outer">
              <div className="container-inner">
                <div className="circle">
                  <img className="img" src={anjana} alt="Profile" />
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="name">Anjana Shreya</div>
            <div className="title">Developer | {" "}
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
