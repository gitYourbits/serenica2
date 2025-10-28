import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import styles from '../assets/styles/moodDetector.module.css';
import Webcam from 'react-webcam';

function MoodDetector() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const containerRef = useRef();
  const location = useLocation();
  
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [lastMoodChange, setLastMoodChange] = useState(Date.now());
  const [moodHistory, setMoodHistory] = useState([]);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [modelError, setModelError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("initializing");
  const [debugMode, setDebugMode] = useState(false);
  const webcamRef = useRef();
  const detectionIntervalRef = useRef();
  const [detectionStatus, setDetectionStatus] = useState({ detecting: false, message: '' });
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
  const [tfErrorCount, setTfErrorCount] = useState(0);
  const [hasDetectedExpression, setHasDetectedExpression] = useState(false);

  // Check for WebGL support on mount
  useEffect(() => {
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };
    
    const webGLSupport = checkWebGL();
    setHasWebGL(webGLSupport);
    
    if (!webGLSupport) {
      setModelError('WebGL not supported - Mood detection is not available');
    }
  }, []);

  // Handle route changes - stop camera when navigating away
  useEffect(() => {
    // Reset detection state when location changes (e.g., navigating back to home)
    if (location.pathname === '/') {
      setHasDetectedExpression(false);
    }

    return () => {
      console.log('Route changed, stopping camera');
      stopVideo();
    };
  }, [location.pathname]);

  // Request camera permission explicitly
  const requestCameraPermission = useCallback(async () => {
    try {
      setLoadingStatus("accessing_camera");
      setDetectionStatus({ detecting: false, message: "Requesting camera access..." });
      
      console.log("Explicitly requesting camera permission");
      // This explicit call should trigger the browser permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user'
        },
        audio: false
      });
      
      // If we get here, permission was granted
      setIsCameraPermissionGranted(true);
      
      // Clean up this test stream right away
      stream.getTracks().forEach(track => track.stop());
      
      setLoadingStatus("starting_camera");
      console.log("Camera permission granted, starting webcam");
      
      // Set a short delay to ensure the permission state is updated
      setTimeout(() => {
        setIsDetecting(true);
      }, 500);
      
      return true;
    } catch (error) {
      console.error("Camera permission error:", error);
      setModelError(`Camera access denied: ${error.message}`);
      setLoadingStatus("error");
      setDetectionStatus({ 
        detecting: false, 
        message: "Camera permission denied. Please allow camera access and reload." 
      });
      toast.error(
        <div>
          Camera permission denied. Please:
          <br />1. Check browser permissions
          <br />2. Reload the page
          <br />3. Allow camera access when prompted
        </div>, 
        { autoClose: false }
      );
      return false;
    }
  }, []);

  // Initialize TensorFlow.js and set backend
  useEffect(() => {
    const setupTensorFlow = async () => {
      try {
        console.log("Setting up facial detection...");
        
        if (hasWebGL) {
          setLoadingStatus("loading_models");
          loadModels();
        }
      } catch (err) {
        console.error("Error initializing facial detection:", err);
        setModelError(`Initialization error: ${err.message}`);
        setLoadingStatus("error");
        toast.error('Failed to initialize machine learning backend. Please try a different browser.');
      }
    };
    
    setupTensorFlow();
    
    return () => {
      stopVideo();
    };
  }, [hasWebGL]);

  // Handle dragging
  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on buttons or links
    if (e.target.closest(`.${styles.minimizeButton}`) || 
        e.target.closest(`.${styles.pipButton}`) || 
        e.target.closest(`.${styles.chatbotLink}`)) {
      return;
    }
    
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    // Add event listeners to window to track mouse movement even if it leaves the component
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep within viewport bounds
    const maxX = window.innerWidth - (containerRef.current?.offsetWidth || 320);
    const maxY = window.innerHeight - (containerRef.current?.offsetHeight || 300);
    
    setPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Remove event listeners when done dragging
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const loadModels = useCallback(async () => {
    setIsModelLoaded(false);
    setModelError(null);
    setLoadingStatus("loading_models");
    console.log("Starting to load models...");
    
    try {
      const MODEL_URL = `${window.location.origin}/models`;
      console.log("Model URL:", MODEL_URL);
      
      // Load models one by one for better error handling
      try {
        console.log("Loading tiny face detector...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        
        console.log("Loading face landmark model...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        
        console.log("Loading face expression model...");
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      } catch (err) {
        console.error("Error loading specific model:", err);
        throw err;
      }
      
      console.log("Models loaded successfully!");
      setIsModelLoaded(true);
      
      // Request camera permission after models are loaded
      const permissionGranted = await requestCameraPermission();
      if (permissionGranted) {
        setLoadingStatus("starting_camera");
      }
    } catch (err) {
      console.error("Error loading models:", err);
      setModelError(`Failed to load models: ${err.message}`);
      setLoadingStatus("error");
      toast.error('Failed to load facial detection models. Please refresh the page to try again.');
    }
  }, [requestCameraPermission]);

  const startVideo = async () => {
    if (cameraActive) {
      console.log('[DEBUG] Camera already active, not starting again');
      return;
    }
    
    try {
      console.log('[DEBUG] Starting video capture...');
      setLoadingStatus("accessing_camera");
      
      console.log('[DEBUG] Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user'
        } 
      });
      
      console.log('[DEBUG] Camera access granted, stream created');
      
      if (videoRef.current) {
        console.log('[DEBUG] Setting video source to stream');
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log('[DEBUG] Video metadata loaded, starting playback');
          // Force play
          videoRef.current.play().then(() => {
            console.log('[DEBUG] Video playback started successfully');
            setCameraActive(true);
            setIsDetecting(true);
            setLoadingStatus("detecting");
            console.log('[DEBUG] Starting mood detection');
            detectMood();
          }).catch(playError => {
            console.error('[DEBUG] Error playing video:', playError);
          });
        };
        
        videoRef.current.onerror = (e) => {
          console.error('[DEBUG] Video element error:', e);
        };
      } else {
        console.error('[DEBUG] Video ref is null');
      }
    } catch (error) {
      console.error('[DEBUG] Error accessing camera:', error);
      console.error('[DEBUG] Error details:', error.message, error.stack);
      setModelError(`Camera access error: ${error.message}`);
      setLoadingStatus("error");
      toast.error('Failed to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopVideo = useCallback(() => {
    if (document.pictureInPictureElement === videoRef.current) {
      try {
        document.exitPictureInPicture();
      } catch (error) {
        console.error('Error exiting picture-in-picture:', error);
      }
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsDetecting(false);
      setCameraActive(false);
      console.log('Video stopped');
    }
  }, []);

  const detectMood = async () => {
    if (!isModelLoaded) {
      console.log('[DEBUG] Models not loaded, cannot detect mood');
      requestAnimationFrame(detectMood);
      return;
    }
    
    if (!isDetecting) {
      console.log('[DEBUG] Detection paused');
      return;
    }
    
    if (!videoRef.current || !canvasRef.current) {
      console.log('[DEBUG] Video or canvas ref is null');
      requestAnimationFrame(detectMood);
      return;
    }

    try {
      // Debug video element state
      const videoEl = videoRef.current;
      console.log('[DEBUG] Video state:', {
        paused: videoEl.paused,
        ended: videoEl.ended,
        readyState: videoEl.readyState,
        width: videoEl.videoWidth,
        height: videoEl.videoHeight,
        currentTime: videoEl.currentTime
      });
      
      // Make sure video is actually playing and has dimensions
      if (videoEl.paused || videoEl.ended || 
          videoEl.videoWidth === 0 || videoEl.videoHeight === 0 ||
          videoEl.readyState < 2) { // HAVE_CURRENT_DATA
        console.log('[DEBUG] Video not ready yet');
        requestAnimationFrame(detectMood);
        return;
      }

      console.log('[DEBUG] Attempting face detection on video frame');
      
      // Use a much lower score threshold for better detection
      const options = new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 128,  // Increased from 96 to 128 for better detection
        scoreThreshold: 0.2  // Much lower threshold to detect faces more easily
      });

      try {
        // Detect faces with expressions
        const detections = await faceapi.detectAllFaces(
          videoEl,
          options
        ).withFaceExpressions();

        console.log('[DEBUG] Detection result:', detections && detections.length > 0 ? 'Face detected' : 'No face detected');

        if (detections && detections.length > 0) {
          // Log detected face for debugging
          console.log('[DEBUG] Face detected:', detections[0]);
          
          const expressions = detections[0].expressions;
          
          // Log all expression scores for debugging
          console.log('[DEBUG] Expression scores:', JSON.stringify(expressions));
          
          // Find dominant emotion with highest confidence score
          const dominantEmotion = Object.entries(expressions).reduce((a, b) => 
            a[1] > b[1] ? a : b
          )[0];

          const confidence = expressions[dominantEmotion];
          console.log('[DEBUG] Dominant emotion:', dominantEmotion, 'with confidence:', confidence);

          // Lower threshold for mood updates to ensure something happens
          const now = Date.now();
          const significantChange = dominantEmotion !== currentMood && confidence > 0.3;
          const timeThresholdPassed = now - lastMoodChange > 5000;
          
          if (significantChange || timeThresholdPassed) {
            console.log(`[DEBUG] Updating mood to ${dominantEmotion} (confidence: ${confidence.toFixed(2)})`);
            setCurrentMood(dominantEmotion);
            setLastMoodChange(now);
            
            // Add to mood history
            setMoodHistory(prev => [...prev, { 
              mood: dominantEmotion, 
              confidence,
              timestamp: now 
            }].slice(-5));
            
            // Show appropriate message based on emotion if confidence is sufficient
            if (confidence > 0.3) {  // Lower this threshold too
              console.log('[DEBUG] Confidence sufficient for suggestion, showing message');
              showMoodMessage(dominantEmotion, confidence);
            } else {
              console.log('[DEBUG] Confidence too low for suggestion:', confidence);
            }
          } else {
            console.log('[DEBUG] No significant mood change detected');
          }

          // Draw the detections on the canvas
          const canvas = canvasRef.current;
          const displaySize = { 
            width: videoEl.videoWidth, 
            height: videoEl.videoHeight 
          };
          
          // Match dimensions only if canvas exists
          if (canvas) {
            console.log('[DEBUG] Drawing detection results on canvas');
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw detections and expressions with low minConfidence for visualization
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.01);  // Ultra low threshold for drawing
          }
        } else {
          console.log('[DEBUG] No faces detected in current frame');
          // No face detected, clear canvas
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
          
          // If no face detected for a while, reset current mood
          const now = Date.now();
          if (currentMood && now - lastMoodChange > 15000) {
            console.log('[DEBUG] No face detected for a while, resetting mood');
            setCurrentMood(null);
          }
        }
      } catch (detectionError) {
        console.error('[DEBUG] Specific detection error:', detectionError);
      }
    } catch (error) {
      console.error('[DEBUG] Error during mood detection:', error);
      console.error('[DEBUG] Error details:', error.message, error.stack);
    }

    // Continue detection if still active
    if (isDetecting) {
      requestAnimationFrame(detectMood);
    } else {
      console.log('[DEBUG] Mood detection stopped');
    }
  };

  const showMoodMessage = (mood, confidence) => {
    console.log('[DEBUG] showMoodMessage called for mood:', mood, 'confidence:', confidence);
    
    let message = '';
    let chatbotLink = '';
    
    // Only show suggestions if confidence is reasonable
    // Using a lower threshold to ensure suggestions appear
    if (confidence < 0.35) {
      console.log('[DEBUG] Mood confidence too low for suggestions:', confidence);
      return;
    }
    
    switch (mood) {
      case 'sad':
        message = 'I notice you seem sad. Our Cognitive Behavior Therapy chatbot can help you process these feelings.';
        chatbotLink = '/cbtchat';
        break;
      case 'angry':
        message = 'You appear to be feeling angry. Our Mindfulness chatbot can help you find calm and balance.';
        chatbotLink = '/mindchat';
        break;
      case 'disgusted':
        message = 'You seem to be feeling uneasy. Our Career Coach can help you focus on positive aspects and goals.';
        chatbotLink = '/careerchat';
        break;
      case 'fearful':
        message = 'I notice you might be feeling anxious. Our CBT chatbot can help you manage these feelings.';
        chatbotLink = '/cbtchat';
        break;
      case 'neutral':
        message = 'You seem calm. Would you like to explore personal growth with our Career Coach?';
        chatbotLink = '/careerchat';
        break;
      case 'surprised':
        message = 'You seem surprised. Our Mindfulness chatbot can help you process and understand this feeling.';
        chatbotLink = '/mindchat';
        break;
      case 'happy':
        message = 'Great to see you in good spirits! 😊 Maintain this positive energy with our Career Coach.';
        chatbotLink = '/careerchat';
        break;
      default:
        message = 'I notice your mood. Would you like to talk about it with one of our AI therapists?';
        chatbotLink = '/cbtchat';
    }

    // Don't check previous mood to ensure more suggestions appear
    console.log('[DEBUG] Showing mood message for:', mood, 'with message:', message);
    
    // Force toast to be visible by using a unique ID
    const toastId = `mood-${mood}-${Date.now()}`;
    
    if (chatbotLink) {
      console.log('[DEBUG] Showing toast with chatbot link');
      toast.info(
        <div>
          {message}
          <br />
          <Link to={chatbotLink} className={styles.chatbotLink}>
            Click here to chat with our AI
          </Link>
        </div>,
        {
          toastId: toastId,
          autoClose: 15000,
          closeOnClick: true,
          draggable: true,
          position: "bottom-right",
        }
      );
    } else {
      console.log('[DEBUG] Showing simple toast without link');
      toast.success(message, {
        toastId: toastId,
        autoClose: 5000,
        position: "bottom-right",
      });
    }
    
    console.log('[DEBUG] Toast notification triggered');
  };

  const toggleMinimize = (e) => {
    e.stopPropagation(); // Prevent dragging when clicking the button
    
    // If we're unminimizing, make sure video is started
    if (isMinimized && !cameraActive && isModelLoaded) {
      console.log('Unminimizing, restarting video');
      startVideo();
    }
    
    setIsMinimized(!isMinimized);
  };

  const togglePictureInPicture = async (e) => {
    e.stopPropagation(); // Prevent dragging when clicking the button
    
    if (document.pictureInPictureEnabled) {
      if (isPictureInPicture) {
        try {
          await document.exitPictureInPicture();
          setIsPictureInPicture(false);
        } catch (error) {
          console.error('Error exiting picture-in-picture:', error);
        }
      } else {
        try {
          // Make sure video is playing before requesting PiP
          if (videoRef.current && !videoRef.current.paused) {
            await videoRef.current.requestPictureInPicture();
            setIsPictureInPicture(true);
          } else {
            console.log('Video must be playing to enter PiP');
            if (!cameraActive) {
              await startVideo();
              // Wait a bit for video to start before trying PiP
              setTimeout(async () => {
                if (videoRef.current) {
                  await videoRef.current.requestPictureInPicture();
                  setIsPictureInPicture(true);
                }
              }, 1000);
            }
          }
        } catch (error) {
          console.error('Error entering picture-in-picture:', error);
        }
      }
    } else {
      toast.info('Picture-in-Picture is not supported in your browser');
    }
  };

  // Listen for picture-in-picture changes
  useEffect(() => {
    const handlePiPChange = () => {
      setIsPictureInPicture(document.pictureInPictureElement === videoRef.current);
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('enterpictureinpicture', handlePiPChange);
      videoRef.current.addEventListener('leavepictureinpicture', handlePiPChange);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('enterpictureinpicture', handlePiPChange);
        videoRef.current.removeEventListener('leavepictureinpicture', handlePiPChange);
      }
    };
  }, [isModelLoaded]);

  const renderLoadingStatus = () => {
    switch(loadingStatus) {
      case "loading_models":
        return "Loading facial detection models...";
      case "accessing_camera":
        return "Requesting camera access...";
      case "starting_camera":
        return "Starting camera...";
      case "detecting":
        return "Analyzing facial expressions...";
      case "error":
        return "Error: " + modelError;
      default:
        return "Initializing...";
    }
  };

  const handlePlay = useCallback(async () => {
    if (!webcamRef.current || !isModelLoaded) {
      console.log("Webcam not ready or models not loaded yet");
      return;
    }

    console.log("Webcam is now playing, starting face detection");
    setIsCameraPermissionGranted(true);
    setCameraActive(true);
    setLoadingStatus("detecting");
    setDetectionStatus({ detecting: true, message: "Analyzing facial expressions..." });

    // Flag to prevent concurrent detection runs
    let isDetectionInProgress = false;
    
    const detectFaces = async () => {
      if (!webcamRef.current || !isModelLoaded || !webcamRef.current.video) {
        return;
      }

      if (!isDetecting || webcamRef.current.video.paused || webcamRef.current.video.ended) {
        return;
      }
      
      // Skip this frame if we're still processing the previous one
      if (isDetectionInProgress) {
        console.log("Skipping frame - detection still in progress");
        if (isDetecting) {
          detectionIntervalRef.current = setTimeout(detectFaces, 100);
        }
        return;
      }
      
      // Mark detection as in progress to prevent parallel processing
      isDetectionInProgress = true;

      try {
        const video = webcamRef.current.video;
        
        // Create the canvas if it doesn't exist
        let canvas = canvasRef.current;
        if (!canvas) {
          console.log("Canvas ref is not available");
          isDetectionInProgress = false;
          return;
        }

        // Set canvas dimensions to match video
        const displaySize = {
          width: video.videoWidth || 640,
          height: video.videoHeight || 480
        };
        
        // Make sure we have valid dimensions
        if (displaySize.width === 0 || displaySize.height === 0) {
          console.log("Video dimensions not available yet");
          isDetectionInProgress = false;
          setTimeout(detectFaces, 100);
          return;
        }
        
        console.log("Video dimensions:", displaySize.width, "x", displaySize.height);
        faceapi.matchDimensions(canvas, displaySize);

        // Use extremely sensitive detection settings with larger input size
        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 160,  // Increased from 96 to 160 for better detection
          scoreThreshold: 0.1  // Very low threshold to detect faces more easily
        });

        try {
          // Step 1: Detect face only (simpler operation)
          console.log("Running face detection...");
          let faceDetection = null;
          
          // Use try/finally pattern to ensure tensor cleanup
          try {
            faceDetection = await faceapi.detectSingleFace(video, options);
          } catch (e) {
            console.error("Initial face detection failed:", e);
          }
          
          if (!faceDetection) {
            console.log("No face detected");
            setDetectionStatus({
              detecting: true,
              message: "No face detected. Please face the camera directly in good lighting."
            });
            
            // Clear canvas when no face detected
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            
            // Reset detection in progress flag
            isDetectionInProgress = false;
            
            // Continue the detection loop
            if (isDetecting) {
              if (detectionIntervalRef.current) {
                clearTimeout(detectionIntervalRef.current);
              }
              detectionIntervalRef.current = setTimeout(detectFaces, 150); // Slower rate when no face
            }
            return;
          }
          
          // Step 2: Now try to get expressions in a separate operation
          console.log("Face detected, getting expressions...");
          
          let fullDetection = null;
          try {
            // Use a separate detection for expressions to isolate potential errors
            fullDetection = await faceapi
              .detectSingleFace(video, options)
              .withFaceLandmarks()
              .withFaceExpressions();
          } catch (expressionError) {
            console.error("Expression detection failed:", expressionError);
            
            // We still have the basic face detection, so show that at least
            setDetectionStatus({
              detecting: true,
              message: "Face detected, but emotion analysis failed."
            });
            
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Just draw the face detection box
            const resizedDetection = faceapi.resizeResults(faceDetection, displaySize);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#FF0000';
            faceapi.draw.drawDetections(canvas, [resizedDetection]);
            
            // Reset detection in progress flag and continue
            isDetectionInProgress = false;
            
            // Continue the detection loop
            if (isDetecting) {
              if (detectionIntervalRef.current) {
                clearTimeout(detectionIntervalRef.current);
              }
              detectionIntervalRef.current = setTimeout(detectFaces, 200);
            }
            return;
          }
          
          if (fullDetection) {
            // Draw detections on canvas
            const resizedDetection = faceapi.resizeResults(fullDetection, displaySize);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw with more visible styling
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#FF0000';
            faceapi.draw.drawDetections(canvas, [resizedDetection]);
            
            try {
              // Try drawing landmarks and expressions, but catch any rendering errors
              faceapi.draw.drawFaceLandmarks(canvas, [resizedDetection]);
              faceapi.draw.drawFaceExpressions(canvas, [resizedDetection], 0.05);
            } catch (renderError) {
              console.warn("Error drawing facial details:", renderError);
            }
            
            // Process expressions
            const expressions = fullDetection.expressions;
            
            // Find the emotion with the highest score
            let dominantEmotion = null;
            let highestScore = 0;
            
            Object.entries(expressions).forEach(([emotion, score]) => {
              if (score > highestScore) {
                highestScore = score;
                dominantEmotion = emotion;
              }
            });
            
            console.log("Dominant emotion:", dominantEmotion, "Score:", highestScore);
            
            // Lower threshold for emotion detection
            if (dominantEmotion && highestScore > 0.3) {
              // Map to our defined moods
              let detectedMood;
              if (dominantEmotion === 'happy' || dominantEmotion === 'surprised') {
                detectedMood = 'happy';
              } else if (dominantEmotion === 'sad' || dominantEmotion === 'fearful') {
                detectedMood = 'sad';
              } else if (dominantEmotion === 'angry' || dominantEmotion === 'disgusted') {
                detectedMood = 'angry';
              } else {
                detectedMood = 'neutral';
              }
              
              setCurrentMood(detectedMood);
              setLastMoodChange(Date.now());
              
              // Show the mood message
              showMoodMessage(dominantEmotion, highestScore);
              
              // COMPLETELY STOP EVERYTHING
              console.log("First expression detected, completely stopping component");
              setHasDetectedExpression(true);
              
              // Stop video/camera immediately
              stopVideo();
              
              // Stop detection loop
              if (detectionIntervalRef.current) {
                clearTimeout(detectionIntervalRef.current);
                detectionIntervalRef.current = null;
              }
              
              // Set final status message
              setDetectionStatus({
                detecting: false,
                message: `Detected mood: ${detectedMood} - Detection complete`
              });
              
              // Inform user
              toast.info(
                "Mood detected! Component disabled until next page visit.",
                { autoClose: 3000, position: "bottom-right" }
              );
              
              // Exit function immediately
              return;
            } else {
              setDetectionStatus({
                detecting: true,
                message: `Face detected, confidence: ${highestScore.toFixed(2)}`
              });
            }
          } else {
            console.log("Face detected but couldn't get expressions");
            setDetectionStatus({
              detecting: true,
              message: "Face detected, but couldn't analyze emotions. Please try different lighting."
            });
          }
        } catch (tfError) {
          console.error("TensorFlow backend error:", tfError);
          setDetectionStatus({
            detecting: true,
            message: "Detection engine error. Please try again."
          });
        }
      } catch (err) {
        console.error("Error in face detection:", err);
        setDetectionStatus({
          detecting: false,
          message: `Error during detection. Please try again.`
        });
      } finally {
        // Always reset the detection in progress flag when done
        isDetectionInProgress = false;
      }

      // Continue detection loop with interval adjusted based on error count
      if (isDetecting && !hasDetectedExpression) {
        if (detectionIntervalRef.current) {
          clearTimeout(detectionIntervalRef.current);
        }
        
        // Use a consistent interval
        detectionIntervalRef.current = setTimeout(detectFaces, 150);
      } else if (hasDetectedExpression) {
        // Stop detection loop but keep camera active for visual feedback
        console.log("Detection complete - waiting for reactivation");
      }
    };

    // Start the detection loop
    setIsDetecting(true);
    detectFaces();
    
    // Clean up function
    return () => {
      if (detectionIntervalRef.current) {
        clearTimeout(detectionIntervalRef.current);
      }
    };
  }, [webcamRef, canvasRef, isModelLoaded, isDetecting, currentMood, lastMoodChange, showMoodMessage, hasDetectedExpression]);

  return (
    <div 
      ref={containerRef}
      className={`${styles.moodDetectorContainer} ${isMinimized ? styles.minimized : ''}`}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'move'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.header}>
        <h2>Mood Detection</h2>
        <div className={styles.headerButtons}>
          {!isMinimized && document.pictureInPictureEnabled && cameraActive && hasWebGL && (
            <button 
              onClick={togglePictureInPicture} 
              className={styles.pipButton}
              aria-label={isPictureInPicture ? "Exit picture-in-picture" : "Enter picture-in-picture"}
            >
              {isPictureInPicture ? '⛶' : '⛶'}
            </button>
          )}
          <button 
            onClick={toggleMinimize} 
            className={styles.minimizeButton}
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? '🔍' : '−'}
          </button>
        </div>
      </div>
      
      {!isMinimized && !modelError && hasWebGL && (
        <div className={styles.videoContainer}>
          {isCameraPermissionGranted ? (
            <>
              <Webcam
                ref={webcamRef}
                className={styles.webcam}
                mirrored={true}
                screenshotFormat="image/jpeg"
                width={1024}
                height={768}
                videoConstraints={{
                  width: 1024,
                  height: 768,
                  facingMode: "user",
                  frameRate: 30
                }}
                onPlay={handlePlay}
                audio={false}
              />
            </>
          ) : (
            <div className={styles.cameraPermissionContainer}>
              <p>Camera access is required for mood detection.</p>
              <button 
                onClick={requestCameraPermission}
                className={styles.permissionButton}
              >
                Enable Camera
              </button>
            </div>
          )}
          <canvas ref={canvasRef} className={styles.canvas} />
          {!cameraActive && (
            <div className={styles.cameraStatus}>
              <p>{renderLoadingStatus()}</p>
            </div>
          )}
          {currentMood && cameraActive && (
            <div className={styles.moodIndicator}>
              <span>Current Mood: {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)}</span>
            </div>
          )}
        </div>
      )}
      
      {!isMinimized && (modelError || !hasWebGL) && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            {modelError || 'WebGL not supported. Mood detection requires WebGL.'}
          </p>
          <p className={styles.errorHint}>
            Try using a different browser or device.
          </p>
        </div>
      )}
      
      {isMinimized && (
        <div className={styles.minimizedContent}>
          <p>
            {modelError ? 'Mood Detection Unavailable' : 
             !hasWebGL ? `Mood: ${currentMood ? currentMood.charAt(0).toUpperCase() + currentMood.slice(1) : 'Not set'} (Manual)` :
             `Mood: ${currentMood ? currentMood.charAt(0).toUpperCase() + currentMood.slice(1) : 'Analyzing...'}`
            }
          </p>
        </div>
      )}
      
      {detectionStatus.detecting && (
        <div className={styles.detectionStatus}>
          {detectionStatus.message}
        </div>
      )}
    </div>
  );
}

export default MoodDetector; 