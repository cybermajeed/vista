import React, { useState, useRef, useCallback, useEffect } from "react";
import { Maximize2, SplitSquareVertical, Columns } from "lucide-react";

interface ImageComparisonSliderProps {
  originalImage: string;
  generatedImage: string;
  originalLabel?: string;
  generatedLabel?: string;
  className?: string;
}

export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalImage,
  generatedImage,
  originalLabel = "Original Empty Room",
  generatedLabel = "AI Designed Interior",
  className = ""
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleTouchStart = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDragging, handleMove]);

  return (
    <div className={`flex flex-col gap-sm ${className}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-xs py-1">
        <div className="flex items-center gap-xs">
          <span className="text-body-xs font-semibold uppercase tracking-wider text-slate">
            Visualizer Comparison
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "slider" ? "side-by-side" : "slider")}
            className="flex items-center gap-xs px-sm py-1 rounded-md text-body-xs font-medium bg-surface text-ink hover:bg-surface-soft border border-hairline transition-colors"
          >
            {viewMode === "slider" ? (
              <>
                <Columns className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </>
            ) : (
              <>
                <SplitSquareVertical className="w-3.5 h-3.5" />
                <span>Split Slider</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md text-slate hover:text-ink hover:bg-surface border border-hairline transition-colors"
            title="Expand Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === "slider" ? (
        <div
          ref={containerRef}
          className={`relative overflow-hidden select-none rounded-xl border border-hairline-strong bg-charcoal/5 shadow-md aspect-[4/3] md:aspect-[16/10] w-full ${
            isFullscreen ? "fixed inset-4 z-50 aspect-auto h-[90vh] bg-canvas shadow-2xl" : ""
          }`}
          onClick={(e) => handleMove(e.clientX)}
        >
          {/* Base Layer: Redesigned Interior */}
          <img
            src={generatedImage}
            alt="AI Designed Interior"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Top Layer: Original Room (clipped by slider) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={originalImage}
              alt="Original Room"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Split Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-ink-deep shadow-lg border-2 border-brand-accent flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold">◀</span>
                <span className="text-[10px] font-bold">▶</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="bg-ink-deep/80 backdrop-blur-md text-white text-body-xs font-semibold px-sm py-1 rounded-md shadow-sm">
              {originalLabel}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <span className="bg-brand-accent/90 backdrop-blur-md text-white text-body-xs font-semibold px-sm py-1 rounded-md shadow-sm">
              {generatedLabel}
            </span>
          </div>

          {/* Helper overlay instruction on first view */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="bg-canvas/90 backdrop-blur-sm text-ink text-[11px] font-medium px-md py-0.5 rounded-full border border-hairline shadow-sm">
              Drag slider to compare before & after
            </span>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="relative rounded-xl overflow-hidden border border-hairline-strong aspect-[4/3] bg-surface">
            <img
              src={originalImage}
              alt="Original Room"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 bg-ink-deep/80 backdrop-blur-md text-white text-body-xs font-semibold px-sm py-1 rounded-md">
              {originalLabel}
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden border border-hairline-strong aspect-[4/3] bg-surface">
            <img
              src={generatedImage}
              alt="AI Designed Interior"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 right-3 bg-brand-accent/90 backdrop-blur-md text-white text-body-xs font-semibold px-sm py-1 rounded-md">
              {generatedLabel}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
