import allForceOptions from '../../../assets/Constants';
import { forceSelectOption, error } from '../SharedTypes';
import useSWRImmutable from 'swr'

export const ForceFetcher = async (url:string) => {
    const res = await fetch(url)
    
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
      const error: error = new Error('An error occurred while fetching the data.')
      // Attach extra info to the error object.
      error.info = await res.json()
      error.status = res.status
      throw error
    }
  
    let forceSelectOptions: forceSelectOption[] = []
    const data = await res.json()
    allForceOptions.forEach(element => {
      if (data.includes(element.value)) {
        forceSelectOptions.push(element)
      }        
    }); 
    
    return forceSelectOptions
  }
  
export default function FetchForces () {
  const { data, isLoading, error } = useSWRImmutable<forceSelectOption[], error>('/stopsearch/forces', ForceFetcher)
  return {
    forcesData: data,
    isForcesLoading: isLoading,
    forceError: error
  }
}