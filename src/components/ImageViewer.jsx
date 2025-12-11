import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";

export const ImageViewer = ({ imageUrl, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setZoom(1);
      setRotation(0);
    }, 300);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => prev + 90);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999999] flex items-center justify-center bg-black transition-opacity duration-300 ${
        isVisible ? "bg-opacity-90 opacity-100" : "bg-opacity-0 opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRotate();
          }}
          className=" w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          title="Rotate"
        >
          <RotateCw className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
          title="Close"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Image */}
      <div
        className={`w-full h-full flex items-center justify-center p-4 transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-75"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="max-w-full max-h-full object-contain transition-all duration-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
          }}
        />
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-white text-sm font-medium">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
};
