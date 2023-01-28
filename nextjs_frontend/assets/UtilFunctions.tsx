import { error, forceSelectOption } from "../components/stopSearchDashboard/SharedTypes";
import allForceOptions from "./Constants";
import dayjs from "dayjs"

export const constructURL = (baseUrl: string, parameters: Record<string, string>) => {
    const params = new URLSearchParams();
  
    for (const key of Object.keys(parameters)) {
      params.set(`${key}`, `${parameters[key]}`);
    }
  
    const fullUrl = `${baseUrl}?${params.toString()}`;
    return fullUrl
};
  
export function sentenceCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const fetcher = async (url:string) => {
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
  if (url.includes('/stopsearch/data')) {
    return res.json()
  } else if (url.includes('/stopsearch/forces')) {
    let forceSelectOptions: forceSelectOption[] = []
    const data = await res.json()
    allForceOptions.forEach(element => {
      if (data.includes(element.value)) {
        forceSelectOptions.push(element)
      }        
    });     
    return forceSelectOptions
  } else if (url.includes('/stopsearch/months')) {
    const data = await res.json() 
    return data.map((date: Date) => dayjs(date))
  }
}