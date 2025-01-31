import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import BlogForm from './Pages/BlogForm';
import ContactUs from './Pages/ContactUs';
import AdminPage from './AdminPages/AdminPage';
import BlogDetails from './Pages/BlogDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/blogform' element={<BlogForm />} />
          <Route path='/adminpage' element={<AdminPage/>} />
          <Route path='/blog/:id' element={<BlogDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
