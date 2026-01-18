import React from 'react';
import { ToolType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTool: ToolType;
  onNavigate: (tool: ToolType) => void;
  title: string;
  description: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTool, onNavigate, title, description }) => {
  const isDashboard = activeTool === ToolType.DASHBOARD;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => onNavigate(ToolType.DASHBOARD)}
            >
              <div className="bg-indigo-600 p-2 rounded-lg mr-2 group-hover:rotate-6 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                PixelOptimize
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button 
                onClick={() => onNavigate(ToolType.DASHBOARD)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isDashboard ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'}`}
              >
                All Tools
              </button>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-indigo-600 transition-colors">
                API Billing Info
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Breadcrumb / Back Button */}
        {!isDashboard && (
          <button 
            onClick={() => onNavigate(ToolType.DASHBOARD)}
            className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-all group py-2"
          >
            <div className="mr-2 bg-gray-100 group-hover:bg-indigo-50 p-1.5 rounded-full transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">Back to Tools</span>
          </button>
        )}

        <div className={`mb-10 text-center sm:text-left ${!isDashboard ? 'animate-in fade-in slide-in-from-left-4 duration-500' : ''}`}>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight leading-tight">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>
        
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} PixelOptimize Image Suite.
              </p>
              <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest font-bold">
                No Server Processing • 100% Client-Side • Privacy Guaranteed
              </p>
            </div>
            <div className="flex justify-center md:justify-end space-x-6 text-xs font-bold uppercase tracking-widest text-gray-400">
              <a href="/sitemap.xml" target="_blank" className="hover:text-indigo-600 transition-colors">Sitemap</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;