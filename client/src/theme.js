import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B22222',
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFAFA',
    },
    text: {
      primary: '#000000',
      secondary: '#B22222',
    },
  },
  typography: {
    fontFamily: 'Georgia, serif',
  },
});

export default theme;
