
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { ToastProvider } from "./contexts/ToastContext";
import { LoginPage, SignupPage, HomePage, ListingDetailPage, MyBookingsPage } from "./pages";

function App() {
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {!token ? (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/bookings" element={<MyBookingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
