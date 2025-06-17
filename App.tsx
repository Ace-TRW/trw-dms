import React from "react";
import { UnifiedDMInterface } from "./components/UnifiedDMInterface/UnifiedDMInterface";
import { Provider as JotaiProvider } from "jotai";
import { ChatContextProvider } from "./contexts/ChatContext";
import useDimensions from "react-cool-dimensions";

const App: React.FC = () => {
  const { observe, width, height } = useDimensions();

  return (
    <JotaiProvider>
      <div
        ref={observe}
        className="h-screen w-screen overflow-hidden antialiased text-base-content bg-base-100"
        data-theme="custom_dark"
      >
        <ChatContextProvider containerWidth={width} containerHeight={height}>
          <UnifiedDMInterface />
        </ChatContextProvider>
      </div>
    </JotaiProvider>
  );
};

export default App;
