import Toolbar from './components/Toolbar';
import DrawingCanvas from './canvas/DrawingCanvas';
import { ShapesProvider } from './state/ShapesContext';
import { ToolProvider } from './state/ToolContext';

function App() {
  return (
    <ToolProvider>
      <ShapesProvider>
        <div className="flex flex-col h-screen w-screen">
          <Toolbar />
          <div className="flex-1 overflow-hidden">
            <DrawingCanvas />
          </div>
        </div>
      </ShapesProvider>
    </ToolProvider>
  );
}

export default App;
