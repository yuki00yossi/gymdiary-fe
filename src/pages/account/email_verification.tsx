import { useState } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
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
import { Loader2, CheckCircle2 } from "lucide-react";
import { AnimatedPage } from "@/components/animated-page";
import { toast } from "sonner";
import ApiClient from "@/lib/ApiClient";

// 確認コードのバリデーションスキーマ
const verificationSchema = z.object({
  code: z
    .string()
    .min(1, "確認コードを入力してください")
    .length(6, "確認コードは6桁です")
    .regex(/^[\dA-Z]+$/, "確認コードは半角英数字のみです"),
});

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const username = searchParams.get("user");

  console.log(username);

  // フォームの初期化
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  // 確認コード送信処理
  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await ApiClient.post(
        import.meta.env.VITE_API_ROOT + "/account/verify-email/",
        {
          username: username,
          token: values.code,
        }
      );
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (res.status == 200) {
        setIsVerified(true);

        toast("メールアドレスの確認が完了しました", {
          description:
            "アカウントが有効化されました。ログインしてサービスをご利用ください。",
        });

        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        console.error("確認コードの検証に失敗しました", res.statusText);
        form.setError("code", {
          type: "manual",
          message: "確認コードが無効です。もう一度お試しください。",
        });
      }
    } catch (error) {
      console.error("確認コードの検証に失敗しました", error);
      form.setError("code", {
        type: "manual",
        message: "確認コードが無効です。もう一度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 確認コード再送信処理
  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const res = await ApiClient.put(
        import.meta.env.VITE_API_ROOT + "/account/verify-email/resend/",
        {
          username: username,
          token: "000000",
        }
      );

      if (res.status == 200) {
        toast("確認コードを再送信しました", {
          description: "新しい確認コードをメールでお送りしました。",
        });
      } else {
        toast("エラーが発生しました", {
          description:
            "確認コードの再送信に失敗しました。後ほど再度お試しください。",
        });
      }
    } catch (error) {
      console.error("確認コードの再送信に失敗しました", error);
      toast("エラーが発生しました", {
        description:
          "確認コードの再送信に失敗しました。後ほど再度お試しください。",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
        <div className="w-full max-w-md space-y-8">
          <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                メールアドレスの確認
              </CardTitle>
              <CardDescription>
                {isVerified
                  ? "メールアドレスが確認されました。ログインページに移動します..."
                  : "登録したメールアドレスに送信された確認コードを入力してください"}
              </CardDescription>
            </CardHeader>

            {isVerified ? (
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-center text-muted-foreground">
                  アカウントが有効化されました。ログインページに移動しています...
                </p>
              </CardContent>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>確認コード</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="6桁の確認コード"
                              className="bg-white text-center text-lg tracking-widest"
                              maxLength={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="text-sm text-center mb-4">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-orange-600 hover:text-orange-500 hover:underline focus:outline-none disabled:opacity-50"
                      >
                        {isResending ? "送信中..." : "確認コードを再送信する"}
                      </button>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      確認する
                    </Button>

                    <p className="text-sm text-muted-foreground text-center">
                      <NavLink
                        to="/login"
                        className="text-orange-600 hover:text-orange-500 hover:underline"
                      >
                        ログインページに戻る
                      </NavLink>
                    </p>
                  </CardFooter>
                </form>
              </Form>
            )}
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
