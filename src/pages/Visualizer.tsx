import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Sparkles,
  Download,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Layers,
  History,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Wand2,
  Image as ImageIcon
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ImageComparisonSlider } from "../components/visualizer/ImageComparisonSlider";
import { MatchedProductsSection } from "../components/visualizer/MatchedProductsSection";
import { GenerationHistoryDrawer } from "../components/visualizer/GenerationHistoryDrawer";
import { useVisualizerStore, STARTER_EMPTY_ROOMS } from "../store/visualizerStore";
import { useAuthStore } from "../store/authStore";

const ROOM_TYPES = [
  "Living Room",
  "Master Bedroom",
  "Dining Room",
  "Home Office / Study",
  "Kitchen / Pantry",
  "Lounge & Entertainment"
];

const INTERIOR_STYLES = [
  "Modern Minimalist",
  "Japandi",
  "Scandinavian",
  "Industrial Luxury",
  "Contemporary Warmth",
  "Mid-Century Modern",
  "Mediterranean Coastal"
];

const COLOR_PALETTES = [
  "Warm Neutrals & Oak",
  "Earthy Terracotta & Walnut",
  "Monochrome Charcoal & Brass",
  "Sage Green & Natural Linen",
  "Moody Amber & Dark Marble",
  "Soft Cream & Brushed Gold"
];

const LIGHTING_OPTIONS = [
  "Bright Natural Daylight",
  "Golden Hour Sunlight",
  "Soft Warm Ambient",
  "Dramatic Architectural Spotlights",
  "Cozy Evening Glow"
];

const PROMPT_SUGGESTIONS = [
  "Add low-profile bouclé sofa, walnut coffee table, and fluted glass partition",
  "Install acoustic wood slat wall panels, linear pendant light, and warm oak flooring",
  "Design a Japandi sanctuary with paper pendant, low timber platform, and minimal linen decor",
  "Add industrial black steel framed windows, exposed brick accent, and cognac leather armchair",
  "Feature Calacatta marble wall, brushed brass floating shelves, and recessed ceiling cove lighting"
];

