// src/App.js
import './App.css';
import { Routes, Route, useLocation } from "react-router-dom";
import Menu from './components/menuComponent/menu';
import Login from './components/login';
import Dashboard from './components/dashboard';
import DailyOrders from './components/dailyOrders/dailyOrders';
import CertificateOfCompliance from './components/certificatesOfComplience/certificatesOfComplience';
import Inventory from './components/InventoryComponent/inventory';

function App() {
  const location = useLocation();  // Hook to get the current location
  const showMenu = location.pathname !== "/";  // Condition to show the Menu

  return (
    <div className="App">
      {showMenu && <Menu />} 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dailyorders" element={<DailyOrders />} />
        <Route path="/certificates" element={<CertificateOfCompliance />} />
        <Route path='/inventory' element={<Inventory />} />
      </Routes>
    </div>
  );
}

export default App;