import { Group, Avatar, Text, Select } from '@mantine/core';
import Moon from '@geist-ui/icons/moon';
import Sun from '@geist-ui/icons/sun';
import Display from '@geist-ui/icons/display';
import { useAppThemeContext } from '../../context/AppTheme';
import { forwardRef } from 'react';
import { useReducedMotion } from '@mantine/hooks';

const ReactGA = ( await import('react-ga4')).default

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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
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

SelectItem.displayName = "SelectItem";



function SelectWrapper() {
  const { mode, changeMode } = useAppThemeContext();
  const shouldReduceMotion = useReducedMotion()
  return (
    <Select 
      itemComponent={SelectItem}
      data={themeOptions}
      icon={mode == 'system' ? <Avatar><Display size={20}/></Avatar> : mode == 'light' ? <Avatar color="yellow"><Sun size={20}/> </Avatar>: <Avatar color="dark"><Moon size={20}/></Avatar>}
      value={mode}
      onChange={e => { 
        changeMode(String(e))
        ReactGA.event({
          category: "theme_select",
          action: "theme_select",
          label: String(e),
        });
      }}            
      transition={shouldReduceMotion ? undefined : 'fade'}
      transitionDuration={shouldReduceMotion ? 0 : 400}
    />        
  );
}

export default SelectWrapper;