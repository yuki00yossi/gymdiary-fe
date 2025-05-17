import type {
    MySetSummary,
    CreateMySetRequest,
    MySetDetail,
    CreateMySetSessionRequest,
    MySetSessionSummary,
    MySetSessionDetail,
  } from "@/types/myset"
import ApiClient from "../ApiClient"

  // マイセット一覧を取得
  export async function fetchMySets(): Promise<MySetSummary[]> {
    // 実際の実装ではAPIリクエストを行う
    const response = await ApiClient.get("/training/mysets");
    console.log(response);
    return response.data;
  }

  // マイセットを作成
  export async function createMySet(data: CreateMySetRequest): Promise<MySetDetail> {
    const response = await ApiClient.post("/training/mysets/", data);
    return response.data;
  }

  // マイセット詳細を取得
  export async function fetchMySetById(id: number): Promise<MySetDetail> {
    const response = await ApiClient.get(`/training/mysets/${id}`);
    return response.data;
  }

  // マイセットを更新
  export async function updateMySet(id: number, data: CreateMySetRequest): Promise<MySetDetail> {
    const response = await ApiClient.put(`/training/mysets/${id}/`, data);
    console.log(response);
    return response.data;
  }

  // マイセットを削除
  export async function deleteMySet(id: number): Promise<void> {
    // 実際の実装ではAPIリクエストを行う
    const response = await ApiClient.delete(`/training/mysets/${id}/`);
    return response.data;
  }

  // マイセット記録を作成
  export async function createMySetSession(
    mysetId: number,
    data: CreateMySetSessionRequest,
  ): Promise<MySetSessionDetail> {
    // 実際の実装ではAPIリクエストを行う
    // const response = await fetch(`/api/training/mysets/${mysetId}/sessions`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // return response.json();

    // モックデータを返す
    return {
      id: 1,
      date: data.date,
      myset_name: mysetId === 1 ? "胸トレ" : mysetId === 2 ? "背中トレ" : "脚トレ",
      workouts: data.workouts.map((workout, index) => ({
        id: index + 1,
        ...workout,
        sets: workout.sets.map((set, setIndex) => ({
          id: setIndex + 1,
          ...set,
        })),
      })),
    }
  }

  // マイセット記録一覧を取得
  export async function fetchMySetSessions(): Promise<MySetSessionSummary[]> {
    // 実際の実装ではAPIリクエストを行う
    // const response = await fetch('/api/training/myset-sessions');
    // return response.json();

    // モックデータを返す
    return [
      {
        id: 1,
        date: "2023-04-10",
        myset_name: "胸トレ",
        created_at: "2023-04-10T10:00:00Z",
      },
      {
        id: 2,
        date: "2023-04-12",
        myset_name: "背中トレ",
        created_at: "2023-04-12T10:00:00Z",
      },
      {
        id: 3,
        date: "2023-04-14",
        myset_name: "脚トレ",
        created_at: "2023-04-14T10:00:00Z",
      },
    ]
  }

  // マイセット記録詳細を取得
  export async function fetchMySetSessionById(id: number): Promise<MySetSessionDetail> {
    // 実際の実装ではAPIリクエストを行う
    // const response = await fetch(`/api/training/myset-sessions/${id}`);
    // return response.json();

    // モックデータを返す
    const mysetName = id === 1 ? "胸トレ" : id === 2 ? "背中トレ" : "脚トレ"
    return {
      id: id,
      date: "2023-04-10",
      myset_name: mysetName,
      workouts: [
        {
          id: 1,
          menu: id === 1 ? "ベンチプレス" : id === 2 ? "懸垂" : "スクワット",
          type: "weight",
          unit: "kg",
          sets: [
            { id: 1, weight: 60, reps: 10 },
            { id: 2, weight: 70, reps: 8 },
            { id: 3, weight: 80, reps: 6 },
          ],
        },
        {
          id: 2,
          menu: id === 1 ? "ダンベルフライ" : id === 2 ? "ローイング" : "レッグプレス",
          type: "weight",
          unit: "kg",
          sets: [
            { id: 4, weight: 15, reps: 12 },
            { id: 5, weight: 17.5, reps: 10 },
            { id: 6, weight: 20, reps: 8 },
          ],
        },
      ],
    }
  }

  import type { CreateTrainingSessionRequest, PreviousSessionData, TrainingSessionData } from "@/types/myset-training"

  // マイセットの詳細を取得
  export async function getMySetForTraining(mysetId: number): Promise<TrainingSessionData> {
    const response = await fetchMySetById(mysetId);
    return response;
  }

  // 前回のトレーニングセッションを取得
  export async function getPreviousSession(mysetId: number): Promise<PreviousSessionData | null> {
    const response = await ApiClient.get(`/training/mysets/${mysetId}/record/`);
    return response.data;
  }

  // トレーニングセッションを保存
  export async function saveTrainingSession(
    data: CreateTrainingSessionRequest,
  ): Promise<{ success: boolean; id?: number }> {
    // 実際の実装ではAPIにデータを送信
    console.log("トレーニングセッションを保存:", data)
    const response = await ApiClient.post(`/training/mysets/${data.mysetId}/record/`, data);
    console.log(response.data);


    // 成功を模擬
    return {
      success: true,
      id: 123, // 新しく作成されたセッションのID
    }
  }

