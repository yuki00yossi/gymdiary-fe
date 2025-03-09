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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 単位オプション
const unitOptions = [
  { value: "g", label: "g" },
  { value: "ml", label: "ml" },
  { value: "個", label: "個" },
  { value: "枚", label: "枚" },
  { value: "本", label: "本" },
  { value: "杯", label: "杯" },
  { value: "カップ", label: "カップ" },
  { value: "人前", label: "人前" },
];

// フォームスキーマ
const formSchema = z.object({
  name: z.string().min(1, "食品名を入力してください"),
  calories: z.coerce.number().min(0, "0以上の値を入力してください"),
  protein: z.coerce.number().min(0, "0以上の値を入力してください"),
  fat: z.coerce.number().min(0, "0以上の値を入力してください"),
  carbs: z.coerce.number().min(0, "0以上の値を入力してください"),
  base_quantity: z.coerce.number().min(0, "0以上の値を入力してください"),
  unit: z.string().min(1, "単位を選択してください"),
});

export type FoodItem = z.infer<typeof formSchema>;

interface AddFoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealAdd: (data) => void;
}

export function AddFoodModal({
  open,
  onOpenChange,
  onMealAdd,
}: AddFoodModalProps) {
  const form = useForm<FoodItem>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      base_quantity: 100,
      unit: "g",
    },
  });

  const onSubmit = (data: FoodItem) => {
    onMealAdd(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>食品を追加</DialogTitle>
          <DialogDescription>
            新しい食品の情報を入力してください。追加した食品は食品リストに表示されます。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>食品名</FormLabel>
                  <FormControl>
                    <Input placeholder="例: 鶏むね肉" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="base_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>基準量</FormLabel>
                    <FormControl>
                      <Input type="number" defaultValue={"100"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>単位</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="単位を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {unitOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カロリー (kcal)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="protein"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タンパク質 (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
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
                    <FormLabel>脂質 (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carbs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>炭水化物 (g)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                キャンセル
              </Button>
              <Button type="submit">追加する</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
