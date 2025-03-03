import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Loader2, Layers, Zap } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ObjectDetectionProps {
  imageUrl: string | null;
}

interface Detection {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

interface Classification {
  className: string;
  probability: number;
}

const ObjectDetection: React.FC<ObjectDetectionProps> = ({ imageUrl }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objectDetectionModel, setObjectDetectionModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [classificationModel, setClassificationModel] = useState<mobilenet.MobileNet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'detection' | 'classification'>('detection');
  const [dominantColors, setDominantColors] = useState<{color: string, percentage: number}[]>([]);
  const [imageStats, setImageStats] = useState<{width: number, height: number, aspectRatio: number} | null>(null);

  // Load the models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        // Make sure TensorFlow.js is ready
        await tf.ready();
        
        // Load models in parallel
        const [detectionModel, classifierModel] = await Promise.all([
          cocoSsd.load(),
          mobilenet.load()
        ]);
        
        setObjectDetectionModel(detectionModel);
        setClassificationModel(classifierModel);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load models:', err);
        setError('Failed to load the AI models. Please try again later.');
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Extract dominant colors from image
  const extractDominantColors = (imgElement: HTMLImageElement) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Scale down for performance
      const scale = Math.min(1, 100 / Math.max(imgElement.width, imgElement.height));
      canvas.width = imgElement.width * scale;
      canvas.height = imgElement.height * scale;
      
      ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Count color occurrences (simplified to 16 colors for performance)
      const colorCounts: Record<string, number> = {};
      const totalPixels = pixels.length / 4;
      
      for (let i = 0; i < pixels.length; i += 4) {
        // Simplify colors by rounding to nearest 16
        const r = Math.round(pixels[i] / 16) * 16;
        const g = Math.round(pixels[i + 1] / 16) * 16;
        const b = Math.round(pixels[i + 2] / 16) * 16;
        
        const colorKey = `rgb(${r},${g},${b})`;
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }
      
      // Sort and get top 5 colors
      const sortedColors = Object.entries(colorCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5)
        .map(([color, count]) => ({
          color,
          percentage: Math.round((count / totalPixels) * 100)
        }));
      
      setDominantColors(sortedColors);
    } catch (err) {
      console.error('Error extracting colors:', err);
    }
  };

  // Process image when models and image are ready
  useEffect(() => {
    const processImage = async () => {
      if (!imageUrl || !imageRef.current || !canvasRef.current) return;
      if (!objectDetectionModel || !classificationModel) return;

      try {
        setLoading(true);
        
        // Wait for the image to load
        if (!imageRef.current.complete) {
          await new Promise((resolve) => {
            imageRef.current!.onload = resolve;
          });
        }

        // Get image dimensions
        const imgWidth = imageRef.current.width;
        const imgHeight = imageRef.current.height;
        
        // Set canvas dimensions to match the image
        canvasRef.current.width = imgWidth;
        canvasRef.current.height = imgHeight;
        
        // Store image stats
        setImageStats({
          width: imgWidth,
          height: imgHeight,
          aspectRatio: parseFloat((imgWidth / imgHeight).toFixed(2))
        });
        
        // Extract dominant colors
        extractDominantColors(imageRef.current);
        
        // Run object detection and classification in parallel
        const [detectionResults, classificationResults] = await Promise.all([
          objectDetectionModel.detect(imageRef.current),
          classificationModel.classify(imageRef.current)
        ]);
        
        setDetections(detectionResults);
        setClassifications(classificationResults);
        
        // Draw bounding boxes if detection tab is active
        if (activeTab === 'detection') {
          drawDetections(detectionResults);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error during image processing:', err);
        setError('Error processing the image. Please try again with a different image.');
        setLoading(false);
      }
    };

    processImage();
  }, [imageUrl, objectDetectionModel, classificationModel]);

  // Draw detections when tab changes
  useEffect(() => {
    if (activeTab === 'detection' && detections.length > 0 && canvasRef.current) {
      drawDetections(detections);
    } else if (activeTab === 'classification' && canvasRef.current) {
      // Clear canvas when switching to classification tab
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [activeTab, detections]);

  // Function to draw detection boxes
  const drawDetections = (predictions: Detection[]) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Generate a color palette for different object classes
    const colorMap: Record<string, string> = {};
    const baseColors = [
      '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
      '#00FFFF', '#FF8000', '#8000FF', '#0080FF', '#FF0080'
    ];
    
    // Draw each prediction box
    predictions.forEach((prediction, index) => {
      const [x, y, width, height] = prediction.bbox;
      const objectClass = prediction.class;
      
      // Assign a consistent color for each class
      if (!colorMap[objectClass]) {
        colorMap[objectClass] = baseColors[Object.keys(colorMap).length % baseColors.length];
      }
      const color = colorMap[objectClass];
      
      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);
      
      // Draw background for text
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x, y - 25, width, 25);
      ctx.globalAlpha = 1.0;
      
      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${objectClass} ${Math.round(prediction.score * 100)}%`,
        x + 5,
        y - 7
      );
    });
  };

  // Prepare chart data for classifications
  const chartData = {
    labels: classifications.map(c => c.className.split(',')[0]),
    datasets: [
      {
        label: 'Confidence',
        data: classifications.map(c => Math.round(c.probability * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Confidence (%)'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Image Classification Results'
      },
    },
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-sm text-gray-600">Processing image with AI models...</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'detection'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('detection')}
        >
          <div className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Object Detection
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'classification'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('classification')}
        >
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Image Classification
          </div>
        </button>
      </div>
      
      {/* Image and canvas container */}
      <div className="relative mb-6">
        <img 
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded"
          className="w-full h-auto rounded-lg"
          style={{ display: 'block' }}
        />
        <canvas 
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
      
      {/* Results section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main results panel */}
        <div className="md:col-span-2">
          {activeTab === 'detection' && detections.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium mb-3">Detected Objects:</h3>
              <ul className="space-y-2">
                {detections.map((detection, index) => (
                  <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      <span 
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}
                      ></span>
                      <span className="font-medium">{detection.class}</span>
                    </div>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {Math.round(detection.score * 100)}% confidence
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {activeTab === 'classification' && classifications.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-64">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
        
        {/* Image analysis panel */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Image Analysis</h3>
            
            {imageStats && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Dimensions</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Width:</span> {imageStats.width}px
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Height:</span> {imageStats.height}px
                  </div>
                  <div className="bg-gray-50 p-2 rounded col-span-2">
                    <span className="text-gray-500">Aspect Ratio:</span> {imageStats.aspectRatio}
                  </div>
                </div>
              </div>
            )}
            
            {dominantColors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Dominant Colors</h4>
                <div className="space-y-2">
                  {dominantColors.map((colorData, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-6 h-6 rounded mr-2" 
                        style={{ backgroundColor: colorData.color }}
                      ></div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${colorData.percentage}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">{colorData.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectDetection;