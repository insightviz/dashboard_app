import { Select } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

interface SelectWrapperProps {
  itemComponent?: any,
  selectOptions: any,
  icons?: any,
  value: string,
  onChange: (e:string) => void
}

function SelectWrapper({
  itemComponent,
  selectOptions,
  icons,
  value,
  onChange
}:SelectWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <Select 
      itemComponent={itemComponent}
      data={selectOptions}
      icon={icons}
      value={value}
      onChange={onChange}            
      transition={shouldReduceMotion ? undefined : 'fade'}
      transitionDuration={shouldReduceMotion ? 0 : 400}
    />        
  );
}

export default SelectWrapper;