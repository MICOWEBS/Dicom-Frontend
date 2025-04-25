# DICOM Viewer

A modern web application for viewing and analyzing DICOM medical images with AI-powered inference capabilities.

## Features

- DICOM image viewing and manipulation
- AI-powered medical image analysis
- User authentication and authorization
- Real-time inference status updates
- Modern, responsive UI with dark mode support

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, TypeScript
- AI: Python, FastAPI, PyTorch

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.8+ (for backend)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dicom-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm start
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

## Environment Variables

### Frontend
- `REACT_APP_API_URL`: Backend API URL

### Backend
- `PORT`: Server port
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- `PYTHON_PATH`: Path to Python executable

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Cornerstone.js](https://cornerstonejs.org/) for DICOM image rendering
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
