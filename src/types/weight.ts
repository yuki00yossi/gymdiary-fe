export interface weightData {
    id: string;
    record_date: string;
    weight: number;
    fat?: number;
    created_at: string;
    updated_at?: string;
}

export interface weightCalendarData {
    weight: number;
    fat?: number;
}

export type weightDataList = Array<weightData>;

export type weightCalendarDataList = Record<string, weightCalendarData>;

