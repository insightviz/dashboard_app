import Document, { Head, Html, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';
import { emotionCache } from '../EmotionCache'

// optional: you can provide your cache as a fist argument in createStylesServer function
const stylesServer = createStylesServer(emotionCache);

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    // Add your app specific logic here
    
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles html={initialProps.html} server={stylesServer} key="styles" />,
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <noscript dangerouslySetInnerHTML={{
            __html: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PL5CDQD"
            height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`
            }}/>
        </body>
      </Html>
    );
  }
}