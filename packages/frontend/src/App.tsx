import { Outlet } from "react-router-dom";
import { CommandPaletteProvider } from "@/context/CommandPaletteContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

function App() {
  return (
    <CommandPaletteProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CommandPaletteProvider>
  );
}

export default App;
