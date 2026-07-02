import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { SpotsPage } from './pages/SpotsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/picos" element={<SpotsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
