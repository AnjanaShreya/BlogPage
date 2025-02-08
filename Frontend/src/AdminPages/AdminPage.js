import React from 'react'
import { Link } from 'react-router-dom'

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-gray-200 flex justify-center items-center">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>
        
        {/* Links to navigate to the Moot Court and SW Programs pages */}
        <div className="flex flex-col items-center space-y-6">
          <Link
            to="/mootcourt"
            className="w-full py-3 text-xl text-white bg-blue-500 hover:bg-blue-600 rounded-lg text-center font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Moot Courts
          </Link>
          <Link
            to="/swprograms"
            className="w-full py-3 text-xl text-white bg-green-500 hover:bg-green-600 rounded-lg text-center font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Summer and Winter Programs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
