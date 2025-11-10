import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { AuthProvider, useAuth } from "./providers/AuthProvider";

import { MainPage } from "./routes/MainPage";
import { LoginPage } from "./routes/LoginPage";
import { GameDetailPage } from "./routes/GameDetailPage";
import { GameUploadPage } from "./routes/GameUploadPage";
import { DownloadsPage } from "./routes/DownloadsPage";
import { MyGamesPage } from "./routes/MyGamesPage";

function RequireAuth() {
  const { user, loading } = useAuth();
  if (loading) return null;  
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell>
        <Routes>
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={() => (location.href = "/")} 
              />
            }
          />

          <Route element={<RequireAuth />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/game/:id" element={<GameDetailPage />} />
            <Route path="/upload" element={<GameUploadPage />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/my-games" element={<MyGamesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AppShell>
    </AuthProvider>
  );
}
