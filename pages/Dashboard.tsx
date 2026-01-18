import React from 'react';
import { ToolType } from '../types';
import AdPlaceholder from '../components/AdPlaceholder';

interface DashboardProps {
  onSelectTool: (tool: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const tools = [
    {
      id: ToolType.COMPRESSOR,
      title: 'Image Compressor',
      desc: 'Reduce image size in KB (under 50KB, 100KB, etc.) while keeping quality.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      id: ToolType.CONVERTER,
      title: 'Image Converter',
      desc: 'Convert JPG, PNG, and WebP instantly. Supports bulk-like processing.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      id: ToolType.RESIZER,
      title: 'Image Resizer',
      desc: 'Change width and height. Maintain aspect ratio or set custom dimensions.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      id: ToolType.QUALITY,
      title: 'Quality Controller',
      desc: 'Fine-tune image quality with a live preview and instant KB feedback.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      color: 'bg-orange-500',
    },
    {
      id: ToolType.CHECKER,
      title: 'Size Checker',
      desc: 'Quickly check the size and dimensions of any image. Compare metadata.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="space-y-12">
      <AdPlaceholder slot="dashboard_top" className="mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group cursor-pointer bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`${tool.color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
              {tool.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {tool.title}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {tool.desc}
            </p>
            <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm">
              Use Tool
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">Why choose PixelOptimize?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="flex space-x-4">
              <div className="bg-white/10 p-2 h-fit rounded-lg">✅</div>
              <div>
                <h4 className="font-bold text-lg">100% Privacy</h4>
                <p className="text-indigo-100 opacity-80">Your images stay in your browser. We never upload your data to any server.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="bg-white/10 p-2 h-fit rounded-lg">🚀</div>
              <div>
                <h4 className="font-bold text-lg">Instant Performance</h4>
                <p className="text-indigo-100 opacity-80">Get results in milliseconds with browser-based GPU acceleration.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* SEO Content Section for Google Indexing */}
      <article class="prose prose-indigo max-w-none bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Master Your Web Vitals with PixelOptimize</h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          PixelOptimize is a free online image optimization suite designed for developers, bloggers, and SEO specialists. 
          By using our <strong>image compressor under 100kb</strong> and <strong>WebP converter</strong>, you can drastically 
          improve your Core Web Vitals, specifically Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS). 
          Our suite supports PNG, JPG, and WebP formats, providing a comprehensive solution for all your web imagery needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Instant Image Compression</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Meet strict platform requirements (like Blogger or WordPress) by shrinking your images to exact KB limits. 
              Our binary-search compression algorithm finds the highest possible quality for your target file size.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Modern WebP Conversion</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Future-proof your website by converting legacy PNG and JPEG files to WebP. WebP offers superior compression 
              ratios, saving up to 80% on bandwidth while maintaining professional visual fidelity.
            </p>
          </div>
        </div>
      </article>

      <AdPlaceholder slot="dashboard_bottom" />
    </div>
  );
};

export default Dashboard;