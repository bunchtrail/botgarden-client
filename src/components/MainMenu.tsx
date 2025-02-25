import BarChartIcon from '@mui/icons-material/BarChart';
import ForestIcon from '@mui/icons-material/Forest';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaIcon from '@mui/icons-material/Spa';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Department } from '../types';

// Структура данных для карточек отделов
const departmentCards = [
  {
    id: 'dendrology',
    title: 'Дендрология',
    description: 'Учет и работа с коллекцией древесных растений',
    icon: <ForestIcon />,
    color: '#34C759',
  },
  {
    id: 'flora',
    title: 'Флора',
    description: 'Учет и работа с коллекцией травянистых растений',
    icon: <LocalFloristIcon />,
    color: '#007AFF',
  },
  {
    id: 'floriculture',
    title: 'Цветоводство',
    description: 'Учет и работа с коллекцией декоративных растений',
    icon: <SpaIcon />,
    color: '#FF2D55',
  },
];

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  // Функция для перехода к выбранному отделу
  const handleDepartmentSelect = (department: Department) => {
    navigate(`/plants?department=${department}`);
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#ffffff' }}>
      <Container maxWidth='md'>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant='h3' component='h1' sx={{ mb: 1 }}>
            Ботанический сад
          </Typography>
          <Typography variant='subtitle1' color='text.secondary'>
            Информационная система для учета и управления коллекциями растений
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {departmentCards.map((card) => (
            <Grid item xs={12} md={4} key={card.id}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: card.color, mr: 1 }}>{card.icon}</Box>
                    <Typography variant='h6'>{card.title}</Typography>
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: 2 }}
                  >
                    {card.description}
                  </Typography>
                  <Button
                    variant='contained'
                    fullWidth
                    onClick={() =>
                      handleDepartmentSelect(card.id as Department)
                    }
                    sx={{ bgcolor: card.color }}
                  >
                    Перейти к отделу
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Добавляем кнопку для перехода на страницу карты */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant='outlined'
            startIcon={<MapIcon />}
            onClick={() => navigate('/map')}
          >
            Открыть карту ботанического сада
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant='outlined'
            onClick={() => navigate('/reports')}
            startIcon={<BarChartIcon />}
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            Отчеты и статистика
          </Button>
          <Button
            variant='outlined'
            onClick={() => navigate('/admin')}
            startIcon={<SettingsIcon />}
          >
            Администрирование
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default MainMenu;
