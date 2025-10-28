import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// URLs for the face-api.js models
const MODEL_URLS = {
  faceDetection: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
  faceDetectionBin: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1',
  faceExpression: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json',
  faceExpressionBin: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1',
  faceLandmark: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
  faceLandmarkBin: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1'
};

// Directory to save models to
const MODELS_DIR = path.join(process.cwd(), 'public', 'models');

// Ensure models directory exists
function ensureDir(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Download a file from a URL
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });
    }).on('error', (error) => {
      fs.unlink(outputPath, () => {}); // Delete the file if an error occurs
      reject(error);
    });
  });
}

// Download all models
async function downloadModels() {
  try {
    ensureDir(MODELS_DIR);
    
    // Download model manifests
    await downloadFile(MODEL_URLS.faceDetection, path.join(MODELS_DIR, 'tiny_face_detector_model-weights_manifest.json'));
    await downloadFile(MODEL_URLS.faceExpression, path.join(MODELS_DIR, 'face_expression_model-weights_manifest.json'));
    await downloadFile(MODEL_URLS.faceLandmark, path.join(MODELS_DIR, 'face_landmark_68_model-weights_manifest.json'));
    
    // Download model binaries
    await downloadFile(MODEL_URLS.faceDetectionBin, path.join(MODELS_DIR, 'tiny_face_detector_model-shard1'));
    await downloadFile(MODEL_URLS.faceExpressionBin, path.join(MODELS_DIR, 'face_expression_model-shard1'));
    await downloadFile(MODEL_URLS.faceLandmarkBin, path.join(MODELS_DIR, 'face_landmark_68_model-shard1'));
    
    console.log('All models downloaded successfully!');
  } catch (error) {
    console.error('Error downloading models:', error);
    process.exit(1);
  }
}

// Run download process
downloadModels(); 