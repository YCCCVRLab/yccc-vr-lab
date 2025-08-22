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

    // Calendar buttons - Updated for Outlook
    const cal1Btn = document.getElementById('cal-1-btn');
    const cal2Btn = document.getElementById('cal-2-btn');
    
    if (cal1Btn) {
        cal1Btn.addEventListener('click', () => addToOutlookCalendar('2025-09-03', 'YCCC VR Lab Info Session 1'));
    }
    
    if (cal2Btn) {
        cal2Btn.addEventListener('click', () => addToOutlookCalendar('2025-09-04', 'YCCC VR Lab Info Session 2'));
    }

    // Contact buttons - Updated
    const hearBtn = document.getElementById('hear-btn');
    const visitBtn = document.getElementById('visit-btn');
    
    if (hearBtn) {
        hearBtn.addEventListener('click', () => {
            window.open('mailto:vrlab@yccc.edu?subject=VR Lab Interest&body=Hi! I\'m interested in learning more about the YCCC VR Lab and would like to schedule a visit or demo.', '_blank');
        });
    }
    
    if (visitBtn) {
        visitBtn.addEventListener('click', () => {
            // Open Google Maps to YCCC Wells Campus
            window.open('https://maps.google.com?q=York+County+Community+College+Wells+Campus+Room+112', '_blank');
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

// AR Functionality with improved Room 112 detection
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
            startTextDetection();
        });
        
        // Show status
        arStatus.textContent = '🎯 AR Camera Active - Point at text containing "Room 112" or "112"!';
        arStatus.style.borderColor = 'var(--blue)';
        arStatus.style.color = 'var(--blue)';
        
        // Start face detection demo
        setTimeout(simulateFaceDetection, 3000);
        
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
        
        // Draw YCCC VR Lab branding
        ctx.fillStyle = `rgba(160, 255, 227, ${0.8 + 0.2 * Math.sin(time * 2)})`;
        ctx.font = 'bold 24px Arial';
        ctx.fillText('YCCC VR LAB', 20, 40);
        
        // Draw scanning instructions
        ctx.fillStyle = `rgba(224, 255, 79, ${0.6 + 0.2 * Math.sin(time * 1.5)})`;
        ctx.font = '16px Arial';
        ctx.fillText('Point camera at "Room 112" text', 20, canvas.height - 20);
        
        requestAnimationFrame(drawOverlay);
    }
    
    drawOverlay();
}

// Improved text detection simulation
function startTextDetection() {
    let detectionTimeout;
    
    function checkForText() {
        if (!arActive) return;
        
        // Simulate text detection - in a real implementation, you would use OCR
        // This is a simplified simulation that triggers after a delay
        detectionTimeout = setTimeout(() => {
            if (arActive) {
                simulateRoom112Detection();
            }
        }, 5000 + Math.random() * 3000); // Random delay between 5-8 seconds
    }
    
    checkForText();
}

function simulateRoom112Detection() {
    if (!arActive) return;
    
    const arStatus = document.getElementById('ar-status');
    const canvas = document.getElementById('ar-overlay');
    const ctx = canvas.getContext('2d');
    
    // Update status
    arStatus.textContent = '🎯 "Room 112" detected! VR Lab found! 🏆';
    arStatus.style.borderColor = 'var(--yellow)';
    arStatus.style.color = 'var(--yellow)';
    
    // Draw detection box
    setTimeout(() => {
        if (arActive) {
            ctx.strokeStyle = 'var(--yellow)';
            ctx.lineWidth = 3;
            ctx.strokeRect(canvas.width * 0.2, canvas.height * 0.4, canvas.width * 0.6, canvas.height * 0.2);
            
            ctx.fillStyle = 'var(--yellow)';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('ROOM 112 DETECTED!', canvas.width * 0.25, canvas.height * 0.52);
        }
    }, 500);
}

function simulateFaceDetection() {
    if (!arActive) return;
    
    const arStatus = document.getElementById('ar-status');
    arStatus.textContent = '👤 Face detected! Welcome to the YCCC VR Lab! 🚀';
    arStatus.style.borderColor = 'var(--purple)';
    arStatus.style.color = 'var(--purple)';
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

// Outlook Calendar functionality
function addToOutlookCalendar(date, title) {
    const startDate = new Date(date + 'T12:00:00');
    const endDate = new Date(date + 'T13:30:00');
    
    const formatOutlookDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    // Create Outlook calendar URL
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${formatOutlookDate(startDate)}&enddt=${formatOutlookDate(endDate)}&body=${encodeURIComponent('YCCC VR Lab Info Session - Come explore virtual reality with our Meta Quest 3 headsets! Learn about VR technology and opportunities in our lab.')}&location=${encodeURIComponent('Room 112, Wells Campus, York County Community College, 112 College Drive, Wells, ME 04090')}`;
    
    // Also create an ICS file for universal calendar support
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YCCC VR Lab//EN
BEGIN:VEVENT
UID:${Date.now()}@yccc.edu
DTSTAMP:${formatOutlookDate(new Date())}
DTSTART:${formatOutlookDate(startDate)}
DTEND:${formatOutlookDate(endDate)}
SUMMARY:${title}
DESCRIPTION:YCCC VR Lab Info Session - Come explore virtual reality with our Meta Quest 3 headsets! Learn about VR technology and opportunities in our lab.
LOCATION:Room 112, Wells Campus, York County Community College, 112 College Drive, Wells, ME 04090
END:VEVENT
END:VCALENDAR`;

    // Try Outlook first, then fallback to ICS download
    try {
        window.open(outlookUrl, '_blank');
    } catch (error) {
        // Fallback: download ICS file
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
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