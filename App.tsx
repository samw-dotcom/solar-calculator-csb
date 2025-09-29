import { SolarCalculator } from "./components/SolarCalculator";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <SolarCalculator />
      </div>
    </div>
  );
}