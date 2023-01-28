import { Text, Paper } from '@mantine/core';
import  { error } from '../SharedTypes';

interface ErrorProps {
  errorMessage: string | null,
  errorStatus?: number | null,
  errorInfo?: string | null,
}
const ErrorWrapper = ({
  errorMessage,
  errorStatus,
  errorInfo  
}: ErrorProps) => { 
  return (    
    <Paper withBorder p="xl" radius="xl">
      <Text
        color="dimmed"
        transform="uppercase"
        weight={700}
        size="md"
        >
          <>
            {errorMessage} 
            {errorStatus ? `Status code: `+{errorStatus}: undefined }
            {errorInfo ? `Error: `+{errorInfo}: undefined }
          </>
      </Text>
    </Paper>
  )
}

export default ErrorWrapper;