import { Text, Paper } from '@mantine/core';
import  { error } from '../SharedTypes';

interface ErrorProps {
  error: error,
}
const ErrorWrapper = ({
  error  
}: ErrorProps) => { 
  return (    
    <Paper withBorder p="xl" radius="xl">
      <Text
        color="dimmed"
        transform="uppercase"
        weight={700}
        size="md"
        >
        {error.message}
      </Text>
    </Paper>
  )
}

export default ErrorWrapper;