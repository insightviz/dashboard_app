import Link from 'next/link';
import styles from "./Navbar.module.css"
import { Moon, Sun, Display, Menu, X } from '@geist-ui/icons';
import { useAppThemeContext } from '../../context/AppTheme';
import { Group, Avatar, Text, Select } from '@mantine/core';
import { forwardRef } from 'react';
import ReactGA from "react-ga4";
import { Burger } from '@mantine/core';
import { motion, AnimatePresence } from "framer-motion";

const themeOptions = [
  {
    image: 
    <Avatar>
      <Display size={20}/>
    </Avatar>,
    label: 'System',
    value: 'system',
  },
  {
    image: 
    <Avatar color="yellow">
      <Sun size={20}/>
    </Avatar>,
    label: 'Light',
    value: 'light',
  },
  {
    image: 
    <Avatar color="dark">
      <Moon size={20}/>
    </Avatar>,
    label: 'Dark',
    value: 'dark',
  },
];

const SelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        {image}
        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function Navbar({ click, handleClick, closeMobileMenu, handleThemeToggle }) {
  const { mode, setMode, theme } = useAppThemeContext();
  return (
    <header className={styles.navbar}>
      <nav className={styles.navbarContainer}>
        <div className={styles.menuIcon} onClick={handleClick}>
          <Burger
            opened={click}
            onClick={handleClick}
            size='md'
            color={theme == 'dark' ? '#C1C2C5' : '#000'}
          />
        </div>
        <Link href="/" className={styles.logoContainer}>
          <svg className={styles.navbarLogo} width="160" height="71" viewBox="0 0 160 71" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className={styles.bulb} d="M18.0754 52.72C17.9595 52.7214 17.8445 52.6995 17.7371 52.6558C17.6297 52.612 17.5322 52.5473 17.4502 52.4653C17.3682 52.3833 17.3034 52.2858 17.2597 52.1784C17.2159 52.071 17.1941 51.956 17.1954 51.84V44.57C17.1899 43.5632 16.9673 42.5695 16.5428 41.6566C16.1182 40.7436 15.5018 39.933 14.7354 39.28C12.4892 37.3656 10.7608 34.9167 9.70941 32.159C8.65802 29.4012 8.31743 26.4232 8.71902 23.4993C9.12061 20.5754 10.2515 17.7995 12.0074 15.4273C13.7634 13.0551 16.088 11.1629 18.7672 9.92496C21.4464 8.68699 24.394 8.14305 27.3386 8.34325C30.2832 8.54345 33.1301 9.48135 35.617 11.0706C38.104 12.6598 40.1511 14.8492 41.5698 17.4372C42.9886 20.0253 43.7333 22.9287 43.7354 25.88C43.7354 26.1108 43.6438 26.3321 43.4806 26.4952C43.3174 26.6584 43.0962 26.75 42.8654 26.75C42.6347 26.75 42.4134 26.6584 42.2502 26.4952C42.0871 26.3321 41.9954 26.1108 41.9954 25.88C42.0002 23.7602 41.5797 21.661 40.7588 19.7066C39.9379 17.7522 38.7333 15.9823 37.2163 14.5017C35.6993 13.0211 33.9008 11.8598 31.927 11.0866C29.9533 10.3133 27.8445 9.94387 25.7254 10C22.4943 10.0547 19.3573 11.0964 16.7352 12.9852C14.1131 14.874 12.1315 17.5196 11.0562 20.567C9.98091 23.6144 9.8634 26.9178 10.7195 30.0339C11.5755 33.15 13.3642 35.9297 15.8454 38C16.8099 38.8127 17.5852 39.8261 18.1172 40.9696C18.6492 42.113 18.925 43.3589 18.9254 44.62V51.89C18.9153 52.1104 18.8219 52.3186 18.6641 52.4727C18.5063 52.6268 18.2959 52.7152 18.0754 52.72Z" fill="white"/>
          <path className={styles.bulb} d="M26.1253 9.09311e-05C26.05 -0.00126484 25.9753 0.0125524 25.9055 0.0407176C25.8358 0.0688828 25.7724 0.110818 25.7192 0.16402C25.666 0.217222 25.6241 0.280599 25.5959 0.350368C25.5677 0.420136 25.5539 0.494864 25.5553 0.570091V5.88009C25.5735 6.017 25.6409 6.14263 25.7448 6.23362C25.8487 6.3246 25.9821 6.37476 26.1203 6.37476C26.2584 6.37476 26.3918 6.3246 26.4957 6.23362C26.5997 6.14263 26.667 6.017 26.6853 5.88009V0.570091C26.6866 0.495714 26.6731 0.421817 26.6455 0.352716C26.618 0.283615 26.577 0.220695 26.5248 0.167631C26.4727 0.114566 26.4105 0.0724203 26.3419 0.0436544C26.2733 0.0148885 26.1997 7.90696e-05 26.1253 9.09311e-05Z" fill="white"/>
          <path className={styles.bulb} d="M13.8754 3.70013C13.8381 3.6323 13.7874 3.57277 13.7264 3.52516C13.6654 3.47755 13.5953 3.44287 13.5205 3.42322C13.4456 3.40357 13.3676 3.39937 13.291 3.41087C13.2145 3.42238 13.1411 3.44934 13.0754 3.49013C13.0114 3.52731 12.9555 3.57679 12.9108 3.63572C12.8661 3.69465 12.8335 3.76185 12.8149 3.83344C12.7963 3.90503 12.792 3.9796 12.8024 4.05283C12.8128 4.12607 12.8376 4.19652 12.8754 4.26013L15.5254 8.86013C15.6007 8.98896 15.7235 9.08312 15.8675 9.12238C16.0114 9.16165 16.1651 9.14288 16.2954 9.07013C16.3601 9.03378 16.417 8.98491 16.4627 8.92636C16.5084 8.86782 16.5421 8.80076 16.5616 8.7291C16.5811 8.65744 16.5862 8.58261 16.5766 8.50896C16.5669 8.43532 16.5427 8.36433 16.5054 8.30013L13.8754 3.70013Z" fill="white"/>
          <path className={styles.bulb} d="M8.93539 15.4702L4.33539 12.8202C4.27178 12.7824 4.20133 12.7576 4.1281 12.7472C4.05486 12.7369 3.98029 12.7411 3.9087 12.7597C3.83711 12.7783 3.76991 12.8109 3.71098 12.8556C3.65206 12.9003 3.60257 12.9562 3.56539 13.0202C3.5278 13.0851 3.50342 13.1569 3.49363 13.2313C3.48385 13.3057 3.48886 13.3813 3.50837 13.4538C3.52788 13.5263 3.56151 13.5942 3.60733 13.6536C3.65316 13.7131 3.71027 13.7629 3.77539 13.8002L8.37539 16.4502C8.43959 16.4875 8.51058 16.5117 8.58422 16.5214C8.65787 16.5311 8.7327 16.526 8.80436 16.5064C8.87602 16.4869 8.94308 16.4533 9.00162 16.4076C9.06017 16.3619 9.10904 16.305 9.14539 16.2402C9.21814 16.1099 9.23691 15.9563 9.19764 15.8123C9.15838 15.6683 9.06422 15.5455 8.93539 15.4702Z" fill="white"/>
          <path className={styles.bulb} d="M6.51533 26.0501C6.51666 25.9757 6.50316 25.9018 6.47561 25.8327C6.44806 25.7636 6.40702 25.7007 6.35489 25.6476C6.30276 25.5946 6.24057 25.5524 6.17197 25.5237C6.10337 25.4949 6.02972 25.4801 5.95533 25.4801H0.645333C0.564829 25.4694 0.482961 25.476 0.405213 25.4994C0.327465 25.5229 0.255632 25.5627 0.194527 25.6162C0.133421 25.6697 0.0844537 25.7357 0.0509047 25.8096C0.0173558 25.8836 0 25.9639 0 26.0451C0 26.1263 0.0173558 26.2066 0.0509047 26.2806C0.0844537 26.3545 0.133421 26.4205 0.194527 26.474C0.255632 26.5275 0.327465 26.5673 0.405213 26.5908C0.482961 26.6142 0.564829 26.6208 0.645333 26.6101H5.95533C6.02887 26.6101 6.10169 26.5956 6.16964 26.5675C6.23758 26.5393 6.29931 26.4981 6.35131 26.4461C6.40331 26.3941 6.44456 26.3323 6.47271 26.2644C6.50085 26.1965 6.51533 26.1236 6.51533 26.0501Z" fill="white"/>
          <path className={styles.bulb} d="M8.37523 35.6402L3.77523 38.3002C3.71045 38.3365 3.65355 38.3854 3.60784 38.4439C3.56214 38.5025 3.52853 38.5695 3.50899 38.6412C3.48945 38.7129 3.48435 38.7877 3.49401 38.8613C3.50366 38.935 3.52787 39.006 3.56523 39.0702C3.64054 39.199 3.76337 39.2932 3.90734 39.3324C4.05131 39.3717 4.20494 39.3529 4.33523 39.2802L8.93523 36.6202C9.00089 36.5834 9.05866 36.5341 9.10526 36.475C9.15185 36.4159 9.18634 36.3482 9.20677 36.2757C9.2272 36.2033 9.23316 36.1276 9.22432 36.0528C9.21547 35.9781 9.192 35.9058 9.15523 35.8402C9.11846 35.7745 9.06911 35.7167 9.01002 35.6702C8.95092 35.6236 8.88322 35.5891 8.81079 35.5686C8.73836 35.5482 8.66262 35.5422 8.58788 35.5511C8.51315 35.5599 8.44089 35.5834 8.37523 35.6202V35.6402Z" fill="white"/>
          <path className={styles.bulb} d="M48.6754 13.0002C48.6382 12.9362 48.5887 12.8803 48.5298 12.8356C48.4709 12.7909 48.4037 12.7583 48.3321 12.7397C48.2605 12.7211 48.1859 12.7168 48.1127 12.7272C48.0395 12.7376 47.969 12.7624 47.9054 12.8002L43.3054 15.4502C43.2398 15.4876 43.1821 15.5376 43.1358 15.5973C43.0894 15.657 43.0553 15.7252 43.0353 15.7981C43.0154 15.871 43.01 15.9471 43.0194 16.0221C43.0289 16.0971 43.053 16.1695 43.0904 16.2352C43.1278 16.3008 43.1778 16.3585 43.2375 16.4048C43.2972 16.4512 43.3655 16.4853 43.4384 16.5052C43.5113 16.5252 43.5874 16.5306 43.6624 16.5212C43.7374 16.5117 43.8098 16.4876 43.8754 16.4502L48.4754 13.8002C48.5424 13.7621 48.601 13.7107 48.6476 13.6493C48.6942 13.5879 48.7279 13.5177 48.7466 13.443C48.7653 13.3682 48.7686 13.2904 48.7564 13.2143C48.7441 13.1382 48.7166 13.0653 48.6754 13.0002Z" fill="white"/>
          <path className={styles.bulb} d="M39.1454 3.49003C39.0812 3.45268 39.0102 3.42847 38.9366 3.41881C38.8629 3.40916 38.7881 3.41425 38.7164 3.43379C38.6448 3.45334 38.5777 3.48694 38.5192 3.53265C38.4606 3.57836 38.4117 3.63526 38.3754 3.70003L35.7154 8.30003C35.6786 8.36569 35.6551 8.43795 35.6463 8.51269C35.6375 8.58742 35.6434 8.66317 35.6639 8.7356C35.6843 8.80802 35.7188 8.87572 35.7654 8.93482C35.812 8.99392 35.8697 9.04326 35.9354 9.08003C36.0011 9.1168 36.0733 9.14028 36.1481 9.14912C36.2228 9.15797 36.2985 9.152 36.371 9.13158C36.4434 9.11115 36.5111 9.07665 36.5702 9.03006C36.6293 8.98347 36.6786 8.92569 36.7154 8.86003L39.3754 4.26003C39.4465 4.12733 39.4623 3.97187 39.4192 3.8276C39.3761 3.68334 39.2777 3.56198 39.1454 3.49003Z" fill="white"/>
          <path className={styles.name} d="M27.2153 54.0701H19.2753C19.0765 54.0701 18.9153 54.2312 18.9153 54.4301V54.4401C18.9153 54.6389 19.0765 54.8001 19.2753 54.8001H27.2153C27.4141 54.8001 27.5753 54.6389 27.5753 54.4401V54.4301C27.5753 54.2312 27.4141 54.0701 27.2153 54.0701Z" fill="white"/>
          <path className={styles.name} d="M26.6354 55.1201H19.8654C19.6665 55.1201 19.5054 55.2813 19.5054 55.4801V55.4901C19.5054 55.6889 19.6665 55.8501 19.8654 55.8501H26.6354C26.8342 55.8501 26.9954 55.6889 26.9954 55.4901V55.4801C26.9954 55.2813 26.8342 55.1201 26.6354 55.1201Z" fill="white"/>
          <path className={styles.name} d="M25.6953 56.1802H20.7953C20.5965 56.1802 20.4353 56.3414 20.4353 56.5402V56.5502C20.4353 56.749 20.5965 56.9102 20.7953 56.9102H25.6953C25.8941 56.9102 26.0553 56.749 26.0553 56.5502V56.5402C26.0553 56.3414 25.8941 56.1802 25.6953 56.1802Z" fill="white"/>
          <path className={styles.name} d="M30.1308 59.26V32.4565H38.2055V59.26H30.1308ZM55.1586 59.26V48.8115C55.1586 47.6277 54.978 46.7804 54.6166 46.2695C54.2677 45.7461 53.6945 45.4844 52.897 45.4844C52.2116 45.4844 51.6758 45.7524 51.2895 46.2882C50.9032 46.824 50.7101 47.5093 50.7101 48.3442V59.26H42.7475V40.12H50.7101V43.1106H50.7849C51.4204 42.0141 52.2739 41.1667 53.3456 40.5686C54.4172 39.958 55.5823 39.6527 56.8409 39.6527C61.0277 39.6527 63.1212 42.2944 63.1212 47.5779V59.26H55.1586ZM82.2612 52.9049C82.2612 55.0731 81.4325 56.7554 79.7752 57.9516C78.1304 59.1354 75.8313 59.7273 72.8781 59.7273C72.0183 59.7273 70.9529 59.6401 69.6819 59.4656C68.4233 59.2912 67.3953 59.0793 66.5978 58.8301V53.2414C68.9529 54.2881 70.9217 54.8115 72.5043 54.8115C74.0619 54.8115 74.8407 54.4065 74.8407 53.5965C74.8407 53.2601 74.66 52.9859 74.2986 52.7741C73.9373 52.5498 72.9902 52.1822 71.4575 51.6713C69.7629 51.1355 68.5292 50.4252 67.7566 49.5405C66.9841 48.6558 66.5978 47.5031 66.5978 46.0826C66.5978 44.1013 67.3828 42.5374 68.9529 41.391C70.5354 40.2322 72.7535 39.6527 75.607 39.6527C77.2768 39.6527 79.0463 39.8957 80.9154 40.3817V45.7461C80.1304 45.4097 79.2706 45.1293 78.336 44.905C77.4014 44.6807 76.6164 44.5686 75.9809 44.5686C75.4575 44.5686 75.0401 44.6558 74.7285 44.8302C74.417 45.0047 74.2613 45.2477 74.2613 45.5592C74.2613 45.9206 74.4295 46.2134 74.7659 46.4377C75.1024 46.662 75.7753 46.9299 76.7846 47.2414C78.741 47.8146 80.1428 48.5498 80.9902 49.447C81.8375 50.3442 82.2612 51.4968 82.2612 52.9049ZM93.6442 34.9612C93.6442 36.0827 93.233 36.9923 92.4106 37.6901C91.6007 38.3879 90.529 38.7368 89.1957 38.7368C87.8998 38.7368 86.8343 38.3755 85.9995 37.6527C85.177 36.93 84.7658 36.0328 84.7658 34.9612C84.7658 33.8646 85.1646 32.9799 85.9621 32.307C86.772 31.6217 87.8499 31.279 89.1957 31.279C90.529 31.279 91.6007 31.6217 92.4106 32.307C93.233 32.9799 93.6442 33.8646 93.6442 34.9612ZM85.2144 59.26V40.12H93.177V59.26H85.2144ZM117.775 56.5871C117.775 60.2631 116.616 63.1229 114.298 65.1665C111.993 67.2225 108.622 68.2506 104.186 68.2506C102.99 68.2506 101.831 68.1571 100.71 67.9702C99.5881 67.7833 98.7844 67.5715 98.2984 67.3347V61.0918C99.0959 61.5902 100.03 61.989 101.102 62.288C102.174 62.5871 103.127 62.7366 103.962 62.7366C105.744 62.7366 107.171 62.3067 108.242 61.4469C109.314 60.5871 109.85 59.4469 109.85 58.0264V56.8488H109.775C109.202 57.7211 108.41 58.4189 107.401 58.9423C106.404 59.4656 105.333 59.7273 104.186 59.7273C101.719 59.7273 99.7688 58.8737 98.3358 57.1666C96.9028 55.447 96.1863 53.0794 96.1863 50.0638C96.1863 47.9953 96.5601 46.1698 97.3078 44.5873C98.0554 43.0047 99.0959 41.7898 100.429 40.9424C101.763 40.0826 103.233 39.6527 104.84 39.6527C107.046 39.6527 108.691 40.4689 109.775 42.1013H109.85V40.12H117.775V56.5871ZM109.981 49.148C109.981 48.0265 109.725 47.1355 109.214 46.4751C108.716 45.8147 108.049 45.4844 107.214 45.4844C106.317 45.4844 105.601 45.8832 105.065 46.6807C104.529 47.4782 104.261 48.5436 104.261 49.8769C104.261 51.1106 104.485 52.0887 104.934 52.8115C105.382 53.5342 106.093 53.8956 107.065 53.8956C107.974 53.8956 108.685 53.528 109.195 52.7928C109.719 52.0451 109.981 51.0483 109.981 49.8022V49.148ZM133.962 59.26V48.3442C133.962 46.4377 133.233 45.4844 131.775 45.4844C131.064 45.4844 130.522 45.7586 130.149 46.3069C129.775 46.8427 129.588 47.5343 129.588 48.3816V59.26H121.625V30.9238H129.588V42.7181H129.663C130.348 41.7337 131.177 40.9798 132.149 40.4565C133.133 39.9206 134.186 39.6527 135.307 39.6527C137.376 39.6527 138.952 40.3194 140.036 41.6527C141.12 42.9736 141.662 44.9237 141.662 47.5031V59.26H133.962ZM158.728 58.9983C158.366 59.1728 157.774 59.3348 156.952 59.4843C156.13 59.6463 155.139 59.7273 153.98 59.7273C151.762 59.7273 150.024 59.1167 148.765 57.8955C147.519 56.6744 146.896 54.9361 146.896 52.6806V45.634H143.887V40.12H146.896V36.363L154.746 34.1948V40.12H158.728V45.634H154.746V51.3722C154.746 53.0545 155.413 53.8956 156.746 53.8956C157.369 53.8956 158.03 53.7585 158.728 53.4844V58.9983Z" fill="white"/>
          </svg>
        </Link>
        <div className={click ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>
          <Link href="/" className={styles.navLinks} onClick={closeMobileMenu}>Home</Link>
          <Link href="/services" className={styles.navLinks} onClick={closeMobileMenu}>Services</Link>
        </div>
        <AnimatePresence initial={false} mode="wait">
          {
            mode==='system' ? 
            <motion.div
              className={styles.themeToggle} onClick={handleThemeToggle}
              initial={{ y: -15, scale: .8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: .8 }}
              transition={{ duration: 0.3 }}
              key="system">
              <Display size={24}/>
            </motion.div> :
            (mode==='light' ? 
            <motion.div
              className={styles.themeToggle} onClick={handleThemeToggle}
              initial={{ y: -15, scale: .8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: .8 }}
              transition={{ duration: 0.3 }}
              key="light">
              <Sun size={24}/>
            </motion.div> :
            <motion.div
              className={styles.themeToggle} onClick={handleThemeToggle}
              initial={{ y: -15, scale: .8 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: .8 }}
              transition={{ duration: 0.3 }}
              key="dark">
              <Moon size={24}/>
            </motion.div>)
          }
        </AnimatePresence>
        <div className={styles.themeSelect}>
          <Select 
            itemComponent={SelectItem}
            data={themeOptions}
            searchable={true}
            icon={mode == 'system' ? <Avatar><Display size={20}/></Avatar> : mode == 'light' ? <Avatar color="yellow"><Sun size={20}/> </Avatar>: <Avatar color="dark"><Moon size={20}/></Avatar>}
            value={mode}
            onChange={e => { 
              setMode(e)
              ReactGA.event({
                category: "theme_select",
                action: "theme_select",
                label: e,
              });
            }}            
            transition='fade'
            transitionDuration={400}
          />
        </div>
      </nav> 
    </header>
  );
}

export default Navbar;