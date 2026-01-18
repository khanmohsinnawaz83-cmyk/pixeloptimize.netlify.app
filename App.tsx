
import React, { useState } from 'react';
import { ToolType } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Compressor from './pages/Compressor';
import Converter from './pages/Converter';
import Resizer from './pages/Resizer';
import QualityTool from './pages/QualityTool';
import SizeChecker from './pages/SizeChecker';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>(ToolType.DASHBOARD);

  const renderTool = () => {
    switch (activeTool) {
      case ToolType.DASHBOARD:
        return <Dashboard onSelectTool={setActiveTool} />;
      case ToolType.COMPRESSOR:
        return <Compressor />;
      case ToolType.CONVERTER:
        return <Converter />;
      case ToolType.RESIZER:
        return <Resizer />;
      case ToolType.QUALITY:
        return <QualityTool />;
      case ToolType.CHECKER:
        return <SizeChecker />;
      default:
        return <Dashboard onSelectTool={setActiveTool} />;
    }
  };

  const getPageInfo = () => {
    switch (activeTool) {
      case ToolType.COMPRESSOR:
        return {
          title: 'Image Compressor',
          description: 'Reduce image size in KB without losing visible quality. Perfect for meeting upload limits.'
        };
      case ToolType.CONVERTER:
        return {
          title: 'Image Converter',
          description: 'Instantly convert between JPG, PNG, and WebP formats. Professional results in seconds.'
        };
      case ToolType.RESIZER:
        return {
          title: 'Image Resizer',
          description: 'Modify pixel dimensions with ease. Maintain aspect ratio for the perfect fit.'
        };
      case ToolType.QUALITY:
        return {
          title: 'Quality Controller',
          description: 'Manually adjust compression levels and see the file size change in real-time.'
        };
      case ToolType.CHECKER:
        return {
          title: 'Size Checker',
          description: 'Get detailed metadata about your images. Dimensions, file size, and more.'
        };
      default:
        return {
          title: 'Professional Image Optimization Tools',
          description: 'A complete suite of client-side tools to compress, convert, and resize images for free.'
        };
    }
  };

  const { title, description } = getPageInfo();

  return (
    <Layout
      activeTool={activeTool}
      onNavigate={setActiveTool}
      title={title}
      description={description}
    >
      {renderTool()}
    </Layout>
  );
};

export default App;