export function Visualizer() {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    originalImage,
    generatedImage,
    designSummary,
    matchedProducts,
    variations,
    status,
    generationStep,
    error,
    missingApiKey,
    history,
    historyLoading,
    isSaved,
    roomType,
    style,
    colorPalette,
    lighting,
    customPrompt,
    setOriginalImage,
    setOptions,
    generateVisualization,
    generateVariation,
    saveCurrentVisualization,
    fetchHistory,
    loadHistoryItem,
    checkHealth,
    reset
  } = useVisualizerStore();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  useEffect(() => {
    checkHealth();
    if (user?.id) {
      fetchHistory(user.id);
    }
  }, [user?.id]);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setOriginalImage(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result as string, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `VISTA-${style.replace(/\s+/g, "-")}-${roomType.replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    const success = await saveCurrentVisualization(user.id);
    if (success) {
      setSaveSuccessMsg(true);
      setTimeout(() => setSaveSuccessMsg(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-canvas py-section px-md md:px-lg animate-fade-in">
      <div className="max-w-[1280px] mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
          <div>
            <div className="flex items-center gap-xs text-brand-accent font-semibold text-body-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Interior Visualizer Studio</span>
            </div>
            <h1 className="text-display-lg text-ink-deep font-serif">
              Transform Empty Spaces Into Living Interiors
            </h1>
            <p className="text-body-md text-slate mt-1 max-w-2xl">
              Upload any photograph of an empty room. Our image-to-image AI strictly preserves your walls, windows, and architecture while furnishing it with bespoke materials from the VISTA catalogue.
            </p>
          </div>

          {/* Quick Actions (History, Reset) */}
          <div className="flex items-center gap-sm">
            <Button
              variant="secondary"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-xs"
            >
              <History className="w-4 h-4 text-slate" />
              <span>Saved Designs</span>
              {history.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-surface-pricing-featured text-brand-accent text-body-xs font-bold flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </Button>
            {originalImage && (
              <Button variant="ghost" onClick={reset}>
                New Room
              </Button>
            )}
          </div>
        </div>

        {/* Missing API Key Guidance Banner (if applicable) */}
        {missingApiKey && (
          <div className="mb-lg p-lg rounded-xl bg-surface-pricing-featured border-2 border-brand-yellow text-ink shadow-sm animate-slide-up">
            <div className="flex items-start gap-md">
              <AlertCircle className="w-6 h-6 text-brand-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-body-md-semibold text-ink-deep">
                  Google Gemini / AI API Key Required
                </h4>
                <p className="text-body-sm text-slate mt-1">
                  To enable live image-to-image architectural generation, please add your Google AI Studio API key to the project <code className="bg-canvas px-1.5 py-0.5 rounded border border-hairline font-mono text-xs">.env</code> file:
                </p>
                <div className="mt-2 p-sm rounded bg-canvas border border-hairline font-mono text-xs text-ink select-all">
                  GEMINI_API_KEY="your-google-ai-studio-api-key"
                </div>
                <p className="text-[12px] text-slate mt-2">
                  Once saved in <code className="text-xs">.env</code>, generation will run automatically with zero restart required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {error && !missingApiKey && (
          <div className="mb-lg p-md rounded-xl bg-coral-light border border-brand-red text-brand-red-dark flex items-center gap-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-body-sm">{error}</span>
          </div>
        )}

        {/* Main Grid: Left Controls / Upload & Right Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* LEFT COLUMN: Upload & Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-lg">
            {/* 1. Room Image Upload */}
            <Card className="p-lg">
              <div className="flex items-center justify-between mb-md">
                <h3 className="text-heading-4 font-serif text-ink-deep flex items-center gap-xs">
                  <span className="w-6 h-6 rounded-full bg-brand-yellow/30 text-brand-accent text-body-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Upload Empty Room Photo</span>
                </h3>
                {originalImage && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-body-xs text-brand-accent hover:underline font-medium"
                  >
                    Change photo
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {!originalImage ? (
                <div>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-hairline-strong hover:border-brand-accent rounded-xl p-xl text-center cursor-pointer transition-colors bg-surface-soft/60 hover:bg-surface-soft"
                  >
                    <Upload className="w-10 h-10 text-slate mx-auto mb-sm group-hover:scale-110 transition-transform" />
                    <p className="text-body-sm-medium text-ink-deep">
                      Click to upload or drag & drop room photo
                    </p>
                    <p className="text-body-xs text-slate mt-1">
                      Supports JPEG, PNG, WebP up to 15MB
                    </p>
                  </div>

                  {/* Starter Presets */}
                  <div className="mt-md pt-md border-t border-hairline-soft">
                    <p className="text-body-xs text-slate mb-xs font-medium">
                      Or try one of these sample empty spaces:
                    </p>
                    <div className="grid grid-cols-3 gap-xs">
                      {STARTER_EMPTY_ROOMS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setOriginalImage(preset.url);
                            setOptions({
                              roomType: preset.defaultRoomType,
                              style: preset.defaultStyle
                            });
                          }}
                          className="relative group rounded-lg overflow-hidden border border-hairline hover:border-brand-accent aspect-[4/3] bg-surface text-left transition-all"
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute inset-0 bg-ink-deep/40 group-hover:bg-ink-deep/20 transition-colors" />
                          <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white font-medium truncate px-1 drop-shadow">
                            {preset.defaultRoomType}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-hairline-strong aspect-[4/3] bg-surface group">
                  <img
                    src={originalImage}
                    alt="Uploaded Room"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-ink-deep/80 text-white text-body-xs px-2 py-0.5 rounded backdrop-blur-sm">
                    Original Room
                  </div>
                </div>
              )}
            </Card>

            {/* 2. Interior Preferences & Style Selection */}
            <Card className="p-lg space-y-md">
              <h3 className="text-heading-4 font-serif text-ink-deep flex items-center gap-xs">
                <span className="w-6 h-6 rounded-full bg-brand-yellow/30 text-brand-accent text-body-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>Interior Design Preferences</span>
              </h3>

              {/* Room Type */}
              <div>
                <label className="block text-body-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Room Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setOptions({ roomType: e.target.value })}
                  className="w-full h-11 bg-canvas border border-hairline-strong rounded-lg px-md text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  {ROOM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interior Style */}
              <div>
                <label className="block text-body-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Design Aesthetic & Style
                </label>
                <div className="grid grid-cols-2 gap-xs">
                  {INTERIOR_STYLES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOptions({ style: st })}
                      className={`text-left px-sm py-2 rounded-lg text-body-xs transition-colors border ${
                        style === st
                          ? "bg-surface-pricing-featured border-brand-accent text-brand-accent font-semibold"
                          : "bg-surface-soft border-hairline text-ink hover:border-hairline-strong"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette */}
              <div>
                <label className="block text-body-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Color Palette & Materials
                </label>
                <select
                  value={colorPalette}
                  onChange={(e) => setOptions({ colorPalette: e.target.value })}
                  className="w-full h-11 bg-canvas border border-hairline-strong rounded-lg px-md text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  {COLOR_PALETTES.map((pal) => (
                    <option key={pal} value={pal}>
                      {pal}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lighting */}
              <div>
                <label className="block text-body-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Lighting Atmosphere
                </label>
                <select
                  value={lighting}
                  onChange={(e) => setOptions({ lighting: e.target.value })}
                  className="w-full h-11 bg-canvas border border-hairline-strong rounded-lg px-md text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  {LIGHTING_OPTIONS.map((light) => (
                    <option key={light} value={light}>
                      {light}
                    </option>
                  ))}
                </select>
              </div>

              {/* Natural-Language Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-body-xs font-semibold uppercase tracking-wider text-slate">
                    Custom Prompt / Desired Elements
                  </label>
                  <span className="text-[11px] text-slate">Optional</span>
                </div>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setOptions({ customPrompt: e.target.value })}
                  placeholder="e.g. Add a fluted glass partition behind the modular sofa, warm walnut credenza, and architectural wall sconces..."
                  className="w-full bg-canvas border border-hairline-strong rounded-lg p-md text-body-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-accent placeholder:text-steel resize-none"
                />

                {/* Suggestions */}
                <div className="mt-2">
                  <p className="text-[11px] font-medium text-slate flex items-center gap-1 mb-1">
                    <Lightbulb className="w-3 h-3 text-brand-yellow-deep" />
                    <span>Quick Suggestions:</span>
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {PROMPT_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOptions({ customPrompt: sug })}
                        className="text-[11px] text-ink-deep bg-surface hover:bg-surface-pricing-featured px-2 py-0.5 rounded border border-hairline text-left transition-colors truncate max-w-full"
                      >
                        + {sug.slice(0, 45)}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-sm">
                <Button
                  variant="primary"
                  className="w-full h-12 justify-center text-body-md font-semibold gap-xs"
                  disabled={!originalImage || status === "generating"}
                  onClick={() => generateVisualization()}
                >
                  {status === "generating" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Redesigning Space...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Interior Redesign</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: Results & Interactive Comparison (7 cols) */}
          <div className="lg:col-span-7 space-y-lg">
            {status === "generating" ? (
              /* Loading State */
              <Card className="p-xxl text-center flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-16 h-16 rounded-full bg-surface-pricing-featured border-2 border-brand-accent flex items-center justify-center mb-md animate-pulse">
                  <Sparkles className="w-8 h-8 text-brand-accent animate-spin" />
                </div>
                <h3 className="text-heading-3 font-serif text-ink-deep mb-2">
                  Architectural AI Redesign in Progress
                </h3>
                <p className="text-body-md text-brand-accent font-medium max-w-md animate-fade-in">
                  {generationStep}
                </p>
                <p className="text-body-xs text-slate mt-2 max-w-sm">
                  We are preserving your walls, ceiling height, and window viewpoints while applying authentic finishes from the VISTA catalogue.
                </p>
              </Card>
            ) : generatedImage && originalImage ? (
              /* Generated Results Interface */
              <Card className="p-lg space-y-md">
                {/* Result Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-sm pb-sm border-b border-hairline-soft">
                  <div className="flex items-center gap-xs">
                    <Badge variant="tag-yellow">
                      {style}
                    </Badge>
                    <span className="text-body-xs text-slate">•</span>
                    <span className="text-body-xs font-medium text-ink-deep">
                      {roomType}
                    </span>
                  </div>

                  <div className="flex items-center gap-xs">
                    <Button
                      variant="secondary"
                      onClick={handleDownload}
                      className="flex items-center gap-1 text-body-xs py-1.5 px-3 h-auto"
                      title="Download Generated High-Res Image"
                    >
                      <Download className="w-3.5 h-3.5 text-slate" />
                      <span>Download</span>
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={handleSave}
                      disabled={isSaved}
                      className="flex items-center gap-1 text-body-xs py-1.5 px-3 h-auto"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-success-accent" />
                          <span className="text-success-accent font-medium">Saved</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5 text-slate" />
                          <span>Save Design</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => generateVisualization()}
                      className="flex items-center gap-1 text-body-xs py-1.5 px-3 h-auto"
                      title="Regenerate with current settings"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate" />
                      <span>Regenerate</span>
                    </Button>
                  </div>
                </div>

                {saveSuccessMsg && (
                  <div className="p-sm rounded-lg bg-surface-pricing-featured border border-brand-yellow text-ink-deep text-body-xs flex items-center gap-xs animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-brand-accent" />
                    <span>Design saved to your VISTA account portfolio!</span>
                  </div>
                )}

                {/* Interactive Before/After Split-Drag Slider */}
                <ImageComparisonSlider
                  originalImage={originalImage}
                  generatedImage={generatedImage}
                  originalLabel="Original Empty Room"
                  generatedLabel={`${style} Redesign`}
                />

                {/* Alternative Variations Generator */}
                <div className="pt-md border-t border-hairline-soft">
                  <div className="flex items-center justify-between mb-sm">
                    <div className="flex items-center gap-xs">
                      <Layers className="w-4 h-4 text-brand-accent" />
                      <span className="text-body-xs font-semibold uppercase tracking-wider text-slate">
                        Explore Alternative Variations
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-xs">
                    {["Japandi", "Scandinavian", "Industrial Luxury", "Contemporary Warmth"].map(
                      (altStyle) => (
                        <button
                          key={altStyle}
                          type="button"
                          onClick={() => generateVariation(altStyle)}
                          className="px-md py-1.5 rounded-lg text-body-xs font-medium bg-surface hover:bg-surface-pricing-featured border border-hairline hover:border-brand-accent text-ink transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-brand-accent" />
                          <span>Try in {altStyle}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Matched Catalogue Materials */}
                <MatchedProductsSection
                  products={matchedProducts}
                  designSummary={designSummary}
                />
              </Card>
            ) : (
              /* Empty Placeholder State */
              <Card className="p-xxl text-center flex flex-col items-center justify-center min-h-[460px] border-2 border-dashed border-hairline-strong">
                <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-md text-slate">
                  <ImageIcon className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-heading-3 font-serif text-ink-deep mb-2">
                  Ready to Redesign Your Room
                </h3>
                <p className="text-body-md text-slate max-w-md">
                  Upload an empty room photo on the left or click a sample room to begin. You'll get an interactive before-and-after slider with matching VISTA catalogue materials.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* History Slide-over Drawer */}
      <GenerationHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        isLoading={historyLoading}
        onSelect={(item) => loadHistoryItem(item)}
      />
    </div>
  );
}
