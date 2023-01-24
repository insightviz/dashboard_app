import { useAppThemeContext } from '../../context/AppTheme';
import Image from 'next/image'
import StopSearchMobileDark from '../../public/StopSearchMobileDark.jpg'
import StopSearchMobileLight from '../../public/StopSearchMobileLight.jpg'
import StopSearchDesktopDark from '../../public/StopSearchDesktopDark.jpg'
import StopSearchDesktopLight from '../../public/StopSearchDesktopLight.jpg'
import { useViewportSize } from '@mantine/hooks';
import styles from '../../styles/home.module.css'
import Link from 'next/link';

const CardHome = () => {
  const { width } = useViewportSize();
  const { theme } = useAppThemeContext();
  
  return (
    <Link href="/stopsearch" legacyBehavior>
      <div className={styles.stop_search} style={{height: width < 600 ? width : width < 1300 ? 9/16*width : 9/16*1300 , zIndex: 1}}>
        {
          theme == 'dark' ? 
          width < 600 ?
          <Image className={styles.image} src={StopSearchMobileDark} alt='Stop and search image' priority
          fill
          object-fit='cover' 
          /> 
          :
          <Image className={styles.image} src={StopSearchDesktopDark} alt='Stop and search image' priority
          fill
          object-fit='cover' />
          :
          width < 600 ?
          <Image className={styles.image} src={StopSearchMobileLight} alt='Stop and search image' priority
          fill
          object-fit='cover' /> 
          :
          <Image className={styles.image} src={StopSearchDesktopLight} alt='Stop and search image' priority
          fill
          object-fit='cover' />
        }
        <div className={styles.text_card} style={{zIndex: 100}}>
          <h3>UK Stop and searches</h3>
          <p>{"Insights from stop and search data released by 'POLICE.UK'"}</p>
          <Link href="/stopsearch">Discover insights here</Link>
        </div>
      </div>
    </Link>
  );
}

export default CardHome;