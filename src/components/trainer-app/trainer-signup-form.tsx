import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2, X, Plus } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TrainerProfile } from "@/types/trainer";
import ApiClient from "@/lib/ApiClient";

// フォームのバリデーションスキーマ
const formSchema = z.object({
  bio: z
    .string()
    .min(10, "自己紹介は10文字以上で入力してください")
    .max(500, "自己紹介は500文字以内で入力してください"),
  career: z
    .string()
    .min(10, "経歴・実績は10文字以上で入力してください")
    .max(1000, "経歴・実績は1000文字以内で入力してください"),
  intro_video_url: z
    .string()
    .url("有効なURLを入力してください")
    .optional()
    .or(z.literal("")),
});

interface TrainerSignupFormProps {
  onSignupSuccess: (profile: TrainerProfile) => void;
}

export function TrainerSignupForm({ onSignupSuccess }: TrainerSignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certificationInput, setCertificationInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      career: "",
      intro_video_url: "",
    },
  });

  const addSpecialty = () => {
    if (specialtyInput.trim() && !specialties.includes(specialtyInput.trim())) {
      setSpecialties([...specialties, specialtyInput.trim()]);
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((item) => item !== specialty));
  };

  const addCertification = () => {
    if (
      certificationInput.trim() &&
      !certifications.includes(certificationInput.trim())
    ) {
      setCertifications([...certifications, certificationInput.trim()]);
      setCertificationInput("");
    }
  };

  const removeCertification = (certification: string) => {
    setCertifications(certifications.filter((item) => item !== certification));
  };

  const handleSpecialtyKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSpecialty();
    }
  };

  const handleCertificationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCertification();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (specialties.length === 0) {
      toast("入力エラー", {
        description: "得意分野を1つ以上入力してください",
      });
      return;
    }

    setIsLoading(true);

    try {
      // APIリクエストのデータを作成
      const trainerProfile: TrainerProfile = {
        ...values,
        specialties,
        certifications,
      };

      console.log(trainerProfile);

      // 実際のAPI呼び出し（今回はモックアップ）
      //   const response = await fetch(import.meta.env. + '/api/trainer-profile', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(trainerProfile),
      //   })
      const res = await ApiClient.post(
        "/trainers/trainer-profile/",
        trainerProfile
      );

      console.log(res);

      // モックの成功レスポンス
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 成功時の処理
      toast("プロフィール登録完了", {
        description: "トレーナープロフィールが正常に登録されました",
      });

      onSignupSuccess(trainerProfile);
    } catch (error) {
      console.error(error);
      toast("エラーが発生しました。", {
        description:
          "プロフィールの登録に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">トレーナー登録</CardTitle>
          <CardDescription>
            あなたのプロフィールを入力して、トレーナーとして活動を始めましょう
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* 自己紹介 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>自己紹介</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：はじめまして、◯◯です！初心者の方も安心してお任せください。"
                          className="resize-none min-h-[100px] text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* 得意分野（タグ入力） */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-2">
                  <FormLabel>得意分野</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {specialties.map((specialty, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm"
                      >
                        {specialty}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(specialty)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">削除</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={specialtyInput}
                      onChange={(e) => setSpecialtyInput(e.target.value)}
                      onKeyDown={handleSpecialtyKeyDown}
                      placeholder="例：筋トレ、ダイエット、ボディメイク"
                      className="flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addSpecialty}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">追加</span>
                    </Button>
                  </div>
                  {specialties.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      ※得意分野を1つ以上入力してください
                    </p>
                  )}
                </div>
              </motion.div>

              {/* 保有資格（タグ入力） */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-2">
                  <FormLabel>保有資格</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {certifications.map((certification, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm"
                      >
                        {certification}
                        <button
                          type="button"
                          onClick={() => removeCertification(certification)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">削除</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={certificationInput}
                      onChange={(e) => setCertificationInput(e.target.value)}
                      onKeyDown={handleCertificationKeyDown}
                      placeholder="例：NSCA-CPT、JATI-ATI"
                      className="flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={addCertification}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">追加</span>
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* 経歴・実績 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="career"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>経歴・実績</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：フィットネストレーナー歴5年。大会実績：○○優勝など。"
                          className="text-sm resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* 紹介動画URL */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="intro_video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>紹介動画URL（任意）</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://youtube.com/～"
                          {...field}
                          className="text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                登録して面談へ進む
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
}
