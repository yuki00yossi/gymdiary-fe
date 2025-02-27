import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { MobileNav } from "./components/mobile-nav";
import WeightPage from "./pages/weight";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:block">
            <AppSidebar />
          </div>
          <main className="flex-1 overflow-auto pb-16 md:pb-0">
            <WeightPage />
          </main>
          <MobileNav />
        </div>
      </SidebarProvider>
    </>
  );
}

export default App;
