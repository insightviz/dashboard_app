import { constructURL } from "../../../assets/UtilFunctions"
import { Dayjs } from "dayjs"
import useSWR from 'swr'
import  { error } from '../SharedTypes';

export default function FetchMonths (force: string) {
  const { data, isLoading, error } = useSWR<Dayjs[], error>(constructURL('/stopsearch/months', {force: force}), {
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