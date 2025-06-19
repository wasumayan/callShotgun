import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4B91', // Vibrant pink
      light: '#FF8DC7',
      dark: '#C70039',
    },
    secondary: {
      main: '#00B4D8', // Bright cyan
      light: '#90E0EF',
      dark: '#0077B6',
    },
    background: {
      default: '#000000',
    },
  },
  typography: {
    fontFamily: '"Inter", "Nanum Gothic", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
          },
        },
      },
    },
  },
}); 