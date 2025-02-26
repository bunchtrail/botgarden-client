import BarChartIcon from '@mui/icons-material/BarChart';
import ForestIcon from '@mui/icons-material/Forest';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import MapIcon from '@mui/icons-material/Map';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import SpaIcon from '@mui/icons-material/Spa';
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Department } from '../types';

// Структура данных для карточек отделов
const departmentCards = [
  {
    id: 'dendrology',
    title: 'Дендрология',
    description:
      'Управление коллекцией деревьев и кустарников. Включает инвентаризацию, мониторинг состояния и планирование ухода.',
    buttonText: 'Управлять деревьями',
    icon: <ForestIcon sx={{ fontSize: 32 }} />,
    color: '#34C759',
    tooltip: 'Перейти к управлению коллекцией древесных растений',
    stats: '2,450 видов',
  },
  {
    id: 'flora',
    title: 'Флора',
    description:
      'Учет и мониторинг травянистых растений. Ведение документации по видам, состоянию и местоположению.',
    buttonText: 'Управлять травянистыми растениями',
    icon: <LocalFloristIcon sx={{ fontSize: 32 }} />,
    color: '#007AFF',
    tooltip: 'Перейти к управлению коллекцией травянистых растений',
    stats: '3,200 видов',
  },
  {
    id: 'floriculture',
    title: 'Цветоводство',
    description:
      'Работа с декоративными растениями. Планирование посадок, уход и контроль цветения.',
    buttonText: 'Управлять декоративными растениями',
    icon: <SpaIcon sx={{ fontSize: 32 }} />,
    color: '#FF2D55',
    tooltip: 'Перейти к управлению коллекцией декоративных растений',
    stats: '1,800 видов',
  },
];

const MainMenu: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  // Функция для перехода к выбранному отделу
  const handleDepartmentSelect = (department: Department) => {
    navigate(`/plants?department=${department}`);
  };

  // Функция для обработки поиска
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // В будущем здесь можно добавить логику для глобального поиска
  };

  return (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        display: 'flex',
        overflow: 'auto',
      }}
    >
      <Container
        maxWidth='lg'
        sx={{
          py: { xs: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 3, md: 4 },
            animation: 'fadeIn 0.6s ease-out',
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Typography
            variant='h2'
            component='h1'
            sx={{
              mb: 1,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: 'linear-gradient(45deg, #1a237e 30%, #0277bd 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Ботанический сад
          </Typography>
          <Typography
            variant='h5'
            color='text.secondary'
            sx={{
              mb: 2,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.4,
              fontWeight: 400,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            Информационная система для учета и управления коллекциями растений
          </Typography>

          {/* Глобальный поиск */}
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Поиск растений по названию, виду или местоположению...'
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              maxWidth: '700px',
              mb: { xs: 2, md: 3 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '28px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon color='action' />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Основной контент */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Карточки */}
          <Grid
            container
            spacing={3}
            sx={{
              mb: { xs: 3, md: 4 },
            }}
          >
            {departmentCards.map((card) => (
              <Grid item xs={12} md={4} key={card.id}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 28px ${alpha(card.color, 0.2)}`,
                      '& .card-stats': {
                        opacity: 1,
                        transform: 'translateY(0)',
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          color: card.color,
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: alpha(card.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '48px',
                          height: '48px',
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant='h6'
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.2,
                            mb: 0.5,
                          }}
                        >
                          {card.title}
                        </Typography>
                        <Typography
                          className='card-stats'
                          variant='caption'
                          sx={{
                            color: card.color,
                            fontWeight: 500,
                            opacity: 0.8,
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {card.stats}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {card.description}
                    </Typography>
                    <Tooltip title={card.tooltip} arrow>
                      <Button
                        variant='contained'
                        fullWidth
                        onClick={() =>
                          handleDepartmentSelect(card.id as Department)
                        }
                        sx={{
                          bgcolor: card.color,
                          borderRadius: '10px',
                          py: 1,
                          textTransform: 'none',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          mt: 'auto',
                          '&:hover': {
                            bgcolor: alpha(card.color, 0.9),
                            transform: 'scale(1.02)',
                            boxShadow: `0 8px 24px ${alpha(card.color, 0.25)}`,
                          },
                        }}
                      >
                        {card.buttonText}
                      </Button>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Нижняя секция */}
          <Box sx={{ mt: 'auto' }}>
            {/* Кнопка карты */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: { xs: 3, md: 4 },
              }}
            >
              <Tooltip title='Интерактивная карта расположения растений' arrow>
                <Button
                  variant='contained'
                  size='medium'
                  startIcon={<MapIcon />}
                  onClick={() => navigate('/map')}
                  sx={{
                    borderRadius: '12px',
                    px: 4,
                    py: 1,
                    bgcolor: theme.palette.primary.main,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.9),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${alpha(
                        theme.palette.primary.main,
                        0.25
                      )}`,
                    },
                  }}
                >
                  Открыть карту ботанического сада
                </Button>
              </Tooltip>
            </Box>

            <Divider sx={{ mb: { xs: 3, md: 4 } }} />

            {/* Нижние кнопки */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Tooltip title='Просмотр статистики и формирование отчетов' arrow>
                <Button
                  variant='outlined'
                  onClick={() => navigate('/reports')}
                  startIcon={<BarChartIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  Отчеты и статистика
                </Button>
              </Tooltip>
              <Tooltip
                title='Настройки системы и управление пользователями'
                arrow
              >
                <Button
                  variant='outlined'
                  onClick={() => navigate('/admin')}
                  startIcon={<SettingsIcon />}
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  Администрирование
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainMenu;
