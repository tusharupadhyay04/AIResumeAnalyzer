import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-slate-500 text-sm">
        &copy; 2026 AI Resume Analyzer System. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
