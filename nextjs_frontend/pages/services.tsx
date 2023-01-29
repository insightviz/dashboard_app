import { Title, Flex, Loader } from '@mantine/core';
import Head from 'next/head';

export default function Services() {
  return (    
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Services</title>
        <meta name='description' content='Services page'/>
      </Head>
      <Title order={1} align="center" size={32} mt={20}>Nothing to see on the services page</Title>
      <Flex
        mih={200}
        justify="center"
        align="center"
        direction="column">
        <Loader variant="bars" size='md' />
      </Flex>
    </>    
  );
}