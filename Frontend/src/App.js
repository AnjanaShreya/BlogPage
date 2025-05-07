import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
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
          <Route path='/othercategories' element={<OtherCategories />} />
          <Route path='/mootcourts' element={<MootCourts />} />
          <Route path='/programssw' element={<ProgramsSW />} />
          
          {/* Admin Routes */}
          <Route path='/admin/login' element={<AdminLogin /> } />
          <Route path='/admin/dashboard' element={<AdminPage/>} />
          <Route path="/admin/mootcourt" element={<MootCourt />} />
          <Route path="/admin/swprograms" element={<SWPrograms />} />
          <Route path="/admin/approveblogs" element={<ApproveBlogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
