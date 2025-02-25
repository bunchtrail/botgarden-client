import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PlantFormPage from './pages/PlantFormPage';
import PlantsPage from './pages/PlantsPage';
import ReportsPage from './pages/ReportsPage';

// Создаем тему в стиле Apple для приложения
const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF', // Синий цвет Apple
      light: '#5AC8FA',
      dark: '#0062CC',
    },
    secondary: {
      main: '#FF2D55', // Розовый цвет Apple
      light: '#FF5E3A',
      dark: '#CC2347',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F7',
    },
    text: {
      primary: '#1D1D1F',
      secondary: '#86868B',
    },
    error: {
      main: '#FF3B30', // Красный Apple
    },
    warning: {
      main: '#FF9500', // Оранжевый Apple
    },
    info: {
      main: '#5AC8FA', // Голубой Apple
    },
    success: {
      main: '#34C759', // Зеленый Apple
    },
  },
  typography: {
    fontFamily:
      '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            opacity: 0.9,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: '#1D1D1F',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/plants' element={<PlantsPage />} />
          <Route path='/plants/new' element={<PlantFormPage />} />
          <Route path='/plants/:id/edit' element={<PlantFormPage />} />
          <Route path='/reports' element={<ReportsPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/map' element={<MapPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
