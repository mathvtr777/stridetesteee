import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize Capacitor configuration
const initCapacitor = async () => {
    try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#000000" }); // Optional: matches theme
    } catch (err) {
        console.warn('StatusBar plugin not available or running in web mode');
    }
};

initCapacitor();

createRoot(document.getElementById("root")!).render(<App />);
