import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import BlogForm from './Pages/BlogForm';
import ContactUs from './Pages/ContactUs';
import BlogDetails from './Pages/BlogDetails';
import AdminPage from './AdminPages/AdminPage';
import AdminLogin from './AdminPages/AdminLogin';
import EvidenceAct from './Pages/EvidenceAct';
import MootCourt from './AdminPages/MootCourt';
import SWPrograms from './AdminPages/SWPrograms';
import ElectionLaws from './Pages/ElectionLaws';
import HumanRights from './Pages/HumanRights';
import LawofTorts from './Pages/LawofTorts';
import AllBlogs from './Pages/AllBlogs';
import OtherCategories from './Pages/OtherCategories';
import ApproveBlogs from './AdminPages/ApproveBlogs';
import MootCourts from './Pages/MootCourts';
import ProgramsSW from './Pages/ProgramsSW';
import ConstitutionofIndia from './Pages/ConstitutionofIndia';
import Civilprocedure from './Pages/Civilprocedure';
import AdministrativeLaw from './Pages/AdministrativeLaw';
import LawofContracts from './Pages/LawofContracts';
import Bnss from './Pages/Bnss';
import React, { useEffect } from 'react';
import BlogReviews from './AdminPages/BlogReviews';
import ReviewSubmission from './AdminPages/ReviewSubmission';
import OnlyBlogReview from './AdminPages/SubAdmin/OnlyBlogReview';
import SAApprove from './AdminPages/SubAdmin/SAApprove';
import SAReviews from './AdminPages/SubAdmin/SAReviews';

const CopyPasteRestriction = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const isExempt =
      path === '/blogform' ||
      path === '/contactus' ||
      path.startsWith('/admin') ||
      path.startsWith('/reviewsubmission');

    if (!isExempt) {
      const disableCopy = (e) => {
        e.preventDefault();
        alert('Copying content is disabled on this page.');
      };

      document.addEventListener('copy', disableCopy);
      document.addEventListener('cut', disableCopy);
      document.addEventListener('paste', disableCopy);

      return () => {
        document.removeEventListener('copy', disableCopy);
        document.removeEventListener('cut', disableCopy);
        document.removeEventListener('paste', disableCopy);
      };
    }
  }, [location.pathname]);

  return null;
};

const PrivateRoute = ({ children, requiredRole = null, redirectTo = "/admin/login" }) => {
  // Check for admin authentication
  const adminToken = sessionStorage.getItem('adminToken');
  const adminRole = sessionStorage.getItem('adminRole');
  
  // Check for user authentication
  const userToken = sessionStorage.getItem('userToken');
  const userRole = sessionStorage.getItem('userRole');

  // Debugging
  console.log('Auth check:', { adminToken, adminRole, userToken, userRole, requiredRole });

  // If no token at all
  if (!adminToken && !userToken) {
    console.log('No token, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // Check if required role matches
  if (requiredRole) {
    if (adminRole === requiredRole) {
      return children;
    }
    if (userRole === requiredRole) {
      return children;
    }
    console.log('Role mismatch, redirecting');
    return <Navigate to="/" replace />;
  }

  // If no specific role required but has valid token
  return children;
};

// Role-based route components
const AdminRoute = ({ children }) => (
  <PrivateRoute requiredRole="admin">{children}</PrivateRoute>
);

const SubAdminRoute = ({ children }) => (
  <PrivateRoute requiredRole="subadmin">{children}</PrivateRoute>
);

const UserPrivateRoute = ({ children, redirectTo = "/" }) => {
  const token = sessionStorage.getItem('userToken');
  const userRole = sessionStorage.getItem('userRole');

  console.log('User auth check:', { token, userRole });

  if (!token || userRole !== 'user') {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <CopyPasteRestriction />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/blogform' element={
            <UserPrivateRoute>
              <BlogForm />
            </UserPrivateRoute>
          } />
          <Route path='/blog/:id' element={<BlogDetails />} />
          <Route path='/allblogs' element={<AllBlogs />} />
          <Route path='/evidenceact' element={<EvidenceAct />} />
          <Route path='/electionlaws' element={<ElectionLaws />} />
          <Route path='/humanrights' element={<HumanRights />} />
          <Route path='/lawoftorts' element={<LawofTorts />} />
          <Route path='/constitutionofindia' element={<ConstitutionofIndia />} />
          <Route path='/civilprocedure' element={<Civilprocedure />} />
          <Route path='/administrativelaw' element={<AdministrativeLaw />} />
          <Route path='/lawofcontracts' element={<LawofContracts />} />
          <Route path='/bnss' element={<Bnss />} />
          <Route path='/othercategories' element={<OtherCategories />} />
          <Route path='/mootcourts' element={<MootCourts />} />
          <Route path='/programssw' element={<ProgramsSW />} />
          
          {/* Auth Routes */}
          <Route path='/admin/login' element={<AdminLogin />} />
          
          {/* Protected Admin Routes */}
          <Route path='/admin/dashboard' element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          } />
          
          <Route path="/admin/mootcourt" element={
            <AdminRoute>
              <MootCourt />
            </AdminRoute>
          } />
          
          <Route path="/admin/swprograms" element={
            <AdminRoute>
              <SWPrograms />
            </AdminRoute>
          } />
          
          <Route path="/admin/approveblogs" element={
            <AdminRoute>
              <ApproveBlogs />
            </AdminRoute>
          } />
          
          <Route path="/admin/reviewblogs" element={
            <PrivateRoute>
              <BlogReviews />
            </PrivateRoute>
          } />
          
          <Route path="/admin/onlyblogreview" element={
            <SubAdminRoute>
              <OnlyBlogReview />
            </SubAdminRoute>
          } />
          
          <Route path="/admin/subadminaprroval" element={
            <SubAdminRoute>
              <SAApprove />
            </SubAdminRoute>
          } />
          
          <Route path="/admin/subadminreviews" element={
            <SubAdminRoute>
              <SAReviews />
            </SubAdminRoute>
          } />

          {/* Review submission - can be accessed by both admins and subadmins */}
          <Route path="/reviewsubmission/:id" element={
            <PrivateRoute>
              <ReviewSubmission />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;