export interface TrainerProfile {
    bio: string
    specialties: string[]
    certifications: string[]
    career: string
    intro_video_url?: string
    id?: string // APIから返される場合に使用
  }
