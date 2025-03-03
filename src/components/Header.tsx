import React from 'react';
import { Cloud, Zap, Image, Layers, Cpu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Cloud className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">ImageAI</h1>
              <p className="text-xs text-blue-100">Advanced Image Processing</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            <div className="flex items-center space-x-1 bg-blue-700 bg-opacity-40 px-3 py-1 rounded-full">
              <Layers className="h-4 w-4 text-blue-200" />
              <span className="text-sm">Object Detection</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-700 bg-opacity-40 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4 text-yellow-300" />
              <span className="text-sm">Classification</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-700 bg-opacity-40 px-3 py-1 rounded-full">
              <Image className="h-4 w-4 text-green-300" />
              <span className="text-sm">Color Analysis</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-700 bg-opacity-40 px-3 py-1 rounded-full">
              <Cpu className="h-4 w-4 text-purple-300" />
              <span className="text-sm">TensorFlow.js</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;