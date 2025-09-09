import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Square, 
  Circle, 
  Type, 
  StickyNote, 
  ZoomIn, 
  ZoomOut,
  Hand,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Tool = "select" | "rectangle" | "circle" | "text" | "sticky" | "pan";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onClear,
  onExport,
  onImport,
}: ToolbarProps) => {
  const tools = [
    { id: "select" as Tool, icon: MousePointer, label: "Select" },
    { id: "pan" as Tool, icon: Hand, label: "Pan" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
    { id: "circle" as Tool, icon: Circle, label: "Circle" },
    { id: "text" as Tool, icon: Type, label: "Text" },
    { id: "sticky" as Tool, icon: StickyNote, label: "Sticky Note" },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-toolbar border border-border rounded-xl px-4 py-3 shadow-medium">
        {/* Tool selection */}
        <div className="flex items-center gap-1">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onToolChange(tool.id)}
                className={cn(
                  "h-10 w-10 p-0",
                  activeTool === tool.id && "bg-primary text-primary-foreground shadow-element"
                )}
                title={tool.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
            className="h-10 w-10 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="h-10 w-10 p-0"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onImport}
            className="h-10 w-10 p-0"
            title="Import"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-10 w-10 p-0"
            title="Export"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-10 w-10 p-0 text-destructive hover:text-destructive"
            title="Clear All"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};