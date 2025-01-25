import React, { useState } from "react";
import { Link } from "react-router-dom";
import { links } from "./Mylinks"; 

const NavLinks = () => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");

  return (
    <>
      {links.map((link, index) => (
        <div key={index}> {/* Added unique key for React map */}
          <div className="px-3 text-left md:cursor-pointer group">
            <h1
              className="py-7 flex justify-between items-center md:pr-0 pr-5 group"
              onClick={() => {
                setHeading(heading !== link.name ? link.name : ""); // Toggle heading
                setSubHeading(""); // Reset subheading
              }}
            >
              {link.name} 
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
            {link.submenu && (
              <div>
                {/* Desktop Submenu */}
                <div className="absolute top-20 hidden group-hover:md:block hover:md:block">
                  <div className="py-3">
                    <div
                      className="w-4 h-4 left-3 absolute mt-1 bg-[#f3f4f6ed] rotate-45"
                    ></div>
                  </div>
                  {/* adjust sublink size tabs */}
                  <div className="bg-[#f3f4f6f7] p-5 grid grid-cols-1 gap-10">
                    {link.sublinks.map((mysublinks, subIndex) => (
                      <div key={subIndex}> {/* Added unique key */}
                        <h1 className="text-lg font-semibold">
                          {mysublinks.Head}
                        </h1>
                        <ul> {/* Added UL wrapper for better structure */}
                          {mysublinks.sublink.map((slink, slinkIndex) => (
                            <li
                              key={slinkIndex} // Added unique key
                              className="text-sm text-gray-700 my-2.5"
                            >
                              <Link
                                to={slink.link}
                                className="hover:text-[#002a32] hover:font-bold"
                              >
                                {slink.name}
                              </Link>
                            </li>
                          ))}
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
                <div key={subIndex}> {/* Added unique key */}
                  <div>
                    <h1
                      onClick={() =>
                        setSubHeading(
                          subHeading !== slinks.Head ? slinks.Head : ""
                        )
                      }
                      className="py-4 pl-7 font-semibold flex justify-between items-center md:pr-0 pr-5"
                    >
                      {slinks.Head}
                      <span className="text-xl inline">
                        <ion-icon
                          name={`${
                            subHeading === slinks.Head
                              ? "chevron-up"
                              : "chevron-down"
                          }`}
                        ></ion-icon>
                      </span>
                    </h1>
                    <ul
                      className={`${
                        subHeading === slinks.Head ? "md:hidden" : "hidden"
                      }`}
                    >
                      {slinks.sublink.map((slink, slinkIndex) => (
                        <li key={slinkIndex} className="py-3 pl-14">
                          <Link to={slink.link}>{slink.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default NavLinks;
