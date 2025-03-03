import React, { useState } from 'react';
import { AlertTriangle, Upload, Cpu, Database, Server, Zap, Image as ImageIcon, Layers } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import ObjectDetection from './components/ObjectDetection';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingComplete, setProcessingComplete] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    // Create object URL for the uploaded file
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    
    // Simulate serverless processing
    setIsProcessing(true);
    setProcessingComplete(false);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced AI Image Processing</h1>
            <p className="text-lg text-gray-600">
              Upload an image to analyze with multiple AI models
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} />
            </div>
          </div>
          
          {imageUrl && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Analysis Results</h2>
                <ObjectDetection imageUrl={imageUrl} />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FeatureCard 
              icon={<Layers className="h-8 w-8 text-purple-500" />}
              title="Object Detection"
              description="Identifies multiple objects in your images with bounding boxes"
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-yellow-500" />}
              title="Image Classification"
              description="Classifies the entire image content with confidence scores"
            />
            <FeatureCard 
              icon={<ImageIcon className="h-8 w-8 text-blue-500" />}
              title="Color Analysis"
              description="Extracts and displays dominant colors from your images"
            />
            <FeatureCard 
              icon={<Cpu className="h-8 w-8 text-green-500" />}
              title="Privacy-Focused"
              description="All processing happens in your browser - no data is sent to servers"
            />
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">1</div>
                  <h4 className="font-medium">Upload Image</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Upload any image from your device using drag-and-drop or file browser.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">2</div>
                  <h4 className="font-medium">AI Processing</h4>
                </div>
                <p className="text-sm text-gray-600">
                  TensorFlow.js models analyze your image directly in your browser.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mr-3">3</div>
                  <h4 className="font-medium">View Results</h4>
                </div>
                <p className="text-sm text-gray-600">
                  See detailed analysis including object detection, classification, and color analysis.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Note</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a demonstration of browser-based AI image processing using TensorFlow.js. 
                  In a production environment, this would be connected to cloud services like 
                  AWS Lambda, S3, and API Gateway for scalable processing of larger images and more complex models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default App;