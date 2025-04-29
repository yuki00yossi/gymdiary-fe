import { useState } from "react";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { AnimatedPage } from "@/components/animated-page";

// モックデータ - 実際のアプリケーションではAPIから取得
const chatRooms = [
  {
    id: "1",
    title: "トレーニングプラン相談",
    lastMessage: "ありがとうございます。とても参考になりました！",
    timestamp: new Date("2024-02-25T10:30:00"),
    unread: true,
  },
  {
    id: "2",
    title: "食事管理について",
    lastMessage: "プロテインの適切な摂取量について教えていただけますか？",
    timestamp: new Date("2024-02-24T15:45:00"),
    unread: false,
  },
  {
    id: "3",
    title: "ウェイトトレーニング相談",
    lastMessage: "デッドリフトのフォームについて質問があります。",
    timestamp: new Date("2024-02-23T09:15:00"),
    unread: false,
  },
];

export default function Chat() {
  const [isCollapsed] = useState(false);

  return (
    <AnimatedPage>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* サイドバー */}
        <div
          className={cn(
            "border-r bg-muted/40",
            "w-full",
            "transition-all duration-300 ease-in-out",
            "block"
          )}
        >
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center justify-between">
              <h2 className={cn("font-semibold", isCollapsed && "hidden")}>
                チャット
              </h2>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-white"
            >
              <NavLink to="/chat/new">
                <Plus className="h-4 w-4 mr-2" />
                {!isCollapsed && "新規チャット"}
              </NavLink>
            </Button>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <NavLink key={room.id} to={`/chat/${room.id}`}>
                    <div className="flex gap-2 rounded-lg p-3 text-sm transition-colors hover:bg-accent">
                      <div
                        className={cn(
                          "flex-1 overflow-hidden",
                          isCollapsed && "hidden"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{room.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {format(room.timestamp, "MM/dd", { locale: ja })}
                          </span>
                        </div>
                        <div className="mt-1 truncate text-sm text-muted-foreground">
                          {room.lastMessage}
                        </div>
                      </div>
                      {isCollapsed && (
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      )}
                      {room.unread && !isCollapsed && (
                        <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </NavLink>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
