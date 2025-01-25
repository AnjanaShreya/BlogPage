import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import BlogForm from './Pages/BlogForm';
import ContactUs from './Pages/ContactUs';
import AdminPage from './AdminPages/AdminPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} /> 
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/blogform' element={<BlogForm />} />
          <Route path='/adminpage' element={<AdminPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
