// Global variables
let arActive = false;
let cameraStream = null;
let isFullscreen = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    initializeEventListeners();
});

function initializeEventListeners() {
    // Get the enter button
    const enterBtn = document.getElementById('enter-dreamscape');
    if (enterBtn) {
        console.log('Enter button found, adding listener');
        enterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Enter button clicked');
            enterMainSite();
        });
    } else {
        console.error('Enter button not found');
    }

    // AR controls
    const startArBtn = document.getElementById('start-ar-btn');
    if (startArBtn) {
        startArBtn.addEventListener('click', toggleAR);
    }

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Calendar buttons
    const cal1Btn = document.getElementById('cal-1-btn');
    const cal2Btn = document.getElementById('cal-2-btn');
    
    if (cal1Btn) {
        cal1Btn.addEventListener('click', () => addToCalendar('2025-09-03', 'YCCC VR Lab Info Session 1'));
    }
    
    if (cal2Btn) {
        cal2Btn.addEventListener('click', () => addToCalendar('2025-09-04', 'YCCC VR Lab Info Session 2'));
    }

    // Contact buttons
    const hearBtn = document.getElementById('hear-btn');
    const talkBtn = document.getElementById('talk-btn');
    
    if (hearBtn) {
        hearBtn.addEventListener('click', () => {
            window.open('mailto:vrlab@yccc.edu?subject=VR Lab Interest&body=Hi! I\'m interested in learning more about the YCCC VR Lab.', '_blank');
        });
    }
    
    if (talkBtn) {
        talkBtn.addEventListener('click', () => {
            window.open('https://discord.gg/hlai', '_blank');
        });
    }

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
}

function enterMainSite() {
    console.log('Entering main site...');
    
    // Hide all geometric elements
    const geometricElements = [
        '.rectangle', '.slashes', '.pluses', '.horizontal', '.vertical',
        '.framing', '.framingHorizontal', '.barcodeWrapper', '.squares',
        '.mainWrapper', '.triangle'
    ];
    
    geometricElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.transition = 'opacity 1s ease-out';
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.display = 'none';
            }, 1000);
        });
    });

    // Show main site after delay
    setTimeout(() => {
        const mainSite = document.getElementById('main-site');
        if (mainSite) {
            mainSite.style.display = 'block';
            setTimeout(() => {
                mainSite.classList.add('show');
            }, 100);
        }
    }, 1000);
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
        console.log('Starting AR...');
        
        // Request camera access
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment'
            }
        });
        
        const cameraVideo = document.getElementById('camera-video');
        const cameraContainer = document.getElementById('camera-container');
        const arOverlay = document.getElementById('ar-overlay');
        const arStatus = document.getElementById('ar-status');
        const startArBtn = document.getElementById('start-ar-btn');
        
        // Set up video
        cameraVideo.srcObject = cameraStream;
        cameraContainer.style.display = 'block';
        
        // Update button
        startArBtn.textContent = 'Stop AR Camera';
        startArBtn.style.backgroundColor = 'var(--red-transparent)';
        startArBtn.style.borderColor = 'var(--red)';
        startArBtn.style.color = 'var(--red)';
        
        arActive = true;
        
        // Set up canvas overlay
        cameraVideo.addEventListener('loadedmetadata', () => {
            arOverlay.width = cameraVideo.videoWidth;
            arOverlay.height = cameraVideo.videoHeight;
            startAROverlay();
        });
        
        // Show status
        arStatus.textContent = '🎯 AR Camera Active - Point at Room 112 sign or your face!';
        arStatus.style.borderColor = 'var(--blue)';
        arStatus.style.color = 'var(--blue)';
        
        // Simulate detections
        setTimeout(simulateFaceDetection, 3000);
        setTimeout(simulateOCRDetection, 6000);
        
    } catch (error) {
        console.error('Camera access error:', error);
        const arStatus = document.getElementById('ar-status');
        arStatus.textContent = '❌ Camera access denied. Please allow camera permissions.';
        arStatus.style.borderColor = 'var(--red)';
        arStatus.style.color = 'var(--red)';
        arStatus.style.display = 'block';
    }
}

