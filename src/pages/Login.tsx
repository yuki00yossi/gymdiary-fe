import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
import { useAuth } from "@/lib/AuthContext";
import ApiClient from "@/lib/ApiClient";
import { AxiosError } from "axios";

const formSchema = z.object({
  username: z.string().min(1, "ユーザー名を入力してください"),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .min(8, "パスワードは8文字以上で入力してください"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [needVerify, setNeedVerify] = useState(false);
  const { setIsLoggedIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const loginURL = import.meta.env.VITE_API_ROOT + "/account/login/";

      await ApiClient.post(loginURL, values);
      setIsLoggedIn(true);
      navigate("/weight");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("ログインエラー", error);
        if (error.response?.status === 403) {
          form.setError("root", {
            type: "manual",
            message: "アカウントの有効化が必要です",
          });
          // setNeedVerify(true);
        }
      } else {
        console.error("ログインエラー", error);
        form.setError("root", {
          type: "manual",
          message: "ログインに失敗しました",
        });
      }
      setIsLoggedIn(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col items-center p-4 pt-20 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <div className="w-full max-w-lg space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 relative">
              <img
                src="/logo_color.png"
                alt="Gym Diary Logo"
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
              Gym Diary
            </h1>
          </div>

          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">ログイン</CardTitle>
              <CardDescription>
                ユーザー名とパスワードを入力してログインしてください
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ユーザー名</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="username"
                            className="bg-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>パスワード</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-white"
                            autoComplete="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                  <div className="text-sm">
                    <NavLink
                      to="/forgot-password"
                      className="text-orange-600 hover:text-orange-500 hover:underline"
                    >
                      パスワードをお忘れですか？
                    </NavLink>
                  </div>
                  <div className="text-sm">
                    <NavLink
                      to="/forgot-password"
                      className="text-orange-600 hover:text-orange-500 hover:underline"
                    >
                      パスワードをお忘れですか？
                    </NavLink>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    ログイン
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    アカウントをお持ちでない方は
                    <NavLink
                      to="/signup"
                      className="text-orange-600 hover:text-orange-500 hover:underline ml-1"
                    >
                      新規登録
                    </NavLink>
                  </p>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
