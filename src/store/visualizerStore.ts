import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface MatchedProduct {
  id: string;
  name: string;
  category: string;
  slug: string;
  base_price: number;
  pricing_unit: string;
  image_url: string;
  matchedReason: string;
}

export interface VisualizationRecord {
  id: string;
  user_id?: string;
  title?: string;
  original_image_url: string;
  generated_image_url: string;
  room_type: string;
  style: string;
  color_palette: string;
  lighting?: string;
  prompt: string;
  matched_products: MatchedProduct[];
  status?: string;
  created_at: string;
}

interface VisualizerState {
  originalImage: string | null;
  originalFile: File | null;
  generatedImage: string | null;
  designSummary: string | null;
  matchedProducts: MatchedProduct[];
  variations: Array<{
    id: string;
    generatedImageUrl: string;
    style: string;
    prompt: string;
    matchedProducts: MatchedProduct[];
  }>;
  status: "idle" | "generating" | "success" | "error";
  generationStep: string;
  error: string | null;
  missingApiKey: boolean;
  hasServerApiKey: boolean;
  history: VisualizationRecord[];
  historyLoading: boolean;
  isSaved: boolean;

  // Options
  roomType: string;
  style: string;
  colorPalette: string;
  lighting: string;
  customPrompt: string;

  // Setters
  setOriginalImage: (image: string | null, file?: File | null) => void;
  setOptions: (options: Partial<{
    roomType: string;
    style: string;
    colorPalette: string;
    lighting: string;
    customPrompt: string;
  }>) => void;
  generateVisualization: () => Promise<void>;
  generateVariation: (altStyle?: string) => Promise<void>;
  saveCurrentVisualization: (userId: string, title?: string) => Promise<boolean>;
  fetchHistory: (userId: string) => Promise<void>;
  loadHistoryItem: (item: VisualizationRecord) => void;
  checkHealth: () => Promise<void>;
  reset: () => void;
}

