import { useAppThemeContext } from '../../context/AppTheme';
import Image from 'next/image'
import StopSearchDesktopDark from '../../public/StopSearchDesktopDark.jpg'
import StopSearchDesktopLight from '../../public/StopSearchDesktopLight.jpg'
import { useViewportSize, useElementSize } from '@mantine/hooks';
import styles from '../../styles/home.module.css'
import Link from 'next/link';
import { Card, Text, Button } from '@mantine/core';

const CardHome = () => {
  const { width } = useViewportSize();
  const { theme } = useAppThemeContext();
  const { ref, width: elementWidth } = useElementSize();
  
  return (
    <Card shadow="sm" p="lg" radius={width<641?0:"xl"} withBorder ref={ref} className={styles.text_card}>      
      <Card.Section>
        <Link href="/stopsearch">
          {
            theme=='dark' ?
            <Image className={styles.image} src={StopSearchDesktopDark} alt='Stop and search image dark' priority
            width={elementWidth+40} placeholder='blur'/>
            :
            <Image className={styles.image} src={StopSearchDesktopLight} alt='Stop and search image light' priority
            width={elementWidth+40} placeholder='blur'/>              
          }
        </Link>
      </Card.Section>
      <Text weight={500} mt="md" mb="xs">
        UK Stop and searches
      </Text>
      <Text size="sm" color="dimmed">
        {`Insights from stop and search data released by 'POLICE.UK'`}
      </Text>
      <Link href="/stopsearch">
        <Button variant="light" color="blue" fullWidth mt="md">
          Discover insights here
        </Button>
      </Link>
    </Card>
  );
}

export default CardHome;