function stopAR() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    
    const cameraContainer = document.getElementById('camera-container');
    const startArBtn = document.getElementById('start-ar-btn');
    
    cameraContainer.style.display = 'none';
    startArBtn.textContent = 'Start AR Camera';
    startArBtn.style.backgroundColor = 'var(--purple-transparent)';
    startArBtn.style.borderColor = 'var(--purple)';
    startArBtn.style.color = 'var(--purple)';
    
    arActive = false;
}

function startAROverlay() {
    const canvas = document.getElementById('ar-overlay');
    const ctx = canvas.getContext('2d');
    
    function drawOverlay() {
        if (!arActive) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.001;
        
        // Draw AR grid
        ctx.strokeStyle = `rgba(160, 255, 227, ${0.3 + 0.2 * Math.sin(time * 2)})`;
        ctx.lineWidth = 1;
        
        const gridSize = 50;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw crosshair
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = 30 + 10 * Math.sin(time * 4);
        
        ctx.strokeStyle = `rgba(248, 135, 255, ${0.8 + 0.2 * Math.sin(time * 3)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(centerX - size, centerY);
        ctx.lineTo(centerX + size, centerY);
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX, centerY + size);
        ctx.stroke();
        
        // Draw YCCC branding
        ctx.fillStyle = `rgba(160, 255, 227, ${0.8 + 0.2 * Math.sin(time * 2)})`;
        ctx.font = 'bold 24px Arial';
        ctx.fillText('YCCC VR LAB', 20, 40);
        
        requestAnimationFrame(drawOverlay);
    }
    
    drawOverlay();
}

function simulateFaceDetection() {
    if (!arActive) return;
    
    const arStatus = document.getElementById('ar-status');
    arStatus.textContent = '👤 Face detected! Welcome to the Hawkverse! 🚀';
    arStatus.style.borderColor = 'var(--yellow)';
    arStatus.style.color = 'var(--yellow)';
}

function simulateOCRDetection() {
    if (!arActive) return;
    
    const arStatus = document.getElementById('ar-status');
    
    setTimeout(() => {
        if (arActive) {
            arStatus.textContent = '🔍 Scanning for Room 112 sign...';
            arStatus.style.borderColor = 'var(--purple)';
            arStatus.style.color = 'var(--purple)';
        }
    }, 2000);
    
    setTimeout(() => {
        if (arActive) {
            arStatus.textContent = '🎯 Room 112 detected! You found the VR Lab! 🏆';
            arStatus.style.borderColor = 'var(--red)';
            arStatus.style.color = 'var(--red)';
        }
    }, 4000);
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
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.textContent = 'Exit Fullscreen';
    }
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
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.textContent = 'Fullscreen Mode';
    }
}

function handleFullscreenChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        isFullscreen = false;
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = 'Fullscreen Mode';
        }
    }
}

// Calendar functionality
function addToCalendar(date, title) {
    const startDate = new Date(date + 'T12:00:00');
    const endDate = new Date(date + 'T13:30:00');
    
    const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent('YCCC VR Lab Info Session - Room 112, Wells Campus. Come learn about Extended Reality!')}&location=${encodeURIComponent('Room 112, Wells Campus, YCCC')}`;
    
    window.open(calendarUrl, '_blank');
}

// Keyboard shortcuts
function handleKeyboard(e) {
    switch(e.key.toLowerCase()) {
        case 'f':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'c':
            e.preventDefault();
            if (arActive !== undefined) toggleAR();
            break;
        case 'enter':
            const mainSite = document.getElementById('main-site');
            if (mainSite && mainSite.style.display === 'none') {
                e.preventDefault();
                enterMainSite();
            }
            break;
        case 'escape':
            if (isFullscreen) exitFullscreen();
            break;
    }
}

// Touch gestures for mobile
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe up for fullscreen
    if (deltaY < -100 && !isFullscreen) {
        enterFullscreen();
    }
    
    // Swipe down to exit fullscreen
    if (deltaY > 100 && isFullscreen) {
        exitFullscreen();
    }
});