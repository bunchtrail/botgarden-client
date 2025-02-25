import AssessmentIcon from '@mui/icons-material/Assessment';
import ForestIcon from '@mui/icons-material/Forest';
import HomeIcon from '@mui/icons-material/Home';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LogoutIcon from '@mui/icons-material/Logout';
import MapIcon from '@mui/icons-material/Map';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaIcon from '@mui/icons-material/Spa';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // Структура меню навигации
  const menuItems = [
    { text: 'Главная', icon: <HomeIcon />, path: '/' },
    {
      text: 'Дендрология',
      icon: <ForestIcon />,
      path: '/plants?department=dendrology',
    },
    {
      text: 'Флора',
      icon: <LocalFloristIcon />,
      path: '/plants?department=flora',
    },
    {
      text: 'Цветоводство',
      icon: <SpaIcon />,
      path: '/plants?department=floriculture',
    },
    { text: 'Карта', icon: <MapIcon />, path: '/map' },
    { text: 'Отчеты', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Администрирование', icon: <SettingsIcon />, path: '/admin' },
  ];

  // Функция для определения активного элемента меню
  const isItemActive = (itemPath: string) => {
    // Для главной страницы - точное совпадение
    if (itemPath === '/') {
      return location.pathname === '/' && !location.search;
    }

    // Для страницы отчетов, администрирования и карты - точное совпадение пути
    if (
      itemPath === '/reports' ||
      itemPath === '/admin' ||
      itemPath === '/map'
    ) {
      return location.pathname === itemPath;
    }

    // Для страниц отделов - проверка пути и параметра department
    if (itemPath.startsWith('/plants?')) {
      const department = itemPath.split('=')[1];
      return (
        location.pathname === '/plants' &&
        location.search.includes(`department=${department}`)
      );
    }

    return false;
  };

  // Содержимое боковой панели
  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant='h6'>Ботанический сад</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = isItemActive(item.path);
          return (
            <ListItem
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              sx={{ bgcolor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <List>
        <ListItem onClick={() => console.log('Выход из системы')}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary='Выход' />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position='sticky'
        color='default'
        elevation={1}
        sx={{ bgcolor: '#ffffff' }}
      >
        <Toolbar>
          <IconButton
            edge='start'
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Ботанический сад
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {menuItems.map((item) => {
              const isActive = isItemActive(item.path);
              return (
                <Button
                  key={item.text}
                  onClick={() => handleNavigate(item.path)}
                  startIcon={item.icon}
                  color={isActive ? 'primary' : 'inherit'}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant='temporary'
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { bgcolor: '#ffffff' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;
