import { useRef, useState, useCallback, useEffect } from "react";
import { Tool } from "./Toolbar";
import { CanvasElement } from "./CanvasElement";

export interface Element {
  id: string;
  type: "rectangle" | "circle" | "text" | "sticky";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  color?: string;
}

interface CanvasProps {
  activeTool: Tool;
  elements: Element[];
  onElementsChange: (elements: Element[]) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const Canvas = ({
  activeTool,
  elements,
  onElementsChange,
  zoom,
  onZoomChange,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<Element | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const getMousePos = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - panOffset.x) / zoom,
      y: (e.clientY - rect.top - panOffset.y) / zoom,
    };
  }, [zoom, panOffset]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getStickyColor = (index: number) => {
    const colors = ["sticky-yellow", "sticky-pink", "sticky-blue", "sticky-green", "sticky-orange"];
    return colors[index % colors.length];
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);

    if (activeTool === "pan") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (activeTool === "select") {
      const clickedElement = elements.find(
        (el) =>
          pos.x >= el.x &&
          pos.x <= el.x + el.width &&
          pos.y >= el.y &&
          pos.y <= el.y + el.height
      );
      setSelectedElement(clickedElement?.id || null);
      if (clickedElement) {
        setDragStart({ x: pos.x - clickedElement.x, y: pos.y - clickedElement.y });
      }
      return;
    }

    if (activeTool === "text" || activeTool === "sticky") {
      const newElement: Element = {
        id: generateId(),
        type: activeTool === "sticky" ? "sticky" : "text",
        x: pos.x,
        y: pos.y,
        width: activeTool === "sticky" ? 150 : 200,
        height: activeTool === "sticky" ? 150 : 40,
        content: activeTool === "sticky" ? "New sticky note" : "New text",
        color: activeTool === "sticky" ? getStickyColor(elements.length) : undefined,
      };
      onElementsChange([...elements, newElement]);
      setSelectedElement(newElement.id);
      return;
    }

    setIsDrawing(true);
    const newElement: Element = {
      id: generateId(),
      type: activeTool as "rectangle" | "circle",
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    };
    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    const pos = getMousePos(e);

    if (activeTool === "select" && selectedElement && e.buttons === 1) {
      const elementIndex = elements.findIndex((el) => el.id === selectedElement);
      if (elementIndex !== -1) {
        const updatedElements = [...elements];
        updatedElements[elementIndex] = {
          ...updatedElements[elementIndex],
          x: pos.x - dragStart.x,
          y: pos.y - dragStart.y,
        };
        onElementsChange(updatedElements);
      }
      return;
    }

    if (isDrawing && currentElement) {
      const width = pos.x - currentElement.x;
      const height = pos.y - currentElement.y;
      setCurrentElement({
        ...currentElement,
        width: Math.abs(width),
        height: Math.abs(height),
        x: width < 0 ? pos.x : currentElement.x,
        y: height < 0 ? pos.y : currentElement.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (isDrawing && currentElement && currentElement.width > 5 && currentElement.height > 5) {
      onElementsChange([...elements, currentElement]);
    }
    setIsDrawing(false);
    setCurrentElement(null);
  };

  const handleElementUpdate = (id: string, updates: Partial<Element>) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );
    onElementsChange(updatedElements);
  };

  const handleElementDelete = (id: string) => {
    onElementsChange(elements.filter((el) => el.id !== id));
    setSelectedElement(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.1, Math.min(3, zoom + (e.deltaY > 0 ? -0.1 : 0.1)));
    onZoomChange(newZoom);
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-canvas overflow-hidden cursor-crosshair relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair",
        backgroundImage: `radial-gradient(circle, hsl(var(--canvas-grid)) 1px, transparent 1px)`,
        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
      }}
    >
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Render all elements */}
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            onUpdate={handleElementUpdate}
            onDelete={handleElementDelete}
            onSelect={setSelectedElement}
          />
        ))}

        {/* Render current drawing element */}
        {currentElement && (
          <CanvasElement
            element={currentElement}
            isSelected={false}
            onUpdate={() => {}}
            onDelete={() => {}}
            onSelect={() => {}}
          />
        )}
      </div>
    </div>
  );
};