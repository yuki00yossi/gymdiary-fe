// マイセット一覧用の型
export type MySetSummary = {
    id: number
    name: string
    created_by: {
      id: number
      username: string
    }
    created_at: string
    updated_at: string
  }

// マイセット作成リクエスト用の型
export type CreateMySetRequest = {
    name: string
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

// マイセット詳細取得用の型
export type MySetDetail = {
    id: number
    name: string
    created_by: {
        id: number
        username: string
    }
    workouts: {
        id: number
        menu: string
        type: "weight" | "distance"
        unit: string
        memo?: string
        sets: {
        id: number
        weight?: number
        reps?: number
        distance?: number
        time?: string
        memo?: string
        }[]
    }[]
}

// マイセット記録作成リクエスト用の型
export type CreateMySetSessionRequest = {
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

// マイセット記録一覧用の型
export type MySetSessionSummary = {
    id: number
    date: string
    myset_name: string
    created_at: string
}

// マイセット記録詳細用の型
export type MySetSessionDetail = {
    id: number
    date: string
    myset_name: string
    workouts: {
        id: number
        menu: string
        type: "weight" | "distance"
        unit: string
        memo?: string
        sets: {
        id: number
        weight?: number
        reps?: number
        distance?: number
        time?: string
        memo?: string
        }[]
    }[]
}
