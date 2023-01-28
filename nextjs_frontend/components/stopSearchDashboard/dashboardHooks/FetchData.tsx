import { constructURL } from "../../../assets/UtilFunctions"
import useSWR from 'swr'
import { Data, error } from "../SharedTypes"

export default function FetchData (force: string, month: string) {
  const { data, isLoading, error } = useSWR<Data, error>(constructURL('/stopsearch/data', month?{force: force, month: month}:{force: force}), {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true
  })
  return {
    data,
    isDataLoading: isLoading,
    dataError: error
  }
}