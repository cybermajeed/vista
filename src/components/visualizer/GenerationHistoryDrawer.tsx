import React from "react";
import { X, Clock, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import type { VisualizationRecord } from "../../store/visualizerStore";

interface GenerationHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: VisualizationRecord[];
  isLoading: boolean;
  onSelect: (item: VisualizationRecord) => void;
  onDelete?: (id: string) => void;
}

export const GenerationHistoryDrawer: React.FC<GenerationHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  isLoading,
  onSelect,
  onDelete
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-ink-deep/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-canvas h-full shadow-2xl flex flex-col border-l border-hairline-strong animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-hairline-soft">
          <div className="flex items-center gap-xs">
            <Clock className="w-5 h-5 text-brand-accent" />
            <h3 className="text-heading-4 font-serif text-ink-deep">
              Generation History
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate hover:text-ink hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-lg space-y-md">
          {isLoading ? (
            <div className="text-center py-xxl text-slate text-body-sm">
              Loading your past designs...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-xxl text-slate">
              <Clock className="w-12 h-12 mx-auto mb-sm opacity-30" />
              <p className="text-body-md font-medium text-ink">No saved designs yet</p>
              <p className="text-body-xs text-slate mt-1 max-w-xs mx-auto">
                Once you generate an interior, click "Save Design" to store it here for future reference.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="group p-md rounded-xl border border-hairline-strong hover:border-brand-accent bg-surface-soft hover:bg-canvas transition-all duration-200 shadow-sm"
              >
                <div className="flex gap-md">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface border border-hairline relative">
                    <img
                      src={item.generated_image_url || item.original_image_url}
                      alt={item.title || "Room visualization"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm-medium text-ink-deep truncate">
                      {item.title || `${item.style || "Interior"} ${item.room_type || "Room"}`}
                    </h4>
                    <p className="text-[12px] text-brand-accent font-medium mt-0.5">
                      {item.style} • {item.room_type}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {item.prompt && (
                  <p className="mt-2 text-[11px] text-slate line-clamp-2 italic bg-surface p-1.5 rounded">
                    "{item.prompt}"
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-sm pt-sm border-t border-hairline-soft">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="text-slate hover:text-brand-red-dark p-1 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Button
                    variant="secondary"
                    className="ml-auto text-body-xs py-1 px-3 h-auto flex items-center gap-1"
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <span>Load in Visualizer</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
