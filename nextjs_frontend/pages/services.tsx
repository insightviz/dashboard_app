import { Title, Flex, Loader } from '@mantine/core';
import Head from 'next/head';
import { getCookie } from 'cookies-next';
import Layout from '../components/layout/Layout'
import ThemeProvider from '../context/AppTheme';

interface PageProps{
  savedMode: string,
  savedTheme: string,
}

export default function Services({savedMode, savedTheme}: PageProps) {
  return (    
    <ThemeProvider savedMode={savedMode} savedTheme={savedTheme}>
      <Layout>
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
      </Layout>
    </ThemeProvider>    
  );
}

export async function getServerSideProps(ctx: any) {
  return {
    props: {
      savedMode: getCookie('insightMode', ctx) || 'system',
      savedTheme: getCookie('insightTheme', ctx) || 'light',
    }, // will be passed to the page component as props
  }
}