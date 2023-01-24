import {Title } from '@mantine/core';
import Head from 'next/head';

export default function Custom404() {
    return (
      <>
        <Head>
            <meta charSet="utf-8" />
            <title>404</title>
            <meta name='description' content='404'/>
        </Head>
        <Title order={1} size={32} align="center">404 - Page Not Found</Title>
      </>
    )
}