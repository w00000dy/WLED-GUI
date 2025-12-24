import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeviceView from './pages/DeviceView';
import AddDevice from './pages/AddDevice';
import Settings from './pages/Settings';

function App() {
  // Log startup in React world just to confirm
  useEffect(() => {
    console.log('WLED-GUI React App Started');
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/device/:ip" element={<DeviceView />} />
          <Route path="/add" element={<AddDevice />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
