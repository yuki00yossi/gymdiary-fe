import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import type { MySetSummary } from "@/types/myset";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Play, Plus } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

interface MySetListProps {
  mySets: MySetSummary[];
}

export function MySetList({ mySets }: MySetListProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 mb-20">
        {mySets.map((mySet, index) => (
          <motion.div
            key={mySet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <NavLink to={`/training/myset/${mySet.id}`}>
                  <CardTitle>{mySet.name}</CardTitle>
                </NavLink>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>作成者: {mySet.created_by.username}</p>
                  <p>
                    作成日:{" "}
                    {format(new Date(mySet.created_at), "yyyy年MM月dd日", {
                      locale: ja,
                    })}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-xs">
                <Button variant="outline" size="sm" asChild className="text-xs">
                  <NavLink to={`/training/myset/${mySet.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    見る
                  </NavLink>
                </Button>
                <Button size="sm" asChild className="text-xs">
                  <NavLink to={`/training/myset/${mySet.id}/record`}>
                    <Play className="mr-2 h-4 w-4" />
                    記録開始
                  </NavLink>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="fixed bottom-20 right-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg" asChild>
          <NavLink to="/training/myset/create">
            <Plus className="h-6 w-6" />
            <span className="sr-only">新規作成</span>
          </NavLink>
        </Button>
      </motion.div>
    </div>
  );
}
