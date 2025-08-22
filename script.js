// Global Variables
let arActive = false;
let cameraStream = null;
let isFullscreen = false;

// DOM Elements
const landing = document.getElementById('landing');
const mainSite = document.getElementById('main-site');
const enterBtn = document.getElementById('enter-btn');
const bgCanvas = document.getElementById('bg-canvas');
const startArBtn = document.getElementById('start-ar-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const cameraContainer = document.getElementById('camera-container');
const cameraVideo = document.getElementById('camera-video');
const arOverlay = document.getElementById('ar-overlay');
const arStatus = document.getElementById('ar-status');

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeBackground();
    initializeEventListeners();
    initializeScrollAnimations();
});

// Background Animation
function initializeBackground() {
    const canvas = bgCanvas;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Animation variables
    const elements = [];
    
    // Create floating elements
    for (let i = 0; i < 50; i++) {
        elements.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            type: Math.random() > 0.7 ? 'plus' : 'dot'
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
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
        
        // Draw and update elements
        elements.forEach(element => {
            // Update position
            element.x += element.speedX;
            element.y += element.speedY;
            
            // Wrap around screen
            if (element.x < 0) element.x = canvas.width;
            if (element.x > canvas.width) element.x = 0;
            if (element.y < 0) element.y = canvas.height;
            if (element.y > canvas.height) element.y = 0;
            
            // Draw element\n            ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';\n            \n            if (element.type === 'plus') {\n                ctx.fillRect(element.x - element.size, element.y - element.size/3, element.size*2, element.size/1.5);\n                ctx.fillRect(element.x - element.size/3, element.y - element.size, element.size/1.5, element.size*2);\n            } else {\n                ctx.beginPath();\n                ctx.arc(element.x, element.y, element.size, 0, Math.PI * 2);\n                ctx.fill();\n            }\n        });\n        \n        // Draw diagonal lines\n        const time = Date.now() * 0.001;\n        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 + 0.1 * Math.sin(time)})`;\n        ctx.lineWidth = 2;\n        \n        for (let i = 0; i < 5; i++) {\n            const angle = (i * Math.PI / 6) + time * 0.1;\n            const length = 200;\n            const startX = Math.sin(time + i) * 100 + canvas.width / 2;\n            const startY = Math.cos(time + i) * 100 + canvas.height / 2;\n            \n            ctx.beginPath();\n            ctx.moveTo(startX, startY);\n            ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);\n            ctx.stroke();\n        }\n        \n        requestAnimationFrame(animate);\n    }\n    \n    animate();\n}\n\n// Event Listeners\nfunction initializeEventListeners() {\n    // Enter button\n    if (enterBtn) {\n        enterBtn.addEventListener('click', enterMainSite);\n    }\n    \n    // AR controls\n    if (startArBtn) {\n        startArBtn.addEventListener('click', toggleAR);\n    }\n    \n    if (fullscreenBtn) {\n        fullscreenBtn.addEventListener('click', toggleFullscreen);\n    }\n    \n    // Calendar buttons\n    const cal1Btn = document.getElementById('cal-1-btn');\n    const cal2Btn = document.getElementById('cal-2-btn');\n    \n    if (cal1Btn) {\n        cal1Btn.addEventListener('click', () => addToCalendar('2025-09-03', 'YCCC VR Lab Info Session 1'));\n    }\n    \n    if (cal2Btn) {\n        cal2Btn.addEventListener('click', () => addToCalendar('2025-09-04', 'YCCC VR Lab Info Session 2'));\n    }\n    \n    // Contact buttons\n    const hearBtn = document.getElementById('hear-btn');\n    const talkBtn = document.getElementById('talk-btn');\n    \n    if (hearBtn) {\n        hearBtn.addEventListener('click', () => {\n            window.open('mailto:vrlab@yccc.edu?subject=VR Lab Interest&body=Hi! I\\'m interested in learning more about the YCCC VR Lab.', '_blank');\n        });\n    }\n    \n    if (talkBtn) {\n        talkBtn.addEventListener('click', () => {\n            window.open('https://discord.gg/hlai', '_blank');\n        });\n    }\n    \n    // Smooth scrolling for nav links\n    document.querySelectorAll('.nav-link').forEach(link => {\n        link.addEventListener('click', function(e) {\n            e.preventDefault();\n            const targetId = this.getAttribute('href');\n            const targetElement = document.querySelector(targetId);\n            \n            if (targetElement) {\n                targetElement.scrollIntoView({\n                    behavior: 'smooth',\n                    block: 'start'\n                });\n            }\n        });\n    });\n    \n    // Keyboard shortcuts\n    document.addEventListener('keydown', handleKeyboard);\n    \n    // Fullscreen change events\n    document.addEventListener('fullscreenchange', handleFullscreenChange);\n    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);\n}\n\n// Enter Main Site\nfunction enterMainSite() {\n    landing.style.transition = 'opacity 1s ease-out, transform 1s ease-out';\n    landing.style.opacity = '0';\n    landing.style.transform = 'scale(1.1)';\n    \n    setTimeout(() => {\n        landing.style.display = 'none';\n        mainSite.style.display = 'block';\n        \n        // Fade in main site\n        mainSite.style.opacity = '0';\n        mainSite.style.transition = 'opacity 1s ease-in';\n        \n        setTimeout(() => {\n            mainSite.style.opacity = '1';\n        }, 100);\n    }, 1000);\n}\n\n// AR Functionality\nasync function toggleAR() {\n    if (!arActive) {\n        await startAR();\n    } else {\n        stopAR();\n    }\n}\n\nasync function startAR() {\n    try {\n        // Request camera access\n        cameraStream = await navigator.mediaDevices.getUserMedia({\n            video: {\n                width: { ideal: 1280 },\n                height: { ideal: 720 },\n                facingMode: 'environment'\n            }\n        });\n        \n        // Set up video\n        cameraVideo.srcObject = cameraStream;\n        cameraContainer.style.display = 'block';\n        \n        // Update button\n        startArBtn.textContent = 'Stop AR Camera';\n        startArBtn.classList.add('pulse');\n        \n        arActive = true;\n        \n        // Set up canvas overlay\n        cameraVideo.addEventListener('loadedmetadata', () => {\n            arOverlay.width = cameraVideo.videoWidth;\n            arOverlay.height = cameraVideo.videoHeight;\n            startAROverlay();\n        });\n        \n        // Show status\n        arStatus.textContent = '🎯 AR Camera Active - Point at Room 112 sign or your face!';\n        arStatus.style.borderColor = '#00ff00';\n        \n        // Simulate detections\n        setTimeout(simulateFaceDetection, 3000);\n        setTimeout(simulateOCRDetection, 6000);\n        \n    } catch (error) {\n        console.error('Camera access error:', error);\n        arStatus.textContent = '❌ Camera access denied. Please allow camera permissions.';\n        arStatus.style.borderColor = '#ff0000';\n        arStatus.style.color = '#ff0000';\n    }\n}\n\nfunction stopAR() {\n    if (cameraStream) {\n        cameraStream.getTracks().forEach(track => track.stop());\n        cameraStream = null;\n    }\n    \n    cameraContainer.style.display = 'none';\n    startArBtn.textContent = 'Start AR Camera';\n    startArBtn.classList.remove('pulse');\n    arActive = false;\n}\n\nfunction startAROverlay() {\n    const canvas = arOverlay;\n    const ctx = canvas.getContext('2d');\n    \n    function drawOverlay() {\n        if (!arActive) return;\n        \n        ctx.clearRect(0, 0, canvas.width, canvas.height);\n        \n        const time = Date.now() * 0.001;\n        \n        // Draw AR grid\n        ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + 0.2 * Math.sin(time * 2)})`;\n        ctx.lineWidth = 1;\n        \n        const gridSize = 50;\n        for (let x = 0; x < canvas.width; x += gridSize) {\n            ctx.beginPath();\n            ctx.moveTo(x, 0);\n            ctx.lineTo(x, canvas.height);\n            ctx.stroke();\n        }\n        \n        // Draw crosshair\n        const centerX = canvas.width / 2;\n        const centerY = canvas.height / 2;\n        const size = 30 + 10 * Math.sin(time * 4);\n        \n        ctx.strokeStyle = `rgba(255, 0, 255, ${0.8 + 0.2 * Math.sin(time * 3)})`;\n        ctx.lineWidth = 3;\n        ctx.beginPath();\n        ctx.moveTo(centerX - size, centerY);\n        ctx.lineTo(centerX + size, centerY);\n        ctx.moveTo(centerX, centerY - size);\n        ctx.lineTo(centerX, centerY + size);\n        ctx.stroke();\n        \n        // Draw YCCC branding\n        ctx.fillStyle = `rgba(0, 255, 255, ${0.8 + 0.2 * Math.sin(time * 2)})`;\n        ctx.font = 'bold 24px Arial';\n        ctx.fillText('YCCC VR LAB', 20, 40);\n        \n        requestAnimationFrame(drawOverlay);\n    }\n    \n    drawOverlay();\n}\n\nfunction simulateFaceDetection() {\n    if (!arActive) return;\n    \n    arStatus.textContent = '👤 Face detected! Welcome to the Hawkverse! 🚀';\n    arStatus.style.borderColor = '#00ff00';\n    arStatus.style.color = '#00ff00';\n}\n\nfunction simulateOCRDetection() {\n    if (!arActive) return;\n    \n    setTimeout(() => {\n        if (arActive) {\n            arStatus.textContent = '🔍 Scanning for Room 112 sign...';\n            arStatus.style.borderColor = '#ffff00';\n            arStatus.style.color = '#ffff00';\n        }\n    }, 2000);\n    \n    setTimeout(() => {\n        if (arActive) {\n            arStatus.textContent = '🎯 Room 112 detected! You found the VR Lab! 🏆';\n            arStatus.style.borderColor = '#ff00ff';\n            arStatus.style.color = '#ff00ff';\n        }\n    }, 4000);\n}\n\n// Fullscreen functionality\nfunction toggleFullscreen() {\n    if (!isFullscreen) {\n        enterFullscreen();\n    } else {\n        exitFullscreen();\n    }\n}\n\nfunction enterFullscreen() {\n    const element = document.documentElement;\n    \n    if (element.requestFullscreen) {\n        element.requestFullscreen();\n    } else if (element.webkitRequestFullscreen) {\n        element.webkitRequestFullscreen();\n    } else if (element.msRequestFullscreen) {\n        element.msRequestFullscreen();\n    }\n    \n    isFullscreen = true;\n    fullscreenBtn.textContent = 'Exit Fullscreen';\n}\n\nfunction exitFullscreen() {\n    if (document.exitFullscreen) {\n        document.exitFullscreen();\n    } else if (document.webkitExitFullscreen) {\n        document.webkitExitFullscreen();\n    } else if (document.msExitFullscreen) {\n        document.msExitFullscreen();\n    }\n    \n    isFullscreen = false;\n    fullscreenBtn.textContent = 'Fullscreen Mode';\n}\n\nfunction handleFullscreenChange() {\n    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {\n        isFullscreen = false;\n        fullscreenBtn.textContent = 'Fullscreen Mode';\n    }\n}\n\n// Calendar functionality\nfunction addToCalendar(date, title) {\n    const startDate = new Date(date + 'T12:00:00');\n    const endDate = new Date(date + 'T13:30:00');\n    \n    const formatDate = (date) => {\n        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';\n    };\n    \n    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('YCCC VR Lab Info Session - Room 112, Wells Campus. Come learn about Extended Reality!')}&location=${encodeURIComponent('Room 112, Wells Campus, YCCC')}`;\n    \n    window.open(calendarUrl, '_blank');\n}\n\n// Scroll animations\nfunction initializeScrollAnimations() {\n    const observer = new IntersectionObserver((entries) => {\n        entries.forEach(entry => {\n            if (entry.isIntersecting) {\n                entry.target.classList.add('visible');\n            }\n        });\n    }, { threshold: 0.1 });\n    \n    // Add fade-in class to sections\n    const sections = document.querySelectorAll('.events-section, .ar-section, .lab-section');\n    sections.forEach(section => {\n        section.classList.add('fade-in');\n        observer.observe(section);\n    });\n}\n\n// Keyboard shortcuts\nfunction handleKeyboard(e) {\n    switch(e.key.toLowerCase()) {\n        case 'f':\n            e.preventDefault();\n            if (fullscreenBtn) toggleFullscreen();\n            break;\n        case 'c':\n            e.preventDefault();\n            if (startArBtn) toggleAR();\n            break;\n        case 'enter':\n            if (landing.style.display !== 'none') {\n                e.preventDefault();\n                enterMainSite();\n            }\n            break;\n        case 'escape':\n            if (isFullscreen) exitFullscreen();\n            break;\n    }\n}\n\n// Touch gestures for mobile\nlet touchStartY = 0;\n\ndocument.addEventListener('touchstart', function(e) {\n    touchStartY = e.touches[0].clientY;\n});\n\ndocument.addEventListener('touchend', function(e) {\n    const touchEndY = e.changedTouches[0].clientY;\n    const deltaY = touchEndY - touchStartY;\n    \n    // Swipe up for fullscreen\n    if (deltaY < -100 && !isFullscreen && fullscreenBtn) {\n        enterFullscreen();\n    }\n    \n    // Swipe down to exit fullscreen\n    if (deltaY > 100 && isFullscreen) {\n        exitFullscreen();\n    }\n});"