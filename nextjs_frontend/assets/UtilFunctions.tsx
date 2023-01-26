export const constructURL = (baseUrl: string, parameters: Record<string, string>) => {
    const params = new URLSearchParams();
  
    for (const key of Object.keys(parameters)) {
      params.set(`${key}`, `${parameters[key]}`);
    }
  
    const fullUrl = `${baseUrl}?${params.toString()}`;
    return fullUrl
};
  
export async function fetchData(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}, Message: ${response.statusText}`);
  } 
  return await response.json(); 
}

export function sentenceCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}