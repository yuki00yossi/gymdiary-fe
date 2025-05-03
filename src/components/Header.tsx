import { NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AlignJustify, LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import ApiClient from "@/lib/ApiClient";

export function SiteHeader() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 z-50 w-full px-3 border-b bg-white/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_color-m5ei9scjhIDmgXUKDgYEqqcwCTF7c5.png"
                alt="Gym Diary Logo"
                className="object-contain"
              />
            </div>
            <span className="font-bold sm:inline-block bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Gym Diary
            </span>
          </NavLink>
          <nav className="hidden md:flex flex-1 items-center justify-end gap-4">
            <Button variant="ghost" asChild>
              <NavLink to="/features">機能紹介</NavLink>
            </Button>
            <Button variant="ghost" asChild>
              <NavLink to="/pricing">料金プラン</NavLink>
            </Button>
            <Button
              className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white"
              asChild
            >
              <NavLink to="/login">ログイン</NavLink>
            </Button>
          </nav>

          <nav className="flex flex-1 md:hidden items-center justify-end gap-4">
            <AlignJustify
              className="cursor-pointer"
              onClick={() => {
                setIsOpenMenu(!isOpenMenu);
              }}
            />
          </nav>
        </div>
      </header>
      <div
        className={`fixed md:hidden transition-all z-9999 ${
          isOpenMenu ? "right-0" : "right-[-100%]"
        } w-full h-full mt-16`}
      >
        <div className="flex w-full h-full">
          <div
            className="w-[27%] h-full bg-black/70"
            onClick={() => {
              setIsOpenMenu(!isOpenMenu);
            }}
          ></div>
          <div className="w-[75%] h-full bg-gray-500 shadow-lg">
            <div className="w-full py-2 px-4">
              <NavLink
                to="/settings"
                className="flex gap-2 items-center h-full w-full text-white p-2"
                onClick={() => {
                  setIsOpenMenu(!isOpenMenu);
                }}
              >
                <Settings />
                設定
              </NavLink>
              <Separator className="" />

              <NavLink
                to=""
                className="block flex mt-12 gap-2 items-center h-full w-full text-white p-2"
                onClick={async (e) => {
                  e.preventDefault();
                  // ログアウト処理を実行
                  // fetch(import.meta.env.VITE_API_ROOT + "/account/logout/", {
                  //   method: "POST",
                  //   credentials: "include",
                  // })
                  try {
                    const res = await ApiClient.post(
                      import.meta.env.VITE_API_ROOT + "/account/logout/"
                    );
                    console.log(res);
                    if (res.status === 200) {
                      // ログアウト成功
                      console.log("ログアウト成功");
                      toast("ログアウト成功", {
                        duration: 1500,
                        description: "ログアウトしました",
                      });
                      navigate("/login");
                    } else {
                      console.error("ログアウト失敗");
                      toast("ログアウト失敗", {
                        duration: 1500,
                        description: "ログアウト時にエラーが発生しました",
                      });
                    }
                  } catch (error: unknown) {
                    if (error instanceof Error) {
                      console.error("ログアウトエラー", error.message);
                      toast("ログアウト失敗", {
                        duration: 1500,
                        description: "ログアウト時にエラーが発生しました",
                      });
                    }
                  }
                  setIsOpenMenu(!isOpenMenu);
                }}
              >
                <LogOut />
                ログアウト
              </NavLink>
              <Separator className="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
