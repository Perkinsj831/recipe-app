import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#B22222', // FireBrick Red for primary
    },
    secondary: {
      main: '#FFFFFF', // White for secondary
    },
    background: {
      default: '#FFFFFF', // White background
      paper: '#FFFAFA', // Snow for paper background
    },
    text: {
      primary: '#000000', // Black for primary text
      secondary: '#B22222', // FireBrick Red for secondary text
    },
  },
  typography: {
    fontFamily: 'Georgia, serif', // Classic font style
  },
});

export default theme;
