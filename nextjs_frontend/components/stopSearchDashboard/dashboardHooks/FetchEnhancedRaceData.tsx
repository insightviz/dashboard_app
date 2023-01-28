import { constructURL } from "../../../assets/UtilFunctions"
import useSWR from 'swr'
import { enhancedData, error } from "../SharedTypes"

export default function FetchEnhancedRaceData (force: string, race: string, month: string) {   
  const { data, isLoading, error } = useSWR<enhancedData, error>(constructURL('/stopsearch/enhanceddata', month?{force: force, ethnicity: race, month: month}:{force: force, ethnicity: race}), {
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