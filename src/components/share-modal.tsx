import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  generateTrainingImages,
  downloadImage,
  shareImage,
} from "@/lib/image-generator/training-image-generator";
import type { TrainingSessionData } from "@/types/myset-training";
import { Loader2, Download, Share2, Twitter, Instagram } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: TrainingSessionData;
  previousData?: any;
}

export function ShareModal({
  isOpen,
  onClose,
  sessionData,
  previousData,
}: ShareModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // モーダルが開いたら画像を生成
  useEffect(() => {
    if (isOpen && images.length === 0) {
      generateImages();
    }
  }, [isOpen]);

  // 画像を生成
  const generateImages = async () => {
    setIsGenerating(true);
    try {
      const generatedImages = await generateTrainingImages(
        sessionData,
        previousData
      );
      setImages(generatedImages);
    } catch (error) {
      console.error("画像生成エラー:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 画像をダウンロード
  const handleDownload = () => {
    if (images.length === 0) return;

    const date = new Date().toISOString().split("T")[0];
    const filename = `training-${sessionData.name}-${date}-${
      currentImageIndex + 1
    }.png`;
    downloadImage(images[currentImageIndex], filename);
  };

  // 画像をシェア
  const handleShare = async () => {
    if (images.length === 0) return;

    setIsSharing(true);
    try {
      const success = await shareImage(
        images[currentImageIndex],
        `${sessionData.name} トレーニング記録`
      );

      if (!success) {
        // Web Share APIが使えない場合はダウンロードを提案
        handleDownload();
      }
    } catch (error) {
      console.error("シェアエラー:", error);
    } finally {
      setIsSharing(false);
    }
  };

  // 前の画像へ
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // 次の画像へ
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <div className="w-6 h-6">
              <img
                src="/images/logo_color.png"
                alt="Gym Diary Logo"
                className="w-full h-full object-contain"
              />
            </div>
            トレーニング記録をシェア
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">
                画像を生成中...
              </p>
            </div>
          ) : images.length > 0 ? (
            <>
              <div className="relative w-full aspect-square bg-gradient-to-b from-orange-500 to-red-600 rounded-lg overflow-hidden shadow-xl p-2">
                <img
                  src={images[currentImageIndex] || "/placeholder.svg"}
                  alt="トレーニング記録"
                  className="w-full h-full object-contain z-10 relative"
                />

                {images.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                    <div className="bg-yellow-500/80 text-white rounded-full px-3 py-1 text-xs font-bold">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    前へ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className="hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    次へ
                  </Button>
                </div>
              )}

              <Tabs defaultValue="share" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="share">シェア</TabsTrigger>
                  <TabsTrigger value="download">ダウンロード</TabsTrigger>
                </TabsList>
                <TabsContent value="share" className="space-y-4 pt-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-6"
                      onClick={handleShare}
                      disabled={isSharing}
                    >
                      {isSharing ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <Share2 className="h-6 w-6 mb-1" />
                      )}
                      <span className="text-xs">シェア</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-6"
                    >
                      <Twitter className="h-6 w-6 mb-1" />
                      <span className="text-xs">Twitter</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col items-center py-6"
                    >
                      <Instagram className="h-6 w-6 mb-1" />
                      <span className="text-xs">Instagram</span>
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="download" className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center py-6"
                    onClick={handleDownload}
                  >
                    <Download className="h-6 w-6 mr-2" />
                    画像をダウンロード
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              画像の生成に失敗しました。再試行してください。
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
