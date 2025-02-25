import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { plantService } from '../services';
import { BiometryData } from '../types';

// Схема валидации для формы биометрических данных
const validationSchema = yup.object({
  date: yup.date().required('Дата измерения обязательна'),
  height: yup
    .number()
    .nullable()
    .min(0, 'Высота не может быть отрицательной')
    .max(1000, 'Высота не должна превышать 1000 см'),
  diameter: yup
    .number()
    .nullable()
    .min(0, 'Диаметр не может быть отрицательным')
    .max(1000, 'Диаметр не должен превышать 1000 см'),
  flowerSize: yup
    .number()
    .nullable()
    .min(0, 'Размер цветка не может быть отрицательным')
    .max(500, 'Размер цветка не должен превышать 500 см'),
  leafSize: yup
    .number()
    .nullable()
    .min(0, 'Размер листа не может быть отрицательным')
    .max(500, 'Размер листа не должен превышать 500 см'),
  notes: yup.string().max(500, 'Примечания не должны превышать 500 символов'),
});

interface BiometryDataFormProps {
  plantId: number;
}

const BiometryDataForm: React.FC<BiometryDataFormProps> = ({ plantId }) => {
  // Состояния
  const [biometryData, setBiometryData] = useState<BiometryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await plantService.getBiometryData(plantId);
        setBiometryData(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке биометрических данных');
        setLoading(false);
        console.error('Error loading biometry data:', err);
      }
    };

    loadData();
  }, [plantId]);

  // Формик для управления формой
  const formik = useFormik<Omit<BiometryData, 'id'>>({
    initialValues: {
      plantId,
      date: new Date().toISOString().split('T')[0],
      height: undefined,
      diameter: undefined,
      flowerSize: undefined,
      leafSize: undefined,
      otherParameters: {},
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          // Обновление существующих данных
          await plantService.updateBiometryData(editingId, values);
          setSuccess('Биометрические данные успешно обновлены');
        } else {
          // Добавление новых данных
          await plantService.addBiometryData(values);
          setSuccess('Биометрические данные успешно добавлены');
        }

        // Обновляем список данных
        const data = await plantService.getBiometryData(plantId);
        setBiometryData(data);

        // Закрываем диалог
        handleCloseDialog();
      } catch (err) {
        setError('Ошибка при сохранении биометрических данных');
        console.error('Error saving biometry data:', err);
      }
    },
  });

  // Обработчики событий
  const handleOpenDialog = (data?: BiometryData) => {
    if (data) {
      // Редактирование существующих данных
      setEditingId(data.id);
      formik.setValues({
        plantId,
        date: data.date,
        height: data.height || undefined,
        diameter: data.diameter || undefined,
        flowerSize: data.flowerSize || undefined,
        leafSize: data.leafSize || undefined,
        otherParameters: data.otherParameters || {},
        notes: data.notes || '',
      });
    } else {
      // Добавление новых данных
      setEditingId(null);
      formik.resetForm({
        values: {
          plantId,
          date: new Date().toISOString().split('T')[0],
          height: undefined,
          diameter: undefined,
          flowerSize: undefined,
          leafSize: undefined,
          otherParameters: {},
          notes: '',
        },
      });
    }

    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
    setEditingId(null);
  };

  const handleDeleteData = async (id: number) => {
    if (
      window.confirm(
        'Вы уверены, что хотите удалить эти биометрические данные?'
      )
    ) {
      try {
        // Здесь должен быть вызов API для удаления данных
        // await plantService.deleteBiometryData(id);

        // Обновляем список данных (временное решение - фильтруем локально)
        setBiometryData(biometryData.filter((item) => item.id !== id));

        setSuccess('Биометрические данные успешно удалены');
      } catch (err) {
        setError('Ошибка при удалении биометрических данных');
        console.error('Error deleting biometry data:', err);
      }
    }
  };

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant='h5'>Биометрические данные</Typography>

        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить данные
        </Button>
      </Box>

      {/* Таблица с данными */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата измерения</TableCell>
                <TableCell>Высота (см)</TableCell>
                <TableCell>Диаметр (см)</TableCell>
                <TableCell>Размер цветка (см)</TableCell>
                <TableCell>Размер листа (см)</TableCell>
                <TableCell>Примечания</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : biometryData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align='center'>
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                biometryData.map((data) => (
                  <TableRow key={data.id} hover>
                    <TableCell>{formatDate(data.date)}</TableCell>
                    <TableCell>
                      {data.height !== null ? `${data.height} см` : '-'}
                    </TableCell>
                    <TableCell>
                      {data.diameter !== null ? `${data.diameter} см` : '-'}
                    </TableCell>
                    <TableCell>
                      {data.flowerSize !== null ? `${data.flowerSize} см` : '-'}
                    </TableCell>
                    <TableCell>
                      {data.leafSize !== null ? `${data.leafSize} см` : '-'}
                    </TableCell>
                    <TableCell>{data.notes || '-'}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton
                          size='small'
                          onClick={() => handleOpenDialog(data)}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => handleDeleteData(data.id)}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Диалог добавления/редактирования */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth='md'
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingId
              ? 'Редактирование биометрических данных'
              : 'Добавление биометрических данных'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='date'
                  name='date'
                  label='Дата измерения'
                  type='date'
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='height'
                  name='height'
                  label='Высота (см)'
                  type='number'
                  value={formik.values.height || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.height && Boolean(formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='diameter'
                  name='diameter'
                  label='Диаметр (см)'
                  type='number'
                  value={formik.values.diameter || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.diameter && Boolean(formik.errors.diameter)
                  }
                  helperText={formik.touched.diameter && formik.errors.diameter}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='flowerSize'
                  name='flowerSize'
                  label='Размер цветка (см)'
                  type='number'
                  value={formik.values.flowerSize || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.flowerSize &&
                    Boolean(formik.errors.flowerSize)
                  }
                  helperText={
                    formik.touched.flowerSize && formik.errors.flowerSize
                  }
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='leafSize'
                  name='leafSize'
                  label='Размер листа (см)'
                  type='number'
                  value={formik.values.leafSize || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.leafSize && Boolean(formik.errors.leafSize)
                  }
                  helperText={formik.touched.leafSize && formik.errors.leafSize}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='notes'
                  name='notes'
                  label='Примечания'
                  multiline
                  rows={3}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                  margin='normal'
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button type='submit' variant='contained' color='primary'>
              {editingId ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity='error'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert
          onClose={() => setSuccess(null)}
          severity='success'
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BiometryDataForm;
