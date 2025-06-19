import Toolbar from "./components/Toolbar";
import DrawingCanvas from "./canvas/DrawingCanvas";
import { ShapesProvider } from "./state/ShapesContext";
import { ToolProvider } from "./state/ToolContext";

function App() {
  // Placeholder handlers and state for Toolbar props
  const handleBringForward = () => {};
  const handleSendBackward = () => {};
  const canBringForward = false;
  const canSendBackward = false;
  return (
    <ToolProvider>
      <ShapesProvider>
        <div className="flex flex-col h-screen w-screen">
          <Toolbar
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            canBringForward={canBringForward}
            canSendBackward={canSendBackward}
          />
          <div className="flex-1 overflow-hidden">
            <DrawingCanvas />
          </div>
        </div>
      </ShapesProvider>
    </ToolProvider>
  );
}

export default App;
