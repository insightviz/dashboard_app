import {Title } from '@mantine/core';
import Head from 'next/head';

export default function Custom500() {
    return (
      <>
        <Head>
            <meta charSet="utf-8" />
            <title>500</title>
            <meta name='description' content='500'/>
        </Head>
        <Title order={1} size={32} align="center">500 - Page Not Found</Title>
      </>
    )
}