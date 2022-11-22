export interface error {
    error: boolean,
    message: string | null
}

export interface forceSelectOption {
    value: string,
    label: string
}

interface monthly_no_stop_search {
    monthly_no_stop_search: number,
    pct_change: number | string
}

interface no_stop_searches_by_race {
  ethnicity: string,
  no_of_stop_and_searches: number,
  percentage: number
}

interface no_stop_searches_by_gender {
  gender: string,
  no_of_stop_and_searches: number,
  percentage: number
}

export interface Data {
  monthly_no_stop_search: monthly_no_stop_search,
  breakdown_by_race: no_stop_searches_by_race[],
  breakdown_by_gender: no_stop_searches_by_gender[]
}