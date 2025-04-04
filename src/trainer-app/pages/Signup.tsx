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
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
import ApiClient from "@/lib/ApiClient";

import { AxiosError } from "axios";

const formSchema = z
  .object({
    name: z.string().min(1, "名前を入力してください"),
    username: z
      .string()
      .min(1, "メールアドレスを入力してください")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "ユーザー名は半角英数字とアンダーバーのみ使用できます"
      ),
    password: z
      .string()
      .min(1, "パスワードを入力してください")
      .min(8, "パスワードは8文字以上で入力してください"),
    confirmPassword: z.string().min(1, "パスワードを再入力してください"),
    terms: z.boolean().refine((val) => val === true, {
      message: "利用規約とプライバシーポリシーに同意する必要があります",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export default function TrainerSignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await ApiClient.post(
        import.meta.env.VITE_API_ROOT + "/account/register/",
        {
          username: values.username,
          password: values.password,
          name: values.name,
          role: "member",
        }
      );

      toast("会員登録が完了しました。", {
        description: "会員登録が完了しました。ログインしてください。",
        action: {
          label: "ログイン画面へ",
          onClick: () => navigate("/login"),
        },
      });

      //   navigate("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ [key: string]: string[] }>;
      if (axiosError.status == 400 && axiosError.response?.data) {
        Object.entries(axiosError.response.data).forEach(([key, messages]) => {
          form.setError(key as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: (messages as string[])[0],
          });
        });
      }

      form.setError("root", {
        type: "manual",
        message: "アカウントの作成に失敗しました",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
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
              <CardTitle className="text-2xl font-bold">
                トレーナー登録
              </CardTitle>
              <CardDescription>
                アカウントを作成して、トレーニングの記録を始めましょう
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="たろう"
                            className="bg-white"
                            {...field}
                            autoComplete="name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ユーザー名</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="taro123"
                            className="bg-white"
                            {...field}
                            autoComplete="username"
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
                            {...field}
                            autoComplete="current-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>パスワード（確認）</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-white"
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 hidden">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            <span>
                              <NavLink
                                to="/terms"
                                className="text-orange-600 hover:text-orange-500 hover:underline"
                              >
                                利用規約
                              </NavLink>{" "}
                              と{" "}
                              <NavLink
                                to="/privacy"
                                className="text-orange-600 hover:text-orange-500 hover:underline"
                              >
                                プライバシーポリシー
                              </NavLink>{" "}
                              に同意します
                            </span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  )}
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
                    アカウント作成
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                    すでにアカウントをお持ちの方は
                    <NavLink
                      to="/login"
                      className="text-orange-600 hover:text-orange-500 hover:underline ml-1"
                    >
                      ログイン
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
