export interface BaseSet {
    memo?: string
  }

  export interface WeightSet extends BaseSet {
    weight: number
    reps: number
  }

  export interface DistanceSet extends BaseSet {
    distance: number
    time: string // HH:mm:ss format
  }

  export interface BaseWorkout {
    menu: string
    type: "weight" | "distance"
    unit: string
    memo?: string
  }

  export interface WeightWorkout extends BaseWorkout {
    type: "weight"
    unit: "kg"
    sets: WeightSet[]
  }

  export interface DistanceWorkout extends BaseWorkout {
    type: "distance"
    unit: "km"
    sets: DistanceSet[]
  }

  export type Workout = WeightWorkout | DistanceWorkout

  export interface TrainingRecord {
    id: string
    date: string
    workouts: Workout[]
  }
