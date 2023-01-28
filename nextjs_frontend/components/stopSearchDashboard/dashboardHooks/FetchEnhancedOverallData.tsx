import { constructURL } from "../../../assets/UtilFunctions"
import useSWR from 'swr'
import { enhancedData, error } from "../SharedTypes"

export default function FetchEnhancedOverallData (force: string, monthSliderValue: string) {   
  const { data, isLoading, error } = useSWR<enhancedData, error>(constructURL('/stopsearch/enhanceddata', {force: force, monthSliderValue: monthSliderValue}), {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  return {
    enhancedData: data,
    isEnhancedDataLoading: isLoading,
    enhancedDataError: error
  }
}