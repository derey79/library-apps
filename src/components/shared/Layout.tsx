import React from 'react';
import { Outlet } from 'react-router-dom'; // 💡 Impor komponen penampung sub-halaman
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className='min-h-screen bg-base-background'>
      {/* Navigation Layer */}
      <Navbar />

      {/* Main Grid Content Area */}
      <main className='custom-container py-8 px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Main Content Column (Spans 2 columns on larger screens) */}
          <div className='md:col-span-2 space-y-6'>
            <div className='p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white'>
              <h2 className='text-xl font-bold mb-4'>Main Content Area</h2>
              <p className='text-zinc-400'>
                Your primary workspace metrics, feed, or interface components go
                here.
              </p>
            </div>

            {/* 💡 Sub-halaman dari router otomatis dirender di posisi Outlet ini */}
            <Outlet />
          </div>

          {/* Sidebar Column */}
          <div className='space-y-6 text-white'>
            <div className='p-6 rounded-2xl bg-zinc-900 border border-zinc-800'>
              <h3 className='text-lg font-bold mb-3'>Sidebar Actions</h3>
              <div className='space-y-2'>
                <button className='w-full text-left p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer text-sm font-medium'>
                  Activity Logs
                </button>
                <button className='w-full text-left p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer text-sm font-medium'>
                  Settings Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
