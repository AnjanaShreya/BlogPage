import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { links } from "./Mylinks"; 

const NavLinks = () => {
  const [heading, setHeading] = useState("");
  const location = useLocation();

  // Helper to check if any sublink is active
  const isSublinkActive = (link) => {
    if (!link.submenu) return false;
    return link.sublinks.some(sub => 
      sub.sublink.some(slink => location.pathname === slink.link)
    );
  };

  return (
    <>
      {links.map((link, index) => {
        const isParentActive = location.pathname === link.link || isSublinkActive(link);

        return (
          <div key={index}> 
            <div className="px-3 text-left md:cursor-pointer group">
              {link.submenu ? (
                <h1
                  className={`py-4 flex justify-between items-center md:pr-0 pr-5 group relative transition-colors ${
                    isParentActive ? "text-gold font-bold" : "text-gray-700 hover:text-gold"
                  }`}
                  onClick={() => {
                    setHeading(heading !== link.name ? link.name : ""); // Toggle heading
                  }}
                >
                  <span className="relative inline-block pb-0.5">
                    {link.name}
                    <span className={`absolute bottom-[-10px] left-0 h-0.5 bg-gold transition-all duration-300 ${
                      isParentActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                  <span className="text-xl md:hidden inline">
                    <ion-icon
                      name={`${
                        heading === link.name ? "chevron-up" : "chevron-down"
                      }`}
                    ></ion-icon>
                  </span>
                  <span className="text-xl md:mt-1 md:ml-2 md:block hidden group-hover:rotate-180 group-hover:-mt-2">
                    <ion-icon name="chevron-down"></ion-icon>
                  </span>
                </h1>
              ) : (
                <Link
                  to={link.link}
                  className={`py-4 flex justify-between items-center md:pr-0 pr-5 group relative transition-colors inline-block font-sans text-sm font-semibold tracking-wider uppercase ${
                    isParentActive ? "text-gold font-bold" : "text-gray-700 hover:text-gold"
                  }`}
                >
                  <span className="relative inline-block pb-0.5">
                    {link.name}
                    <span className={`absolute bottom-[-10px] left-0 h-0.5 bg-gold transition-all duration-300 ${
                      isParentActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}></span>
                  </span>
                </Link>
              )}
              {link.submenu && (
                <div>
                  {/* Desktop Submenu */}
                  <div className="absolute top-14 hidden group-hover:md:block hover:md:block z-50">
                    <div className="py-3">
                      <div
                        className="w-4 h-4 left-6 absolute mt-1 bg-white border-t border-l border-gray-100 rotate-45 z-50"
                      ></div>
                    </div>
                    {/* adjust sublink size tabs */}
                    <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-5 min-w-[240px]">
                      {link.sublinks.map((mysublinks, subIndex) => (
                        <div key={subIndex}>
                          {mysublinks.Head && (
                            <h1 className="text-sm font-bold text-gray-900 mb-2 tracking-wider">
                              {mysublinks.Head}
                            </h1>
                          )}
                          <ul>
                            {mysublinks.sublink.map((slink, slinkIndex) => {
                              const isActive = location.pathname === slink.link;
                              return (
                                <li
                                  key={slinkIndex}
                                  className="text-xs my-1"
                                >
                                  <Link
                                    to={slink.link}
                                    className={`transition-all block py-1 px-2.5 rounded ${
                                      isActive
                                        ? "text-gold font-bold bg-navy-light/10 border-l-4 border-gold pl-3.5"
                                        : "text-gray-600 hover:text-gold hover:font-bold hover:pl-3"
                                    }`}
                                  >
                                    {slink.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Mobile Menus */}
            {link.submenu && (
              <div
                className={`${
                  heading === link.name ? "md:hidden" : "hidden"
                }`}
              >
                {/* Sub-links for Mobile */}
                {link.sublinks.map((slinks, subIndex) => (
                  <div key={subIndex}>
                    <ul>
                      {slinks.sublink.map((slink, slinkIndex) => {
                        const isActive = location.pathname === slink.link;
                        return (
                          <li key={slinkIndex} className="py-2 pl-14">
                            <Link
                              to={slink.link}
                              className={`transition-all ${
                                isActive ? "text-gold font-bold" : "text-gray-700 hover:text-gold"
                              }`}
                            >
                              {slink.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default NavLinks;
