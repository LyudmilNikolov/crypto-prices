import { PriceProvider } from "./context/PriceContext";
import AppContent from "./components/AppContent.tsx";

const App = () => {
  return (
    <PriceProvider>
      <AppContent />
    </PriceProvider>
  );
};

export default App;
