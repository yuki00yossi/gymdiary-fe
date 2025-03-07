import "./App.css";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { MobileNav } from "./components/mobile-nav";
import WeightPage from "./pages/weight";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "@/lib/ProtectedRoute";
import LoginPage from "./pages/Login";
import TrainingPage from "./pages/training/Training";
import { SiteHeader } from "./components/Header";
import TrainingDetailPage from "./pages/training/TrainingDetail";
import TrainingEditPage from "./pages/training/TrainingEdit";
import TrainingAddPage from "./pages/training/TrainingAdd";
import Chat from "./pages/chat/Chat";
import MealsPage from "./pages/meals/Meal";
import MealAddPage from "./pages/meals/Add";

function App() {
  return (
    <>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <BrowserRouter>
            <div className="hidden md:block">
              <AppSidebar />
            </div>
            <SiteHeader />
            <main className="flex-1 overflow-auto pt-16 pb-16 md:pb-0">
              <AuthProvider>
                <Routes>
                  <Route
                    path="/weight"
                    element={
                      <ProtectedRoute>
                        <WeightPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/training"
                    element={
                      <ProtectedRoute>
                        <TrainingPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/training/add"
                    element={
                      <ProtectedRoute>
                        <TrainingAddPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/training/:id"
                    element={
                      <ProtectedRoute>
                        <TrainingDetailPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/training/:id/edit"
                    element={
                      <ProtectedRoute>
                        <TrainingEditPage />
                      </ProtectedRoute>
                    }
                  ></Route>

                  {/* 食事管理 */}
                  <Route
                    path="/meals"
                    element={
                      <ProtectedRoute>
                        <MealsPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route
                    path="/meals/add"
                    element={
                      <ProtectedRoute>
                        <MealAddPage />
                      </ProtectedRoute>
                    }
                  ></Route>

                  {/* チャット */}
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  ></Route>
                  <Route path="/login" element={<LoginPage />}></Route>
                </Routes>
              </AuthProvider>
            </main>
            <MobileNav />
          </BrowserRouter>
        </div>
      </SidebarProvider>
    </>
  );
}

export default App;
