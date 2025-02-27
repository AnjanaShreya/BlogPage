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
          {/* Admin Routes */}
          <Route path='/adminpage' element={<AdminPage/>} />
          <Route path='/adminlogin' element={<AdminLogin /> } />
          <Route path="/mootcourt" element={<MootCourt />} />
        <Route path="/swprograms" element={<SWPrograms />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
