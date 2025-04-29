import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  ChevronLeft,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { AnimatedPage } from "@/components/animated-page";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import ApiClient from "@/lib/ApiClient";
import { AddFoodModal } from "@/components/AddMealItem";
import { FoodItem, FoodItemPost } from "@/types/food";
import { toast } from "sonner";
import { AddMealData } from "@/types/meal";

const timeOfDayOptions = [
  { value: "朝食", label: "朝食" },
  { value: "昼食", label: "昼食" },
  { value: "夕食", label: "夕食" },
  { value: "間食", label: "間食" },
];

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

const formSchema = z.object({
  date: z.date({
    required_error: "日付を選択してください",
  }),
  timeOfDay: z.string({
    required_error: "時間帯を選択してください",
  }),
  photo: z
    .instanceof(FileList)
    .optional()
    .transform((file) => (file && file.length > 0 ? file : undefined)),
  mealItems: z
    .array(
      z.object({
        meal_item_id: z.number(),
        name: z.string(),
        quantity: z.number().min(0, "0以上の値を入力してください"),
        unit: z.string(),
        calories: z.number(),
      })
    )
    .min(1, "少なくとも1つの食品を追加してください"),
});

type FormValues = z.infer<typeof formSchema>;

export default function MealEditPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<
    (typeof foodItems)[0] | null
  >(null);
  const [quantity, setQuantity] = useState("100");
  const [unit, setUnit] = useState("g");
  const [searchOpen, setSearchOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const { mealId } = useParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      timeOfDay: "朝食",
      mealItems: [],
    },
  });

  const mealItems = form.watch("mealItems");

  const handleAddMealItem = () => {
    if (!selectedFood) return;

    const newMealItem = {
      meal_item_id: selectedFood.id,
      name: selectedFood.name,
      quantity: Number.parseFloat(quantity),
      unit: unit,
      calories: Math.round(
        (selectedFood.calories * Number.parseFloat(quantity)) /
          selectedFood.base_quantity
      ),
    };

    form.setValue("mealItems", [...mealItems, newMealItem]);
    setSelectedFood(null);
    setQuantity(selectedFood.base_quantity.toString());
    setUnit(selectedFood.unit);
    setSearchTerm("");
  };

  const handleRemoveMealItem = (index: number) => {
    const updatedItems = [...mealItems];
    updatedItems.splice(index, 1);
    form.setValue("mealItems", updatedItems);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    // フォームの値をリセットするのではなく、プレビューだけをクリア
    setPhotoPreview(null);
    // ファイル入力をリセットするために参照を使用
    const fileInput = document.getElementById(
      "photo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    let photoUrl = null;
    if (photoFile) {
      const formData = new FormData();
      formData.append("photo", photoFile);
      const photoResponse = await ApiClient.post(
        import.meta.env.VITE_API_ROOT + "/meal/photo/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      photoUrl = photoResponse.data.photo_url;
    }

    let reqData: AddMealData = {
      date: format(data.date, "yyyy-MM-dd"),
      time_of_day: data.timeOfDay,
      meal_items: data.mealItems,
    };

    // **画像が削除された場合は `photo_key: null` を送信**
    if (!photoPreview) {
      reqData = { ...reqData, photo_key: null };
    }

    // **新しい画像がアップロードされた場合は `photo_key` を更新**
    if (photoUrl) {
      reqData = { ...reqData, photo_key: photoUrl };
    }

    await ApiClient.patch(
      import.meta.env.VITE_API_ROOT + `/meal/${mealId}/`,
      reqData
    );
    navigate("/meals");

    toast(`食事記録が完了しました`, {
      description: `${data.timeOfDay}の記録が完了しました。`,
    });

    setIsSubmitting(false);
  };

  // 合計カロリー計算
  const totalCalories = mealItems.reduce((sum, item) => sum + item.calories, 0);

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!mealId) {
      return;
    }
    fetchMealItems();
    fetchMealDetail();
  }, []);

  const fetchMealDetail = async () => {
    try {
      const res = await ApiClient.get(
        import.meta.env.VITE_API_ROOT + `/meal/${mealId}/`
      );

      // フォームの値を更新
      form.setValue("date", new Date(res.data.date));
      form.setValue("timeOfDay", res.data.time_of_day);
      const mealData = [];

      for (let i = 0; i < res.data.meal_items.length; i++) {
        mealData.push({
          meal_item_id: res.data.meal_items[i].meal_item.id,
          name: res.data.meal_items[i].meal_item.name,
          quantity: res.data.meal_items[i].quantity,
          unit: res.data.meal_items[i].unit,
          calories:
            (res.data.meal_items[i].meal_item.calories *
              Number.parseFloat(quantity)) /
            res.data.meal_items[i].meal_item.base_quantity,
        });
      }
      form.setValue("mealItems", mealData || []);

      // 画像のプレビューを設定
      if (res.data.photo_url) {
        setPhotoPreview(res.data.photo_url);
      }
    } catch (error) {
      console.error("食事データの取得に失敗:", error);
    }
  };

  const fetchMealItems = async () => {
    const res = await ApiClient.get(
      import.meta.env.VITE_API_ROOT + "/meal/items/"
    );

    setPhotoPreview(res.data.photo_url);

    setFoodItems(res.data);
  };

  const submitMealItem = async (data: FoodItemPost) => {
    const res = await ApiClient.post(
      import.meta.env.VITE_API_ROOT + "/meal/items/",
      data
    );

    setSelectedFood(res.data);
  };

  return (
    <AnimatedPage>
      <div className="p-4 w-full md:container md:mx-auto md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">食事を記録</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="date"
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
                    name="timeOfDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>時間帯</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="時間帯を選択" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeOfDayOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="photo"
                  render={() => (
                    <FormItem>
                      <FormLabel>写真</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {!photoPreview ? (
                            <div className="flex items-center justify-center w-full">
                              <label
                                htmlFor="photo-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <ImagePlus className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="text-sm text-gray-500">
                                    クリックして写真をアップロード
                                  </p>
                                </div>
                                <input
                                  id="photo-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handlePhotoChange}
                                />
                              </label>
                            </div>
                          ) : (
                            <div className="relative">
                              <img
                                src={photoPreview || "/placeholder.svg"}
                                alt="食事の写真"
                                className="w-full h-48 object-contain rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={handleRemovePhoto}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        食事の写真を追加すると、後で振り返る際に役立ちます
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>食品を追加</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <FormLabel>食品を検索</FormLabel>
                    <div className="flex gap-2">
                      <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {selectedFood ? selectedFood.name : "食品を選択"}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="食品名を入力..."
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />

                            <CommandList>
                              <CommandEmpty>
                                <Button
                                  variant="link"
                                  className="w-full text-left"
                                  onClick={() => {
                                    // setAddingNewFood(true);
                                    setSearchOpen(false);
                                    setAddFoodModalOpen(true);
                                  }}
                                >
                                  新しい食品を追加
                                </Button>
                              </CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-72">
                                  {filteredFoodItems.map((food) => (
                                    <CommandItem
                                      key={food.id}
                                      value={food.name}
                                      onSelect={() => {
                                        setSelectedFood(food);
                                        setQuantity(
                                          food.base_quantity.toString()
                                        );
                                        setUnit(food.unit);
                                        setSearchOpen(false);
                                      }}
                                    >
                                      <div className="flex flex-col">
                                        <span>{food.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                          {food.calories}kcal /{" "}
                                          {food.base_quantity}
                                          {food.unit}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                  <Button
                                    variant="link"
                                    className="w-full text-left"
                                    onClick={() => {
                                      // setAddingNewFood(true);
                                      setSearchOpen(false);
                                      setAddFoodModalOpen(true);
                                    }}
                                  >
                                    新しい食品を追加
                                  </Button>
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {selectedFood && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="quantity">数量</FormLabel>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                      <div>
                        <FormLabel htmlFor="unit">単位</FormLabel>
                        <Select value={unit} onValueChange={setUnit}>
                          <SelectTrigger id="unit">
                            <SelectValue placeholder="単位を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedFood && (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          {selectedFood.name} ({quantity}
                          {unit})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(
                            (selectedFood.calories *
                              Number.parseFloat(quantity)) /
                              selectedFood.base_quantity
                          )}
                          kcal
                        </p>
                      </div>
                      <Button type="button" onClick={handleAddMealItem}>
                        <Plus className="h-4 w-4 mr-2" />
                        追加
                      </Button>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="mealItems"
                    render={() => (
                      <FormItem>
                        <div className="space-y-4">
                          {mealItems.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-2">
                                <FormLabel>追加した食品</FormLabel>
                                <div className="space-y-2">
                                  {mealItems.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-3 border rounded-md"
                                    >
                                      <div>
                                        <p className="font-medium">
                                          {item.name}
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm text-muted-foreground">
                                            {item.quantity}
                                            {item.unit}
                                          </p>
                                          <Badge variant="secondary">
                                            {item.calories}kcal
                                          </Badge>
                                        </div>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          handleRemoveMealItem(index)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {
              <Card>
                <CardContent className="">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        合計カロリー
                      </p>
                      <p className="text-2xl font-bold">{totalCalories}kcal</p>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      保存する
                    </Button>
                  </div>
                </CardContent>
              </Card>
            }
          </form>
        </Form>
      </div>
      <AddFoodModal
        open={addFoodModalOpen}
        onOpenChange={setAddFoodModalOpen}
        onMealAdd={submitMealItem}
      />
    </AnimatedPage>
  );
}
