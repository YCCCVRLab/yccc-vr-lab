// Global variables
let cameraStream = null;
let isFullscreen = false;
let arActive = false;
let faceDetectionActive = false;

// DOM Elements
let enterBtn, startArBtn, fullscreenBtn, cameraFeed, arCanvas, arStatus;
let addSession1, addSession2, hearFromUs, talkToUs;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    startLandingAnimations();
});

function initializeElements() {
    // Landing page elements
    enterBtn = document.getElementById('enter-hawkverse');
    
    // Main website elements
    startArBtn = document.getElementById('start-ar');
    fullscreenBtn = document.getElementById('toggle-fullscreen');
    cameraFeed = document.getElementById('camera-feed');
    arCanvas = document.getElementById('ar-canvas');
    arStatus = document.getElementById('ar-status');
    addSession1 = document.getElementById('add-session-1');
    addSession2 = document.getElementById('add-session-2');
    hearFromUs = document.getElementById('hear-from-us');
    talkToUs = document.getElementById('talk-to-us');
}

function initializeEventListeners() {
    // Landing page transition
    if (enterBtn) {
        enterBtn.addEventListener('click', enterMainWebsite);
    }
    
    // AR functionality
    if (startArBtn) {
        startArBtn.addEventListener('click', toggleAR);
    }
    
    // Fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Calendar events
    if (addSession1) {
        addSession1.addEventListener('click', () => addToCalendar('2025-09-03', 'YCCC VR Lab Info Session 1'));
    }
    if (addSession2) {
        addSession2.addEventListener('click', () => addToCalendar('2025-09-04', 'YCCC VR Lab Info Session 2'));
    }
    
    // Contact buttons
    if (hearFromUs) {
        hearFromUs.addEventListener('click', () => {
            window.open('mailto:vrlab@yccc.edu?subject=VR Lab Interest&body=Hi! I\'m interested in learning more about the YCCC VR Lab.', '_blank');
        });
    }
    
    if (talkToUs) {
        talkToUs.addEventListener('click', () => {
            window.open('https://discord.gg/hlai', '_blank');
        });
    }
    
    // Smooth scrolling for navigation
    document.querySelectorAll('nav a[href^=\"#\"]').forEach(anchor => {
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
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
}

function startLandingAnimations() {
    // Add additional dynamic elements to the landing page
    const geometricBg = document.querySelector('.geometric-bg');
    if (geometricBg) {
        // Create additional animated elements
        for (let i = 0; i < 10; i++) {
            createFloatingParticle(geometricBg, i);
        }
    }
}

function createFloatingParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(0, 255, 255, 0.6);
        border-radius: 50%;
        box-shadow: 0 0 5px #00ffff;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particle-float-${index} ${8 + Math.random() * 4}s ease-in-out infinite;
    `;
    
    // Create unique animation for each particle
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float-${index} {
            0%, 100% { 
                transform: translate(0, 0) scale(1); 
                opacity: 0.3; 
            }
            25% { 
                transform: translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 30}px) scale(1.2); 
                opacity: 0.8; 
            }
            50% { 
                transform: translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 50}px) scale(0.8); 
                opacity: 0.5; 
            }
            75% { 
                transform: translate(${(Math.random() - 0.5) * 40}px, ${(Math.random() - 0.5) * 20}px) scale(1.1); 
                opacity: 0.9; 
            }
        }
    `;
    document.head.appendChild(style);
    container.appendChild(particle);
}

function enterMainWebsite() {
    const landingPage = document.getElementById('landing-page');
    const mainWebsite = document.getElementById('main-website');
    
    // Fade out landing page
    landingPage.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    landingPage.style.opacity = '0';
    landingPage.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        landingPage.style.display = 'none';
        mainWebsite.style.display = 'block';
        
        // Fade in main website
        mainWebsite.style.opacity = '0';
        mainWebsite.style.transition = 'opacity 1s ease-in';
        
        setTimeout(() => {
            mainWebsite.style.opacity = '1';
            initializeMainWebsiteAnimations();
        }, 100);
    }, 1000);
}