// Sample starter empty rooms for users who want to try the visualizer immediately
export const STARTER_EMPTY_ROOMS = [
  {
    id: "empty-living-1",
    label: "Spacious Living Room with Windows",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200",
    defaultRoomType: "Living Room",
    defaultStyle: "Modern Minimalist"
  },
  {
    id: "empty-bedroom-1",
    label: "Sunlit Empty Bedroom",
    url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
    defaultRoomType: "Bedroom",
    defaultStyle: "Japandi"
  },
  {
    id: "empty-office-1",
    label: "Concrete Shell & Study Nook",
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200",
    defaultRoomType: "Home Office",
    defaultStyle: "Industrial Luxury"
  }
];

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  originalImage: null,
  originalFile: null,
  generatedImage: null,
  designSummary: null,
  matchedProducts: [],
  variations: [],
  status: "idle",
  generationStep: "",
  error: null,
  missingApiKey: false,
  hasServerApiKey: false,
  history: [],
  historyLoading: false,
  isSaved: false,

  roomType: "Living Room",
  style: "Modern Minimalist",
  colorPalette: "Warm Neutrals & Oak",
  lighting: "Bright Natural Daylight",
  customPrompt: "",

  setOriginalImage: (image, file = null) => {
    set({
      originalImage: image,
      originalFile: file,
      generatedImage: null,
      matchedProducts: [],
      variations: [],
      status: "idle",
      error: null,
      isSaved: false
    });
  },

  setOptions: (options) => {
    set((state) => ({ ...state, ...options }));
  },

  checkHealth: async () => {
    try {
      const res = await fetch("/api/visualize/health");
      if (res.ok) {
        const data = await res.json();
        set({ hasServerApiKey: Boolean(data.hasApiKey) });
      }
    } catch {
      // Server not reachable or static host
    }
  },

  generateVisualization: async () => {
    const { originalImage, roomType, style, colorPalette, lighting, customPrompt } = get();

    if (!originalImage) {
      set({ error: "Please upload or select an empty room photograph first." });
      return;
    }

    set({
      status: "generating",
      generationStep: "Analyzing architectural boundaries & window geometry...",
      error: null,
      missingApiKey: false
    });

    // Step progression animation for user feedback
    const stepTimer1 = setTimeout(() => {
      set({ generationStep: `Synthesizing ${style} materials & lighting perspective...` });
    }, 1500);

    const stepTimer2 = setTimeout(() => {
      set({ generationStep: "Applying photorealistic furniture, wood finishes & textures..." });
    }, 3200);

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          roomType,
          style,
          colorPalette,
          lighting,
          prompt: customPrompt
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!res.ok || !data.success) {
        set({
          status: "error",
          error: data.error || "Failed to generate interior visualization.",
          missingApiKey: Boolean(data.missingKey)
        });
        return;
      }

      set({
        status: "success",
        generatedImage: data.generatedImageUrl,
        designSummary: data.designSummary,
        matchedProducts: data.matchedProducts || [],
        isSaved: false
      });
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      set({
        status: "error",
        error: err?.message || "Network error communicating with AI server."
      });
    }
  },

  generateVariation: async (altStyle) => {
    const { originalImage, roomType, colorPalette, lighting, customPrompt, style } = get();
    if (!originalImage) return;

    const variationStyle = altStyle || (style === "Japandi" ? "Scandinavian" : "Japandi");

    set({
      status: "generating",
      generationStep: `Generating alternative ${variationStyle} variation...`,
      error: null
    });

    try {
      const res = await fetch("/api/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: originalImage,
          roomType,
          style: variationStyle,
          colorPalette,
          lighting,
          prompt: `${customPrompt} (Alternative variation in ${variationStyle} style)`
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        set({
          status: "error",
          error: data.error || "Failed to generate variation."
        });
        return;
      }

      const newVariation = {
        id: `var-${Date.now()}`,
        generatedImageUrl: data.generatedImageUrl,
        style: variationStyle,
        prompt: customPrompt,
        matchedProducts: data.matchedProducts || []
      };

      set((state) => ({
        status: "success",
        generatedImage: data.generatedImageUrl,
        style: variationStyle,
        matchedProducts: data.matchedProducts || [],
        variations: [newVariation, ...state.variations],
        isSaved: false
      }));
    } catch (err: any) {
      set({
        status: "error",
        error: err?.message || "Failed to generate variation."
      });
    }
  },

  saveCurrentVisualization: async (userId: string, title?: string) => {
    const { originalImage, generatedImage, roomType, style, colorPalette, lighting, customPrompt, matchedProducts } = get();

    if (!userId || !originalImage || !generatedImage) return false;

    const record: VisualizationRecord = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `vis-${Date.now()}`,
      user_id: userId,
      title: title || `${style} ${roomType}`,
      original_image_url: originalImage,
      generated_image_url: generatedImage,
      room_type: roomType,
      style: style,
      color_palette: colorPalette,
      lighting: lighting,
      prompt: customPrompt,
      matched_products: matchedProducts,
      status: "completed",
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from("room_visualizations").insert([record]);

      if (error) {
        console.warn("Supabase insert notice (falling back to local cache):", error.message);
      }

      // Always save to local storage cache for guaranteed persistence
      const savedLocal = JSON.parse(localStorage.getItem(`vista_visualizations_${userId}`) || "[]");
      localStorage.setItem(`vista_visualizations_${userId}`, JSON.stringify([record, ...savedLocal]));

      set((state) => ({
        isSaved: true,
        history: [record, ...state.history.filter((h) => h.id !== record.id)]
      }));

      return true;
    } catch {
      // Local cache fallback
      const savedLocal = JSON.parse(localStorage.getItem(`vista_visualizations_${userId}`) || "[]");
      localStorage.setItem(`vista_visualizations_${userId}`, JSON.stringify([record, ...savedLocal]));
      set((state) => ({
        isSaved: true,
        history: [record, ...state.history.filter((h) => h.id !== record.id)]
      }));
      return true;
    }
  },

  fetchHistory: async (userId: string) => {
    if (!userId) return;

    set({ historyLoading: true });
    try {
      const { data, error } = await supabase
        .from("room_visualizations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        set({ history: data, historyLoading: false });
        return;
      }

      // Fallback to local cache
      const local = JSON.parse(localStorage.getItem(`vista_visualizations_${userId}`) || "[]");
      set({ history: local, historyLoading: false });
    } catch {
      const local = JSON.parse(localStorage.getItem(`vista_visualizations_${userId}`) || "[]");
      set({ history: local, historyLoading: false });
    }
  },

  loadHistoryItem: (item: VisualizationRecord) => {
    set({
      originalImage: item.original_image_url,
      generatedImage: item.generated_image_url,
      roomType: item.room_type || "Living Room",
      style: item.style || "Modern Minimalist",
      colorPalette: item.color_palette || "Warm Neutrals & Oak",
      lighting: item.lighting || "Bright Natural Daylight",
      customPrompt: item.prompt || "",
      matchedProducts: item.matched_products || [],
      status: "success",
      isSaved: true,
      error: null
    });
  },

  reset: () => {
    set({
      originalImage: null,
      originalFile: null,
      generatedImage: null,
      designSummary: null,
      matchedProducts: [],
      variations: [],
      status: "idle",
      generationStep: "",
      error: null,
      isSaved: false
    });
  }
}));
