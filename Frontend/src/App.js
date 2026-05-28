import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import BlogForm from './Pages/BlogForm';
import ContactUs from './Pages/ContactUs';
import BlogDetails from './Pages/BlogDetails';
import AdminPage from './AdminPages/AdminPage';
import AdminLogin from './AdminPages/AdminLogin';
import MootCourt from './AdminPages/MootCourt';
import SWPrograms from './AdminPages/SWPrograms';
import AllBlogs from './Pages/AllBlogs';
import OtherCategories from './Pages/OtherCategories';
import ApproveBlogs from './AdminPages/ApproveBlogs';
import Opportunities from './Pages/Opportunities';
import SubjectPage from './Pages/SubjectPage';
import BlogReviews from './AdminPages/BlogReviews';
import ReviewSubmission from './AdminPages/ReviewSubmission';
import OnlyBlogReview from './AdminPages/SubAdmin/OnlyBlogReview';
import SAApprove from './AdminPages/SubAdmin/SAApprove';
import SAReviews from './AdminPages/SubAdmin/SAReviews';
import Settings from './AdminPages/Settings';
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">


          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/blogform' element={
              // <UserPrivateRoute>
              <BlogForm />
              // </UserPrivateRoute>
            } />
            <Route path='/blog/:id' element={<BlogDetails />} />
            <Route path='/allblogs' element={<AllBlogs />} />

            {/* Reusable Consolidated Subject Page Routes */}
            <Route path='/constitutionofindia' element={<SubjectPage title="Constitution of India" categories={["Constitution of India"]} />} />
            <Route path='/civilprocedure' element={<SubjectPage title="Civil Procedure 1908" categories={["Civil Procedure 1908"]} />} />
            <Route path='/administrativelaw' element={<SubjectPage title="Administrative Law" categories={["Administrative Law"]} />} />
            <Route path='/lawofcontracts' element={<SubjectPage title="The Law of Contracts" categories={["The Law of Contracts"]} />} />
            <Route path='/evidenceact' element={<SubjectPage title="Evidence Act" categories={["The Law of Evidence", "Evidence Act"]} />} />
            <Route path='/electionlaws' element={<SubjectPage title="Election Laws" categories={["Election Laws"]} />} />
            <Route path='/humanrights' element={<SubjectPage title="Human Rights" categories={["Human Rights"]} />} />
            <Route path='/lawoftorts' element={<SubjectPage title="Law of Torts" categories={["Law of Torts"]} />} />
            <Route path='/bnss' element={<SubjectPage title="BNSS 2023" categories={["BNSS 2023"]} />} />
            <Route path='/othercategories' element={<OtherCategories />} />
            <Route path='/opportunities' element={<Opportunities />} />
            <Route path="/reviewsubmission/:id" element={<ReviewSubmission />} />

            {/* Auth Routes */}
            <Route path='/admin/login' element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path='/admin/dashboard' element={
              // <PrivateRoute>
              <AdminPage />
              // </PrivateRoute>
            } />

            <Route path="/admin/mootcourt" element={
              // <AdminRoute>
              <MootCourt />
              // </AdminRoute>
            } />

            <Route path="/admin/swprograms" element={
              // <AdminRoute>
              <SWPrograms />
              // </AdminRoute>
            } />

            <Route path="/admin/approveblogs" element={
              // <AdminRoute>
              <ApproveBlogs />
              // </AdminRoute>
            } />

            <Route path="/admin/reviewblogs" element={
              // <PrivateRoute>
              <BlogReviews />
              // </PrivateRoute>
            } />

            <Route path="/admin/onlyblogreview" element={
              // <SubAdminRoute>
              <OnlyBlogReview />
              // </SubAdminRoute>
            } />

            <Route path="/admin/subadminaprroval" element={
              // <SubAdminRoute>
              <SAApprove />
              // </SubAdminRoute>
            } />

            <Route path="/admin/subadminreviews" element={
              // <SubAdminRoute>
              <SAReviews />
              // </SubAdminRoute>
            } />

            <Route path="/admin/settings" element={
              // <AdminRoute>
              <Settings />
              // </AdminRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;