import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MissionInput } from './pages/MissionInput';
import { LiveActivity } from './pages/LiveActivity';
import { Agents } from './pages/Agents';
import { Analytics } from './pages/Analytics';
import { Documents } from './pages/Documents';
import { ApprovalCenter } from './pages/ApprovalCenter';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MissionInput />} />
          <Route path="activity" element={<LiveActivity />} />
          <Route path="agents" element={<Agents />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="documents" element={<Documents />} />
          <Route path="approvals" element={<ApprovalCenter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
