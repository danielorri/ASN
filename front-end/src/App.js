import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from './components/login';
import Dashboard from './components/dashboard'; 
import DailyOrders from './components/dailyOrders/dailyOrders';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dailyorders" element={<DailyOrders />} />
      </Routes>
    </div>
  );
}

export default App;