function initializeMainWebsiteAnimations() {
    // Add scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe sections for animation
    document.querySelectorAll('.events-section, .ar-section, .lab-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}

// AR Functionality
async function toggleAR() {
    if (!arActive) {
        await startAR();
    } else {
        stopAR();
    }
}

async function startAR() {
    try {
        // Request camera access with higher quality
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment' // Prefer back camera
            },
            audio: false
        });
        
        // Display camera feed
        cameraFeed.srcObject = cameraStream;
        cameraFeed.style.display = 'block';
        arCanvas.style.display = 'block';
        arStatus.style.display = 'block';
        
        // Update button
        startArBtn.textContent = 'Stop AR Camera';
        startArBtn.classList.add('pulse');
        
        arActive = true;
        
        // Initialize AR features
        initializeARFeatures();
        
        arStatus.textContent = '🎯 AR Camera Active - Point at Room 112 sign or your face!';
        arStatus.style.borderColor = '#00ff00';
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        arStatus.style.display = 'block';
        arStatus.textContent = '❌ Camera access denied. Please allow camera permissions and use HTTPS.';
        arStatus.style.borderColor = '#ff0000';
        arStatus.style.color = '#ff0000';
    }
}

function stopAR() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    cameraFeed.style.display = 'none';
    arCanvas.style.display = 'none';
    arStatus.style.display = 'none';
    
    startArBtn.textContent = 'Start AR Camera';
    startArBtn.classList.remove('pulse');
    
    arActive = false;
    faceDetectionActive = false;
}

function initializeARFeatures() {
    const canvas = arCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match video
    cameraFeed.addEventListener('loadedmetadata', () => {
        canvas.width = cameraFeed.videoWidth;
        canvas.height = cameraFeed.videoHeight;
    });
    
    // Start AR overlay rendering
    renderAROverlay();
    
    // Simulate face detection
    setTimeout(simulateFaceDetection, 3000);
    
    // Simulate OCR detection
    setTimeout(simulateOCRDetection, 6000);
}

