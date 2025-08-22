// Global variables
let cameraStream = null;
let isFullscreen = false;
let faceDetectionActive = false;

// DOM Elements
const startCameraBtn = document.getElementById('start-ar-camera');
const cameraFeed = document.getElementById('camera-feed');
const cameraCanvas = document.getElementById('camera-canvas');
const fullscreenBtn = document.getElementById('fullscreen-toggle');
const faceDetectionStatus = document.getElementById('face-detection-status');
const addToCalendar1 = document.getElementById('add-to-calendar-1');
const addToCalendar2 = document.getElementById('add-to-calendar-2');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeAnimations();
});

function initializeEventListeners() {
    // Camera functionality
    startCameraBtn.addEventListener('click', toggleCamera);
    
    // Fullscreen functionality
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Calendar events
    addToCalendar1.addEventListener('click', () => addToCalendar('2025-09-03', 'YCCC VR Lab Info Session 1'));
    addToCalendar2.addEventListener('click', () => addToCalendar('2025-09-04', 'YCCC VR Lab Info Session 2'));
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Camera functionality
async function toggleCamera() {
    if (!cameraStream) {
        await startCamera();
    } else {
        stopCamera();
    }
}

async function startCamera() {
    try {
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'environment' // Use back camera on mobile
            },
            audio: false
        });
        
        // Display camera feed
        cameraFeed.srcObject = cameraStream;
        cameraFeed.style.display = 'block';
        cameraCanvas.style.display = 'block';
        
        // Update button text
        startCameraBtn.textContent = 'Stop AR Camera';
        startCameraBtn.classList.add('pulse');
        
        // Initialize face detection
        initializeFaceDetection();
        
        // Start AR overlay
        startAROverlay();
        
        // Start OCR detection simulation
        setTimeout(simulateOCRDetection, 2000);
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Could not access camera. Please ensure you have given permission and are using HTTPS.');
    }
}

function stopCamera() {
    if (cameraStream) {
        // Stop all tracks
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        
        // Hide camera elements
        cameraFeed.style.display = 'none';
        cameraCanvas.style.display = 'none';
        faceDetectionStatus.style.display = 'none';
        
        // Update button
        startCameraBtn.textContent = 'Start AR Camera';
        startCameraBtn.classList.remove('pulse');
        
        faceDetectionActive = false;
    }
}

// Face detection (placeholder - would need face-api.js or similar library)
function initializeFaceDetection() {
    faceDetectionActive = true;
    faceDetectionStatus.style.display = 'block';
    faceDetectionStatus.textContent = 'Face detection active - Point camera at your face!';
    
    // Simulate face detection (replace with actual face detection library)
    setTimeout(() => {
        if (faceDetectionActive) {
            faceDetectionStatus.textContent = 'Face detected! Welcome to the Hawkverse! 🚀';
            faceDetectionStatus.style.background = 'rgba(0, 255, 0, 0.2)';
            faceDetectionStatus.style.borderColor = '#00ff00';
        }
    }, 3000);
}

// AR Overlay functionality
function startAROverlay() {
    const canvas = cameraCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = cameraFeed.videoWidth || 640;
    canvas.height = cameraFeed.videoHeight || 480;
    
    function drawAROverlay() {
        if (!faceDetectionActive) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw AR elements (example: YCCC logo overlay)
        ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.font = '24px Arial';
        ctx.fillText('YCCC VR Lab', 20, 40);
        
        // Draw scanning effect
        const time = Date.now() * 0.001;
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.5 + 0.5 * Math.sin(time * 2)})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        // Draw crosshair for AR targeting
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 20, centerY);
        ctx.lineTo(centerX + 20, centerY);
        ctx.moveTo(centerX, centerY - 20);
        ctx.lineTo(centerX, centerY + 20);
        ctx.stroke();
        
        // Continue animation
        requestAnimationFrame(drawAROverlay);
    }
    
    // Start AR overlay animation
    drawAROverlay();
}

// Fullscreen functionality
function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

function enterFullscreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
    
    isFullscreen = true;
    fullscreenBtn.textContent = 'Exit Fullscreen';
    document.body.classList.add('fullscreen');
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    
    isFullscreen = false;
    fullscreenBtn.textContent = 'Toggle Fullscreen';
    document.body.classList.remove('fullscreen');
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        isFullscreen = false;
        fullscreenBtn.textContent = 'Toggle Fullscreen';
        document.body.classList.remove('fullscreen');
    }
}

// Calendar functionality
function addToCalendar(date, title) {
    const startDate = new Date(date + 'T12:00:00');
    const endDate = new Date(date + 'T13:30:00');
    
    // Format dates for calendar
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    // Create calendar URL (Google Calendar)
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('YCCC VR Lab Info Session - Room 112, Wells Campus')}&location=${encodeURIComponent('Room 112, Wells Campus, YCCC')}`;
    
    // Open calendar
    window.open(calendarUrl, '_blank');
}

// Initialize animations
function initializeAnimations() {
    // Add intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// OCR Detection simulation (placeholder)
function simulateOCRDetection() {
    // This would integrate with an OCR library like Tesseract.js
    // For now, it's a simulation
    if (faceDetectionActive) {
        setTimeout(() => {
            if (faceDetectionActive) {
                faceDetectionStatus.textContent = 'Scanning for Room 112 sign... 🔍';
                faceDetectionStatus.style.background = 'rgba(255, 255, 0, 0.2)';
                faceDetectionStatus.style.borderColor = '#ffff00';
            }
        }, 2000);
        
        setTimeout(() => {
            if (faceDetectionActive) {
                faceDetectionStatus.textContent = 'Room 112 sign detected! Welcome to the VR Lab! 🎯';
                faceDetectionStatus.style.background = 'rgba(255, 0, 255, 0.2)';
                faceDetectionStatus.style.borderColor = '#ff00ff';
            }
        }, 5000);
    }
}

// Advanced face detection (placeholder for future implementation)
// To implement real face detection, you would need to include face-api.js:
// <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
/*
async function loadFaceDetectionModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

async function detectFaces() {
    const detections = await faceapi.detectAllFaces(cameraFeed, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
    
    if (detections.length > 0) {
        faceDetectionStatus.textContent = `${detections.length} face(s) detected!`;
        // Draw face detection boxes on canvas
        const displaySize = { width: cameraFeed.width, height: cameraFeed.height };
        faceapi.draw.drawDetections(cameraCanvas, detections);
        faceapi.draw.drawFaceLandmarks(cameraCanvas, detections);
    }
}
*/

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // F key for fullscreen
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    // C key for camera
    if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        toggleCamera();
    }
    
    // Escape key to exit fullscreen
    if (e.key === 'Escape') {
        if (isFullscreen) {
            exitFullscreen();
        }
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe up to enter fullscreen
    if (deltaY < -100 && Math.abs(deltaX) < 50) {
        if (!isFullscreen) {
            enterFullscreen();
        }
    }
    
    // Swipe down to exit fullscreen
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
        if (isFullscreen) {
            exitFullscreen();
        }
    }
});