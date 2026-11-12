import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { RecordsProvider } from './contexts/RecordsContext';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { ScanView } from './pages/ScanView';
import { StaffLogin } from './pages/StaffLogin';
import { ClinicRecords } from './pages/ClinicRecords';
import { RecordDetail } from './pages/RecordDetail';
import { TriageDashboard } from './pages/TriageDashboard';
import { StaffLayout } from './components/StaffLayout';

export function App() {
  return (
    <RecordsProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/p/:id" element={<ScanView />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route element={<StaffLayout />}>
            <Route path="/clinic" element={<ClinicRecords />} />
            <Route path="/clinic/records/:id" element={<RecordDetail />} />
            <Route path="/clinic/triage" element={<TriageDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </RecordsProvider>);

}