function renderAROverlay() {
    if (!arActive) return;
    
    const canvas = arCanvas;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const time = Date.now() * 0.001;
    
    // Draw AR grid overlay
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + 0.2 * Math.sin(time * 2)})`;
    ctx.lineWidth = 1;
    const gridSize = 50;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw YCCC VR Lab branding
    ctx.fillStyle = `rgba(0, 255, 255, ${0.8 + 0.2 * Math.sin(time * 3)})`;
    ctx.font = 'bold 24px Courier New';
    ctx.fillText('YCCC VR LAB', 20, 40);
    
    // Draw scanning crosshair
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const crosshairSize = 30 + 10 * Math.sin(time * 4);
    
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.7 + 0.3 * Math.sin(time * 5)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Horizontal line
    ctx.moveTo(centerX - crosshairSize, centerY);
    ctx.lineTo(centerX + crosshairSize, centerY);
    // Vertical line
    ctx.moveTo(centerX, centerY - crosshairSize);
    ctx.lineTo(centerX, centerY + crosshairSize);
    ctx.stroke();
    
    // Draw corner brackets
    const bracketSize = 20;
    ctx.strokeStyle = `rgba(255, 255, 0, ${0.6 + 0.4 * Math.sin(time * 3)})`;
    ctx.lineWidth = 2;
    
    // Top-left bracket
    ctx.beginPath();\n    ctx.moveTo(50, 50 + bracketSize);\n    ctx.lineTo(50, 50);\n    ctx.lineTo(50 + bracketSize, 50);\n    ctx.stroke();\n    \n    // Top-right bracket\n    ctx.beginPath();\n    ctx.moveTo(canvas.width - 50 - bracketSize, 50);\n    ctx.lineTo(canvas.width - 50, 50);\n    ctx.lineTo(canvas.width - 50, 50 + bracketSize);\n    ctx.stroke();\n    \n    // Bottom-left bracket\n    ctx.beginPath();\n    ctx.moveTo(50, canvas.height - 50 - bracketSize);\n    ctx.lineTo(50, canvas.height - 50);\n    ctx.lineTo(50 + bracketSize, canvas.height - 50);\n    ctx.stroke();\n    \n    // Bottom-right bracket\n    ctx.beginPath();\n    ctx.moveTo(canvas.width - 50 - bracketSize, canvas.height - 50);\n    ctx.lineTo(canvas.width - 50, canvas.height - 50);\n    ctx.lineTo(canvas.width - 50, canvas.height - 50 - bracketSize);\n    ctx.stroke();\n    \n    // Continue animation\n    requestAnimationFrame(renderAROverlay);\n}\n\nfunction simulateFaceDetection() {\n    if (!arActive) return;\n    \n    faceDetectionActive = true;\n    arStatus.textContent = '👤 Face detected! Welcome to the Hawkverse! 🚀';\n    arStatus.style.borderColor = '#00ff00';\n    arStatus.style.color = '#00ff00';\n    \n    // Add face detection visual effect\n    setTimeout(() => {\n        if (arActive) {\n            const canvas = arCanvas;\n            const ctx = canvas.getContext('2d');\n            \n            // Draw face detection box (simulated)\n            ctx.strokeStyle = '#00ff00';\n            ctx.lineWidth = 3;\n            ctx.strokeRect(canvas.width * 0.3, canvas.height * 0.2, canvas.width * 0.4, canvas.height * 0.5);\n            \n            ctx.fillStyle = '#00ff00';\n            ctx.font = '16px Courier New';\n            ctx.fillText('FACE DETECTED', canvas.width * 0.32, canvas.height * 0.18);\n        }\n    }, 1000);\n}\n\nfunction simulateOCRDetection() {\n    if (!arActive) return;\n    \n    setTimeout(() => {\n        if (arActive) {\n            arStatus.textContent = '🔍 Scanning for Room 112 sign...';\n            arStatus.style.borderColor = '#ffff00';\n            arStatus.style.color = '#ffff00';\n        }\n    }, 2000);\n    \n    setTimeout(() => {\n        if (arActive) {\n            arStatus.textContent = '🎯 Room 112 detected! You found the VR Lab! 🏆';\n            arStatus.style.borderColor = '#ff00ff';\n            arStatus.style.color = '#ff00ff';\n            \n            // Add OCR detection visual effect\n            const canvas = arCanvas;\n            const ctx = canvas.getContext('2d');\n            \n            ctx.strokeStyle = '#ff00ff';\n            ctx.lineWidth = 3;\n            ctx.strokeRect(canvas.width * 0.1, canvas.height * 0.6, canvas.width * 0.8, canvas.height * 0.2);\n            \n            ctx.fillStyle = '#ff00ff';\n            ctx.font = 'bold 20px Courier New';\n            ctx.fillText('ROOM 112 - VR LAB FOUND!', canvas.width * 0.15, canvas.height * 0.72);\n        }\n    }, 5000);\n}\n\n// Fullscreen functionality\nfunction toggleFullscreen() {\n    if (!isFullscreen) {\n        enterFullscreen();\n    } else {\n        exitFullscreen();\n    }\n}\n\nfunction enterFullscreen() {\n    const element = document.documentElement;\n    \n    if (element.requestFullscreen) {\n        element.requestFullscreen();\n    } else if (element.webkitRequestFullscreen) {\n        element.webkitRequestFullscreen();\n    } else if (element.msRequestFullscreen) {\n        element.msRequestFullscreen();\n    }\n    \n    isFullscreen = true;\n    fullscreenBtn.textContent = 'Exit Fullscreen';\n}\n\nfunction exitFullscreen() {\n    if (document.exitFullscreen) {\n        document.exitFullscreen();\n    } else if (document.webkitExitFullscreen) {\n        document.webkitExitFullscreen();\n    } else if (document.msExitFullscreen) {\n        document.msExitFullscreen();\n    }\n    \n    isFullscreen = false;\n    fullscreenBtn.textContent = 'Fullscreen Mode';\n}\n\nfunction handleFullscreenChange() {\n    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {\n        isFullscreen = false;\n        fullscreenBtn.textContent = 'Fullscreen Mode';\n    }\n}\n\n// Calendar functionality\nfunction addToCalendar(date, title) {\n    const startDate = new Date(date + 'T12:00:00');\n    const endDate = new Date(date + 'T13:30:00');\n    \n    const formatDate = (date) => {\n        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';\n    };\n    \n    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('YCCC VR Lab Info Session - Room 112, Wells Campus. Come learn about Extended Reality!')}&location=${encodeURIComponent('Room 112, Wells Campus, YCCC')}`;\n    \n    window.open(calendarUrl, '_blank');\n}\n\n// Keyboard shortcuts\nfunction handleKeyboardShortcuts(e) {\n    switch(e.key.toLowerCase()) {\n        case 'f':\n            e.preventDefault();\n            toggleFullscreen();\n            break;\n        case 'c':\n            e.preventDefault();\n            if (startArBtn) toggleAR();\n            break;\n        case 'escape':\n            if (isFullscreen) exitFullscreen();\n            break;\n        case 'enter':\n            if (document.getElementById('landing-page').style.display !== 'none') {\n                enterMainWebsite();\n            }\n            break;\n    }\n}\n\n// Touch gestures for mobile\nlet touchStartY = 0;\n\ndocument.addEventListener('touchstart', function(e) {\n    touchStartY = e.touches[0].clientY;\n});\n\ndocument.addEventListener('touchend', function(e) {\n    const touchEndY = e.changedTouches[0].clientY;\n    const deltaY = touchEndY - touchStartY;\n    \n    // Swipe up to enter fullscreen\n    if (deltaY < -100) {\n        if (!isFullscreen && fullscreenBtn) {\n            enterFullscreen();\n        }\n    }\n    \n    // Swipe down to exit fullscreen\n    if (deltaY > 100) {\n        if (isFullscreen) {\n            exitFullscreen();\n        }\n    }\n});\n\n// Add dynamic background effects\nfunction addDynamicEffects() {\n    // Add floating particles to main website\n    const mainContainer = document.querySelector('.main-container');\n    if (mainContainer && mainContainer.style.display !== 'none') {\n        for (let i = 0; i < 5; i++) {\n            setTimeout(() => {\n                createFloatingElement(mainContainer, i);\n            }, i * 1000);\n        }\n    }\n}\n\nfunction createFloatingElement(container, index) {\n    const element = document.createElement('div');\n    element.style.cssText = `\n        position: fixed;\n        width: 3px;\n        height: 3px;\n        background: rgba(0, 255, 255, 0.4);\n        border-radius: 50%;\n        pointer-events: none;\n        z-index: 1;\n        top: ${Math.random() * 100}vh;\n        left: ${Math.random() * 100}vw;\n        animation: float-main-${index} ${10 + Math.random() * 5}s linear infinite;\n    `;\n    \n    const style = document.createElement('style');\n    style.textContent = `\n        @keyframes float-main-${index} {\n            0% { \n                transform: translate(0, 0) scale(1); \n                opacity: 0; \n            }\n            10% { \n                opacity: 1; \n            }\n            90% { \n                opacity: 1; \n            }\n            100% { \n                transform: translate(${(Math.random() - 0.5) * 200}px, -100vh) scale(0.5); \n                opacity: 0; \n            }\n        }\n    `;\n    document.head.appendChild(style);\n    container.appendChild(element);\n    \n    // Remove element after animation\n    setTimeout(() => {\n        element.remove();\n        style.remove();\n    }, 15000);\n}\n\n// Initialize dynamic effects after main website loads\nsetTimeout(addDynamicEffects, 2000);