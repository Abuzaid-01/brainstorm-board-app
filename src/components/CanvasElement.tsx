import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Element } from "./Canvas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CanvasElementProps {
  element: Element;
  isSelected: boolean;
  onUpdate: (id: string, updates: Partial<Element>) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string | null) => void;
}

export const CanvasElement = ({
  element,
  isSelected,
  onUpdate,
  onDelete,
  onSelect,
}: CanvasElementProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content || "");
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (element.type === "text" || element.type === "sticky") {
      setIsEditing(true);
    }
  };

  const handleContentSave = () => {
    onUpdate(element.id, { content });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleContentSave();
    }
    if (e.key === "Escape") {
      setContent(element.content || "");
      setIsEditing(false);
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case "rectangle":
        return (
          <div
            className={cn(
              "border-2 border-primary bg-primary/10 rounded-md",
              isSelected && "ring-2 ring-ring ring-offset-2"
            )}
            style={{
              width: element.width,
              height: element.height,
            }}
          />
        );

      case "circle":
        return (
          <div
            className={cn(
              "border-2 border-primary bg-primary/10 rounded-full",
              isSelected && "ring-2 ring-ring ring-offset-2"
            )}
            style={{
              width: element.width,
              height: element.height,
            }}
          />
        );

      case "text":
        return (
          <div
            className={cn(
              "bg-transparent border border-transparent p-2 rounded",
              isSelected && "border-primary ring-2 ring-ring ring-offset-2"
            )}
            style={{
              width: element.width,
              height: element.height,
              minHeight: "40px",
            }}
          >
            {isEditing ? (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleContentSave}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent border-none outline-none text-foreground resize-none"
              />
            ) : (
              <div className="w-full h-full flex items-center text-foreground font-medium">
                {element.content || "Click to edit"}
              </div>
            )}
          </div>
        );

      case "sticky":
        return (
          <div
            className={cn(
              "rounded-lg p-3 shadow-soft relative",
              isSelected && "ring-2 ring-ring ring-offset-2",
              `bg-${element.color}`
            )}
            style={{
              width: element.width,
              height: element.height,
              minHeight: "150px",
            }}
          >
            {isSelected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            {isEditing ? (
              <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleContentSave}
                onKeyDown={handleKeyDown}
                className="w-full h-full bg-transparent border-none outline-none text-foreground resize-none"
                placeholder="Type your note..."
              />
            ) : (
              <div className="w-full h-full text-foreground text-sm">
                {element.content || "Double-click to edit"}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
      }}
      onClick={() => onSelect(element.id)}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}
    </div>
  );
};