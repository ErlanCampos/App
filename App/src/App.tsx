
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Technicians } from './pages/Technicians';
import { Orders } from './pages/OrdersPage';
import { MyTasks } from './pages/MyTasks';
import { CalendarView } from './pages/CalendarView';
import { MapView } from './pages/MapView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Technicians />} />
          <Route path="orders" element={<Orders />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="map" element={<MapView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
