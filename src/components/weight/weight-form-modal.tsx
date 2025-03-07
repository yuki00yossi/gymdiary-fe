"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ja } from "date-fns/locale";
import ApiClient from "@/lib/ApiClient";

const formSchema = z.object({
  record_date: z.date({
    required_error: "日付を選択してください",
  }),
  weight: z
    .string()
    .min(1, "体重を入力してください")
    .regex(/^\d*\.?\d*$/, "数値を入力してください"),
  fat: z
    .string()
    .regex(/^\d*\.?\d*$/, "数値を入力してください")
    .optional(),
});

interface WeightFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: Date;
}

export function WeightFormModal({
  open,
  onOpenChange,
  defaultDate,
}: WeightFormModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      record_date: defaultDate,
      weight: "",
      fat: "",
    },
  });

  // デフォルトの日付が変更されたときにフォームの値を更新
  useEffect(() => {
    form.setValue("record_date", defaultDate);
  }, [defaultDate, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Save the data
    console.log(values);

    const res = await ApiClient.post(
      import.meta.env.VITE_API_ROOT + "/weight/",
      values
    );

    console.log(res);

    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>体重を記録</DialogTitle>
          <DialogDescription>
            体重と体脂肪率を記録しましょう。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="record_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日付</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年MM月dd日", {
                              locale: ja,
                            })
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ja}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>体重 (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="65.2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>体脂肪率 (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="18.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
