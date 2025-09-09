import { useState } from "react";
import { Header } from "@/components/Header";
import { Toolbar, Tool } from "@/components/Toolbar";
import { Canvas, Element } from "@/components/Canvas";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useToast } from "@/hooks/use-toast";

const Whiteboard = () => {
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [elements, setElements] = useState<Element[]>([]);
  const [zoom, setZoom] = useState(1);
  const { toast } = useToast();

  const handleZoomIn = () => {
    setZoom(Math.min(3, zoom + 0.2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.1, zoom - 0.2));
  };

  const handleClear = () => {
    setElements([]);
    toast({
      title: "Canvas cleared",
      description: "All elements have been removed from the canvas.",
    });
  };

  const handleExport = () => {
    const data = JSON.stringify(elements, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whiteboard.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exported successfully",
      description: "Your whiteboard has been exported as a JSON file.",
    });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            setElements(data);
            toast({
              title: "Imported successfully",
              description: "Your whiteboard has been imported.",
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "The file format is not valid.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-screen overflow-hidden bg-gradient-subtle">
        <Header />
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onClear={handleClear}
          onExport={handleExport}
          onImport={handleImport}
        />
        <div className="pt-16 h-full">
          <Canvas
            activeTool={activeTool}
            elements={elements}
            onElementsChange={setElements}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Whiteboard;