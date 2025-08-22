# 🚀 YCCC VR Lab - Extended Reality Club

Welcome to the **York County Community College VR Lab** website! This is the official site for our Extended Reality (XR) club, featuring immersive AR experiences, event information, and interactive features.

## 🌐 **Live Website**
Visit our site at: **[https://ycccrlab.github.io/yccc-vr-lab/](https://ycccrlab.github.io/yccc-vr-lab/)**

## 🎯 **About the VR Lab**

- **Location:** Room 112, Wells Campus, YCCC
- **Hours:** Monday-Friday, 8:00 AM - 4:30 PM
- **Mission:** Foster an inclusive community around VR/AR technology
- **Affiliation:** Part of ICXR (Intercollegiate Extended Reality)

## 📅 **Upcoming Info Sessions**

- **September 3rd, 2025** (Wednesday) - 12:00 PM - 1:30 PM
- **September 4th, 2025** (Thursday) - 12:00 PM - 1:30 PM
- **Location:** Room 112, Wells Campus

## ✨ **Website Features**

### 🎮 **Interactive Elements**
- **AR Camera Experience** - Point your camera to experience AR overlays
- **Face Detection** - Advanced computer vision capabilities
- **OCR Recognition** - Scan Room 112 signs for special interactions
- **Fullscreen Mode** - Immersive viewing experience
- **Calendar Integration** - One-click event scheduling

### 📱 **Responsive Design**
- Mobile-optimized interface
- Touch gestures for mobile navigation
- Cross-platform compatibility
- Progressive Web App features

### ⌨️ **Keyboard Shortcuts**
- `F` - Toggle fullscreen mode
- `C` - Start/stop camera
- `Esc` - Exit fullscreen
- Touch gestures: Swipe up/down for fullscreen on mobile

## 🛠️ **Technical Stack**

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with VR/AR theme
- **Features:** WebRTC Camera API, Fullscreen API, Canvas API
- **Hosting:** GitHub Pages
- **Responsive:** Mobile-first design approach

## 🔧 **Development Setup**

1. Clone the repository:
   ```bash
   git clone https://github.com/YCCCVRLab/yccc-vr-lab.git
   cd yccc-vr-lab
   ```

2. Open `index.html` in a web browser or serve locally:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. For HTTPS (required for camera access):
   ```bash
   # Using Python with SSL
   python -m http.server 8000 --bind 127.0.0.1
   ```

## 📋 **File Structure**

```
yccc-vr-lab/
├── index.html          # Main HTML file
├── style.css           # Responsive CSS styling
├── script.js           # Interactive JavaScript features
├── _config.yml         # GitHub Pages configuration
└── README.md          # This file
```

## 🚀 **Advanced Features Implementation**

### Face Recognition (Future Enhancement)
To implement real face detection, add face-api.js:
```html
<script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
```

### OCR Text Recognition
For real OCR capabilities, integrate Tesseract.js:
```html
<script src="https://cdn.jsdelivr.net/npm/tesseract.js@2.1.5/dist/tesseract.min.js"></script>
```

### 3D AR Elements
For advanced AR, consider AR.js or Three.js:
```html
<script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js/aframe/build/aframe-ar.min.js"></script>
```

## 🎨 **Customization**

### Colors and Branding
The site uses a cyberpunk/VR theme with:
- **Primary:** Cyan (#00ffff)
- **Secondary:** Magenta (#ff00ff) 
- **Background:** Dark gradient (#0a0a0a to #16213e)
- **Accent:** Electric blue (#0066cc)

### Content Updates
- Edit event dates in `index.html`
- Update lab hours in the "Lab Hours" section
- Modify contact information in the footer
- Add new features in `script.js`

## 📞 **Contact Information**

- **Email:** vrlab@yccc.edu
- **Discord:** [Highlight AI Community](https://discord.gg/hlai)
- **Location:** Room 112, Wells Campus, YCCC
- **Coordinator:** John C. Barr, Simulation and Learning Technology Specialist

## 🤝 **Contributing**

We welcome contributions from students, faculty, and the community:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 🎓 **About YCCC**

York County Community College is committed to providing cutting-edge technology education. Our VR Lab represents the future of immersive learning and student engagement.

---

**Enter the Hawkverse** 🚀 | Built with ❤️ for YCCC Students