import { useAppThemeContext } from '../../context/AppTheme';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useReducedMotion } from 'framer-motion';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#22b8e6',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ced4da',
    },
    '&:hover fieldset': {
      borderColor: '#ced4da',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#22b8e6',
    },
  },
});


export default function DatePickerWrapper({
  monthsData,
  datePickerDate,
  handleMonthChange,
  disabled,
  className
}) {
  const { theme } = useAppThemeContext();
  const shouldReduceMotion = useReducedMotion()

  const getDesignTokens = (theme) => ({
    palette: {
      mode: theme,
      ...(theme === 'light'
        ? {
            // palette values for light mode
            divider: 'f9a31a',
            text: {
              primary:'#000',
            },
          }
        : {
            // palette values for dark mode
            divider: 'ed4da',
            background: {
              paper: '#25262b'
            },
            text: {
              primary: '#C1C2C5',
            },
          }),
    },
    shape: {borderRadius: '32px'},
    typography: {
      fontSize: 22.4,
      fontFamily: 'var(--noto-font)'
    }
  });

  const muiTheme = createTheme(
    getDesignTokens(theme)
  );
  
  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month']}
          openTo="year"
          minDate={monthsData[0]}
          maxDate={monthsData.slice(-1)[0]}
          value={datePickerDate}
          onChange={handleMonthChange}
          disabled={disabled}
          className={className}
          reduceAnimations={shouldReduceMotion}
          renderInput={(params) => <CssTextField {...params} helperText={null} size="small" fullWidth/>}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};