import { HashRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DeviceView from './pages/DeviceView';
import AddDevice from './pages/AddDevice';
import Settings from './pages/Settings';

function App() {
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
