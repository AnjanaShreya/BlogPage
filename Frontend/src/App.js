import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import BlogForm from './Pages/BlogForm';
import ContactUs from './Pages/ContactUs';
import BlogDetails from './Pages/BlogDetails';
import AdminPage from './AdminPages/AdminPage';
import AdminLogin from './AdminPages/AdminLogin';
import EvidenceAct from './Pages/EvidenceAct';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/blogform' element={<BlogForm />} />
          <Route path='/blog/:id' element={<BlogDetails />} />
          <Route path='/evidenceact' element={<EvidenceAct />} />
          <Route path='/adminpage' element={<AdminPage/>} />
          <Route path='/adminlogin' element={<AdminLogin /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
