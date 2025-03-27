# ImageAI - Serverless Image Processing

![ImageAI Banner](https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=300&q=80)

![screencapture-verdant-cannoli-41d30c-netlify-app-2025-03-27-17_30_48](https://github.com/user-attachments/assets/a6064e19-c571-4615-bc83-dbb11fe51a19)

![screencapture-verdant-cannoli-41d30c-netlify-app-2025-03-27-17_31_03](https://github.com/user-attachments/assets/1bbf0566-0bda-4191-aa28-2b7f22f25c40)

## Overview

ImageAI is a modern, browser-based image processing application that leverages the power of TensorFlow.js to perform advanced AI analysis directly in your browser. No server uploads required - all processing happens locally, ensuring your images remain private.

## Features

### 🔍 Object Detection
- Identifies multiple objects within your images
- Draws accurate bounding boxes around detected objects
- Displays confidence scores for each detection
- Color-codes different object categories for easy visualization

### 🏷️ Image Classification
- Classifies the entire image content with detailed labels
- Provides confidence scores for top classifications
- Visualizes results with interactive bar charts

### 🎨 Color Analysis
- Extracts dominant colors from your images
- Displays color distribution percentages
- Provides visual representation of the color palette

### 📊 Image Statistics
- Analyzes image dimensions and aspect ratio
- Provides technical metadata about your images

### 🔒 Privacy-Focused
- All processing happens in your browser
- No images are uploaded to external servers
- Your data stays on your device

## Technologies Used

- **React**: Frontend UI framework
- **TypeScript**: Type-safe JavaScript
- **TensorFlow.js**: Machine learning in the browser
- **COCO-SSD Model**: Pre-trained object detection
- **MobileNet Model**: Pre-trained image classification
- **Chart.js**: Data visualization
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development environment

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/imageai.git
   cd imageai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Upload an Image**: Drag and drop an image onto the upload area or click to browse your files.
2. **View Results**: Once uploaded, the image will be automatically processed by the AI models.
3. **Explore Different Analyses**:
   - Switch between Object Detection and Classification tabs
   - View dominant colors and image statistics
   - Examine confidence scores for detections and classifications

## Deployment

This application is designed to be deployed as a static site on any hosting platform:

```bash
npm run build
```

The build output will be in the `dist` directory, which can be deployed to services like Netlify, Vercel, or GitHub Pages.

## Production Considerations

In a production environment, this application could be connected to cloud services like:

- **AWS Lambda**: For more complex image processing
- **Amazon S3**: For image storage
- **API Gateway**: For creating a scalable API
- **AWS Rekognition**: For additional AI capabilities

## Browser Compatibility

ImageAI works best in modern browsers that support WebGL and the latest JavaScript features:

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance Notes

- The initial load may take a few seconds as the TensorFlow.js models are downloaded
- Processing time depends on your device's capabilities and the image size
- For optimal performance, use images under 4MB

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TensorFlow.js team for making machine learning accessible in the browser
- The COCO dataset creators for the object detection training data
- MobileNet model creators for the classification capabilities

---

Made with ❤️ by ImageAI Team
