import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { InvestmentProvider } from "./contexts/InvestmentContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Reports from "./pages/Reports";
import DataManagement from "./pages/DataManagement";

function App() {
  return (
    <InvestmentProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/data" element={<DataManagement />} />
          </Routes>
        </Layout>
      </Router>
    </InvestmentProvider>
  );
}

export default App;
