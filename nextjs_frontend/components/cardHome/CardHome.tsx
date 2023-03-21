import { useAppThemeContext } from '../../context/AppTheme';
import Image from 'next/image'
import StopSearchDesktopDark from '../../public/StopSearchDesktopDark.jpg'
import StopSearchDesktopLight from '../../public/StopSearchDesktopLight.jpg'
import { useElementSize } from '@mantine/hooks';
import styles from '../../styles/home.module.css'
import Link from 'next/link';
import { Card, Text, Button } from '@mantine/core';

const CardHome = () => {
  const { theme } = useAppThemeContext();
  const { ref, width: elementWidth } = useElementSize();
  
  return (
    <Card p={32} radius="xl" ref={ref} className={styles.text_card}>      
      <Card.Section className={styles.cardTopSection}>
        <Link href="/stopsearch">
          {
            theme=='dark' ?
            <Image className={styles.image} src={StopSearchDesktopDark} alt='Stop and search image dark' priority
            width={elementWidth+64} placeholder='blur'/>
            :
            <Image className={styles.image} src={StopSearchDesktopLight} alt='Stop and search image light' priority
            width={elementWidth+64} placeholder='blur'/>              
          }
        </Link>
      </Card.Section>
      <Text weight={700} size={24} mt={32} mb={8} lh={1.2} color={ theme=='dark' ? 'supportCoolGrey.1' : 'supportCoolGrey.9'} >
        UK Stop and Search Dashboard
      </Text>
      <Text weight={400} size="md" color={ theme=='dark' ? 'supportCoolGrey.3' : 'supportCoolGrey.4'} lh={1.5}>
        {`Insights from stop and search data released by 'POLICE.UK'`}
      </Text>
      <Link href="/stopsearch">
        <Button variant="filled" fullWidth mt={16} fw={700} fz={16}>
          Discover insights
        </Button>
      </Link>
    </Card>
  );
}

export default CardHome;