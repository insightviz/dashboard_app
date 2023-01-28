import { constructURL } from "../../../assets/UtilFunctions"
import dayjs, { Dayjs } from "dayjs"
import useSWR from 'swr'
import  { error } from '../SharedTypes';

const MonthFetcher = async (url:string) => {
    const res = await fetch(url)
    
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error:error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }
  
    const data = await res.json() 
    return data.map((date: Date) => dayjs(date))
}

export default function FetchMonths (force: string) {
  const { data, isLoading, error } = useSWR<Dayjs[], error>(constructURL('/stopsearch/months', {force: force}), MonthFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  
  return {
    monthsData: data,
    isMonthsLoading: isLoading,
    monthsError: error
  }
}