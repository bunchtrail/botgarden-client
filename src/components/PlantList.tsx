import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { plantService, referenceService } from '../services';
import { Department, Family, Location, Plant, PlantFilters } from '../types';

const PlantList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Состояние для данных
  const [plants, setPlants] = useState<Plant[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние для пагинации
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Состояние для фильтров
  const [filters, setFilters] = useState<PlantFilters>({
    department: (searchParams.get('department') as Department) || undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Загрузка справочников
        const [familiesData, locationsData] = await Promise.all([
          referenceService.getFamilies(),
          referenceService.getLocations(),
        ]);

        setFamilies(familiesData);
        setLocations(locationsData);

        // Загрузка растений с учетом фильтров и пагинации
        const plantsResponse = await plantService.getPlants(
          page + 1,
          rowsPerPage,
          filters
        );
        setPlants(plantsResponse.data);
        setTotalCount(plantsResponse.pagination.total);

        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, [page, rowsPerPage, filters]);

  // Обработчики событий
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (name: keyof PlantFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({
      department: (searchParams.get('department') as Department) || undefined,
    });
    setPage(0);
  };

  const handleAddPlant = () => {
    navigate('/plants/new', { state: { department: filters.department } });
  };

  const handleEditPlant = (id: number) => {
    navigate(`/plants/${id}/edit`);
  };

  const handleDeletePlant = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это растение?')) {
      try {
        await plantService.deletePlant(id);
        // Обновляем список после удаления
        const plantsResponse = await plantService.getPlants(
          page + 1,
          rowsPerPage,
          filters
        );
        setPlants(plantsResponse.data);
        setTotalCount(plantsResponse.pagination.total);
      } catch (err) {
        setError('Ошибка при удалении растения');
        console.error('Error deleting plant:', err);
      }
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'word') => {
    try {
      const blob = await plantService.exportData(format, filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plants-export.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Ошибка при экспорте данных в формат ${format}`);
      console.error('Error exporting data:', err);
    }
  };

  // Получение названия отдела
  const getDepartmentName = (department?: Department) => {
    switch (department) {
      case 'dendrology':
        return 'Дендрология';
      case 'flora':
        return 'Флора';
      case 'floriculture':
        return 'Цветоводство';
      default:
        return 'Все отделы';
    }
  };

  // Получение названия семейства по ID
  const getFamilyName = (familyId: number) => {
    const family = families.find((f) => f.id === familyId);
    return family ? family.name : 'Не указано';
  };

  // Получение названия местоположения по ID
  const getLocationName = (locationId: number) => {
    const location = locations.find((l) => l.id === locationId);
    return location ? location.name : 'Не указано';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h4'>
          Растения: {getDepartmentName(filters.department)}
        </Typography>

        <Box>
          <Button
            variant='contained'
            color='primary'
            startIcon={<AddIcon />}
            onClick={handleAddPlant}
            sx={{ mr: 1 }}
          >
            Добавить растение
          </Button>

          <Button
            variant='outlined'
            startIcon={<FilterAltIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
          </Button>

          <Button
            variant='outlined'
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExport('excel')}
          >
            Экспорт
          </Button>
        </Box>
      </Box>

      {/* Фильтры */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label='Отдел'
                value={filters.department || ''}
                onChange={(e) =>
                  handleFilterChange('department', e.target.value)
                }
              >
                <MenuItem value=''>Все отделы</MenuItem>
                <MenuItem value='dendrology'>Дендрология</MenuItem>
                <MenuItem value='flora'>Флора</MenuItem>
                <MenuItem value='floriculture'>Цветоводство</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label='Семейство'
                value={filters.familyId || ''}
                onChange={(e) => handleFilterChange('familyId', e.target.value)}
              >
                <MenuItem value=''>Все семейства</MenuItem>
                {families.map((family) => (
                  <MenuItem key={family.id} value={family.id}>
                    {family.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label='Местоположение'
                value={filters.locationId || ''}
                onChange={(e) =>
                  handleFilterChange('locationId', e.target.value)
                }
              >
                <MenuItem value=''>Все местоположения</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.id}>
                    {location.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label='Инвентарный номер'
                value={filters.inventoryNumber || ''}
                onChange={(e) =>
                  handleFilterChange('inventoryNumber', e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label='Род'
                value={filters.genus || ''}
                onChange={(e) => handleFilterChange('genus', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label='Вид'
                value={filters.species || ''}
                onChange={(e) => handleFilterChange('species', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label='Наличие гербария'
                value={
                  filters.hasHerbarium === undefined ? '' : filters.hasHerbarium
                }
                onChange={(e) =>
                  handleFilterChange('hasHerbarium', e.target.value)
                }
              >
                <MenuItem value=''>Все</MenuItem>
                <MenuItem value='true'>Есть</MenuItem>
                <MenuItem value='false'>Нет</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleClearFilters}
                fullWidth
              >
                Сбросить фильтры
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Сообщение об ошибке */}
      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Таблица с данными */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Инв. номер</TableCell>
                <TableCell>Род</TableCell>
                <TableCell>Вид</TableCell>
                <TableCell>Сорт/Форма</TableCell>
                <TableCell>Семейство</TableCell>
                <TableCell>Местоположение</TableCell>
                <TableCell>Гербарий</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : plants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align='center'>
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                plants.map((plant) => (
                  <TableRow key={plant.id} hover>
                    <TableCell>{plant.inventoryNumber}</TableCell>
                    <TableCell>{plant.genus}</TableCell>
                    <TableCell>{plant.species}</TableCell>
                    <TableCell>{plant.cultivar || '-'}</TableCell>
                    <TableCell>{getFamilyName(plant.familyId)}</TableCell>
                    <TableCell>{getLocationName(plant.locationId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={plant.hasHerbarium ? 'Есть' : 'Нет'}
                        color={plant.hasHerbarium ? 'success' : 'default'}
                        size='small'
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <Tooltip title='Редактировать'>
                          <IconButton
                            size='small'
                            onClick={() => handleEditPlant(plant.id)}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Удалить'>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => handleDeletePlant(plant.id)}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component='div'
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage='Строк на странице:'
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} из ${count}`
          }
        />
      </Paper>
    </Box>
  );
};

export default PlantList;
