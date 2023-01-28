import { constructURL } from "../../../assets/UtilFunctions"
import useSWR from 'swr'
import { enhancedData, error } from "../SharedTypes"

export default function FetchEnhancedGenderData (force: string, gender: string, month: string) {   
  const { data, isLoading, error } = useSWR<enhancedData, error>(constructURL('/stopsearch/enhanceddata', month?{force: force, gender: gender, month: month}:{force: force, gender: gender}), {
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