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
import SignupPage from "./pages/Signup";
import { Toaster } from "./components/ui/sonner";
import MealDetailPage from "./pages/meals/Detail";
import MealEditPage from "./pages/meals/Edit";

import TrainerSignupPage from "./trainer-app/pages/Signup";
import VerifyEmailPage from "./pages/account/email_verification";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // CSRFトークンを取得する
    fetchCsrfToken();
  }, []);

  // CSRFトークンを取得する関数
  const fetchCsrfToken = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_API_ROOT + "/csrf/");
      if (!response.ok) {
        throw new Error("Failed to fetch CSRF token");
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

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
                {/** トレーナー用アプリのルーティング  */}
                <Routes>
                  <Route
                    path="/trainer-app/signup"
                    element={
                      <ProtectedRoute>
                        <TrainerSignupPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                </Routes>
                {/** ユーザー用アプリのルーティング  */}
                <Routes>
                  {/**  */}
                  <Route path="/" element={<SignupPage />}></Route>
                  <Route path="/signup" element={<SignupPage />}></Route>
                  {/** 体重管理 */}
                  <Route
                    path="/weight"
                    element={
                      <ProtectedRoute>
                        <WeightPage />
                      </ProtectedRoute>
                    }
                  ></Route>
                  {/** トレーニング管理 */}
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
                    path="/meals/:mealId"
                    element={
                      <ProtectedRoute>
                        <MealDetailPage />
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
                  <Route
                    path="/meals/:mealId/edit"
                    element={
                      <ProtectedRoute>
                        <MealEditPage />
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

                  {/* アカウント関連 */}
                  <Route path="/login" element={<LoginPage />}></Route>
                  <Route
                    path="/account/email_verification"
                    element={<VerifyEmailPage />}
                  ></Route>
                </Routes>
              </AuthProvider>
            </main>
            <MobileNav />
          </BrowserRouter>
        </div>
      </SidebarProvider>
      <Toaster />
    </>
  );
}

export default App;
