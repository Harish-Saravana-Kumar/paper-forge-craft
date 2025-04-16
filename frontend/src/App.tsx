import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PaperBuilder from "./pages/PaperBuilder";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TestPaper from "./pages/TestPaper";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/paper-builder" replace />} />
          <Route path="/auth" element={<Auth />} />
          <Route 
            path="/paper-builder" 
            element={
              <ProtectedRoute>
                <PaperBuilder />
              </ProtectedRoute>
            } 
          />
          <Route path="/test-paper" element={<TestPaper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
