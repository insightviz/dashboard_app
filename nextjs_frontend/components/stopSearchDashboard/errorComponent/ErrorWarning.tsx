import { Text, Paper } from '@mantine/core';
import  { error } from '../SharedTypes';

const ErrorWrapper = ({
  message,
  status,
  info  
}: error) => { 
  return (    
    <Paper withBorder p="xl" radius="xl">
      <Text
        color="dimmed"
        transform="uppercase"
        weight={700}
        size="md"
        >          
        {message}          
      </Text>
      {
        status ? 
        <Text
          color="dimmed"
          transform="uppercase"
          weight={700}
          size="md"
          >
            Status code: {status}
        </Text>
        :
        undefined
      }
      {
        info ? 
        <Text
          color="dimmed"
          transform="uppercase"
          weight={700}
          size="md"
          >
            Error: {info.message}
        </Text>
        :
        undefined
      }
    </Paper>
  )
}

export default ErrorWrapper;