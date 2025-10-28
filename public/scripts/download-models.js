const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream, existsSync, mkdirSync } = require('fs');

// Define the model files needed for face-api.js
const models = {
  tinyFaceDetector: [
    'tiny_face_detector_model-shard1',
    'tiny_face_detector_model-weights_manifest.json'
  ],
  faceExpressionNet: [
    'face_expression_model-shard1',
    'face_expression_model-weights_manifest.json'
  ],
  faceLandmark68Net: [
    'face_landmark_68_model-shard1',
    'face_landmark_68_model-weights_manifest.json'
  ]
};

// Base URL for face-api.js models
const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// Local directory to save models
const targetDir = path.join(__dirname, '..', 'models');

// Ensure the target directory exists
if (!existsSync(targetDir)) {
  console.log(`Creating models directory at: ${targetDir}`);
  mkdirSync(targetDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${url}`);
    
    const file = createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download, status code: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destination}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Main function to download all models
async function downloadModels() {
  console.log('Starting download of face-api.js models...');
  
  try {
    const downloads = [];
    
    // Create download promises for each model file
    for (const [modelName, files] of Object.entries(models)) {
      for (const file of files) {
        const url = `${baseUrl}/${modelName}/${file}`;
        const destination = path.join(targetDir, `${file}`);
        
        // Skip if file already exists
        if (existsSync(destination)) {
          console.log(`File already exists, skipping: ${destination}`);
          continue;
        }
        
        downloads.push(downloadFile(url, destination));
      }
    }
    
    // Wait for all downloads to complete
    await Promise.all(downloads);
    
    console.log('All models downloaded successfully!');
    console.log(`Models saved to: ${targetDir}`);
  } catch (error) {
    console.error('Error downloading models:', error);
    process.exit(1);
  }
}

// Run the download
downloadModels(); 