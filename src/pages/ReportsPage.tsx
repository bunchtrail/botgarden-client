import FileDownloadIcon from '@mui/icons-material/FileDownload';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { plantService } from '../services';
import { PlantFilters } from '../types';

const ReportsPage: React.FC = () => {
  // Состояния
  const [reportType, setReportType] = useState<'list' | 'card' | 'statistics'>(
    'list'
  );
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'word'>(
    'pdf'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Фильтры для отчетов
  const [filters, setFilters] = useState<PlantFilters>({});

  // Обработчик изменения фильтров
  const handleFilterChange = (name: keyof PlantFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  // Обработчик экспорта отчета
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      const blob = await plantService.exportData(exportFormat, filters);

      // Создаем ссылку для скачивания файла
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plants-report.${
        exportFormat === 'excel' ? 'xlsx' : exportFormat
      }`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setSuccess(
        `Отчет успешно экспортирован в формате ${exportFormat.toUpperCase()}`
      );
      setLoading(false);
    } catch (err) {
      setError(`Ошибка при экспорте отчета: ${err}`);
      setLoading(false);
      console.error('Error exporting report:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Отчеты и статистика
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id='report-type-label'>Тип отчета</InputLabel>
              <Select
                labelId='report-type-label'
                id='report-type'
                value={reportType}
                label='Тип отчета'
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <MenuItem value='list'>Список растений</MenuItem>
                <MenuItem value='card'>Карточки растений</MenuItem>
                <MenuItem value='statistics'>Статистика коллекции</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id='export-format-label'>Формат экспорта</InputLabel>
              <Select
                labelId='export-format-label'
                id='export-format'
                value={exportFormat}
                label='Формат экспорта'
                onChange={(e) => setExportFormat(e.target.value as any)}
              >
                <MenuItem value='pdf'>PDF</MenuItem>
                <MenuItem value='excel'>Excel</MenuItem>
                <MenuItem value='word'>Word</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              disabled={loading}
              sx={{ height: '56px' }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Экспортировать отчет'
              )}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant='h6' gutterBottom>
          Фильтры для отчета
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id='department-label'>Отдел</InputLabel>
              <Select
                labelId='department-label'
                id='department'
                value={filters.department || ''}
                label='Отдел'
                onChange={(e) =>
                  handleFilterChange('department', e.target.value)
                }
              >
                <MenuItem value=''>Все отделы</MenuItem>
                <MenuItem value='dendrology'>Дендрология</MenuItem>
                <MenuItem value='flora'>Флора</MenuItem>
                <MenuItem value='floriculture'>Цветоводство</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id='genus'
              label='Род'
              value={filters.genus || ''}
              onChange={(e) => handleFilterChange('genus', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              id='species'
              label='Вид'
              value={filters.species || ''}
              onChange={(e) => handleFilterChange('species', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id='has-herbarium-label'>Наличие гербария</InputLabel>
              <Select
                labelId='has-herbarium-label'
                id='has-herbarium'
                value={
                  filters.hasHerbarium === undefined ? '' : filters.hasHerbarium
                }
                label='Наличие гербария'
                onChange={(e) =>
                  handleFilterChange('hasHerbarium', e.target.value)
                }
              >
                <MenuItem value=''>Все</MenuItem>
                <MenuItem value='true'>Есть</MenuItem>
                <MenuItem value='false'>Нет</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Button
              variant='outlined'
              color='secondary'
              fullWidth
              onClick={() => setFilters({})}
              sx={{ height: '56px' }}
            >
              Сбросить фильтры
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity='success' sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant='h6' gutterBottom>
          Предварительный просмотр
        </Typography>

        <Box
          sx={{
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography color='text.secondary'>
            Здесь будет отображаться предварительный просмотр отчета (в
            разработке)
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ReportsPage;
