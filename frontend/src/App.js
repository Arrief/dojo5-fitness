import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './Navbar';
import './App.css';

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </>
  );
}

export default App;
