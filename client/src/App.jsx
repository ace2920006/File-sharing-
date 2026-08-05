import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Download from './pages/Download';
import Error from './pages/Error';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/download/:token" element={<Download />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>

        <Footer />

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '1rem',
              fontSize: '0.875rem',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
