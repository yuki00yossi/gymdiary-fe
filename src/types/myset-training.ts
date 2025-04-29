// トレーニングセッションの基本データ型
export type WorkoutSetData = {
    weight?: number
    reps?: number
    distance?: number
    time?: string
    memo?: string
    done?: boolean
  }

  export type WorkoutData = {
    menu: string
    type: "weight" | "distance"
    unit: string
    memo?: string
    sets: WorkoutSetData[]
  }

  export type TrainingSessionData = {
    id: number
    name: string
    workouts: WorkoutData[]
  }

  // 前回の参考記録
  export type PreviousSessionData = {
    date: string,
    myset_name: string,
    workouts: {
      menu: string
      id: number,
      memo?: string,
      sets: {
        id: number,
        weight?: number
        reps?: number
        distance?: number
        time?: string
        memo?: string
      }[]
    }[]
  }

  // トレーニングステップの型
  export type TrainingStep = "menu" | "workout" | "interval" | "finish"

  // トレーニングセッション作成リクエスト
  export type CreateTrainingSessionRequest = {
    mysetId: number
    date: string // YYYY-MM-DD
    workouts: {
      menu: string
      type: "weight" | "distance"
      unit: string
      memo?: string
      sets: {
        weight?: number
        reps?: number
        distance?: number
        time?: string
        memo?: string
      }[]
    }[]
  }
