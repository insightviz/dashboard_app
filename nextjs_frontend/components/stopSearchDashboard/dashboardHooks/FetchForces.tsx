import { forceSelectOption, error } from '../SharedTypes';
import useSWRImmutable from 'swr/immutable'

export default function FetchForces () {
  const { data, isLoading, error } = useSWRImmutable<forceSelectOption[], error>('/stopsearch/forces')
  return {
    forcesData: data,
    isForcesLoading: isLoading,
    forceError: error
  }
}