import { Select } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

interface SelectWrapperProps {
  itemComponent?: any,
  selectOptions: any,
  icons?: any,
  value: string,
  onChange: (e:string) => void,
  maxDropdownHeight?: number,
  ariaLabel?: string
}

function SelectWrapper({
  itemComponent,
  selectOptions,
  icons,
  value,
  onChange,
  maxDropdownHeight,
  ariaLabel
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
      maxDropdownHeight={maxDropdownHeight}
      aria-label={ariaLabel}
    />        
  );
}

export default SelectWrapper;