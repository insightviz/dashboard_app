export interface error {
  info?: Record<string, string>,
  status?: number,
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

export interface segmentsData {
  label: string,
  count: number,
  percentage: string
}

export interface enhancedData {
  overall_enhanced_data?: overall_enhanced_data,
  ethnicity_data?: ethnicityData, 
  gender_data?: genderData
}

interface overall_enhanced_data {
  past_monthly_stop_search: categoryData[];
  past_monthly_stop_search_breakdown_by_race: categoryData[];
  past_monthly_stop_search_breakdown_by_gender: categoryData[];
}

interface categoryData {
  x: string;
  category?: string;
  y: number;
}

interface ethnicityData {
  breakdown_by_police_ethnicity: segmentsData[];
  breakdown_of_outcomes_by_ethnicity: segmentsData[];
  breakdown_of_object_of_search_by_ethnicity: segmentsData[];
}

interface genderData {
  breakdown_of_outcomes_by_gender: segmentsData[];
  breakdown_of_object_of_search_by_gender: segmentsData[];
}