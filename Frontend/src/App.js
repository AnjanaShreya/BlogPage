import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// const CopyPasteRestriction = () => {
//   const location = useLocation();

//   useEffect(() => {
//     const path = location.pathname;

//     const isExempt =
//       path === '/blogform' ||
//       path === '/contactus' ||
//       path.startsWith('/admin') ||
//       path.startsWith('/reviewsubmission');

//     if (!isExempt) {
//       const disableCopy = (e) => {
//         e.preventDefault();
//         alert('Copying content is disabled on this page.');
//       };

//       document.addEventListener('copy', disableCopy);
//       document.addEventListener('cut', disableCopy);
//       document.addEventListener('paste', disableCopy);

//       return () => {
//         document.removeEventListener('copy', disableCopy);
//         document.removeEventListener('cut', disableCopy);
//         document.removeEventListener('paste', disableCopy);
//       };
//     }
//   }, [location.pathname]);

//   return null;
// };

function App() {
  return (
    <Router>
      <div className="App">
        {/* Add the CopyPasteRestriction component */}
        {/* <CopyPasteRestriction /> */}
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/blogform' element={<BlogForm />} />
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
          
          {/* Admin Routes */}
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<AdminPage/>} />
          <Route path="/admin/mootcourt" element={<MootCourt />} />
          <Route path="/admin/swprograms" element={<SWPrograms />} />
          <Route path="/admin/approveblogs" element={<ApproveBlogs />} />
          <Route path="/admin/reviewblogs" element={<BlogReviews />} />
          <Route path="/admin/onlyblogreview" element={<OnlyBlogReview />} />
          <Route path="/admin/subadminaprroval" element={<SAApprove />} />
          <Route path="/admin/subadminreviews" element={<SAReviews />} />

          <Route path="/reviewsubmission/:id" element={<ReviewSubmission />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;