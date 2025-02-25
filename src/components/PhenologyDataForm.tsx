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
  MenuItem,
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
import { PhenologyData } from '../types';

// Схема валидации для формы фенологических данных
const validationSchema = yup.object({
  year: yup
    .number()
    .required('Год обязателен')
    .min(1900, 'Год должен быть не менее 1900')
    .max(
      new Date().getFullYear() + 5,
      `Год не должен превышать ${new Date().getFullYear() + 5}`
    ),
  floweringStart: yup.date().nullable(),
  floweringEnd: yup
    .date()
    .nullable()
    .test(
      'is-after-start',
      'Дата должна быть позже начала цветения',
      function (value) {
        const { floweringStart } = this.parent;
        if (!floweringStart || !value) return true;
        return new Date(value) >= new Date(floweringStart);
      }
    ),
  fruitingStart: yup.date().nullable(),
  fruitingEnd: yup
    .date()
    .nullable()
    .test(
      'is-after-start',
      'Дата должна быть позже начала плодоношения',
      function (value) {
        const { fruitingStart } = this.parent;
        if (!fruitingStart || !value) return true;
        return new Date(value) >= new Date(fruitingStart);
      }
    ),
  leafingStart: yup.date().nullable(),
  leafingEnd: yup
    .date()
    .nullable()
    .test(
      'is-after-start',
      'Дата должна быть позже начала облиствения',
      function (value) {
        const { leafingStart } = this.parent;
        if (!leafingStart || !value) return true;
        return new Date(value) >= new Date(leafingStart);
      }
    ),
  notes: yup.string().max(500, 'Примечания не должны превышать 500 символов'),
});

interface PhenologyDataFormProps {
  plantId: number;
}

const PhenologyDataForm: React.FC<PhenologyDataFormProps> = ({ plantId }) => {
  // Состояния
  const [phenologyData, setPhenologyData] = useState<PhenologyData[]>([]);
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
        const data = await plantService.getPhenologyData(plantId);
        setPhenologyData(data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке фенологических данных');
        setLoading(false);
        console.error('Error loading phenology data:', err);
      }
    };

    loadData();
  }, [plantId]);

  // Формик для управления формой
  const formik = useFormik<Omit<PhenologyData, 'id'>>({
    initialValues: {
      plantId,
      year: new Date().getFullYear(),
      floweringStart: '',
      floweringEnd: '',
      fruitingStart: '',
      fruitingEnd: '',
      leafingStart: '',
      leafingEnd: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          // Обновление существующих данных
          await plantService.updatePhenologyData(editingId, values);
          setSuccess('Фенологические данные успешно обновлены');
        } else {
          // Добавление новых данных
          await plantService.addPhenologyData(values);
          setSuccess('Фенологические данные успешно добавлены');
        }

        // Обновляем список данных
        const data = await plantService.getPhenologyData(plantId);
        setPhenologyData(data);

        // Закрываем диалог
        handleCloseDialog();
      } catch (err) {
        setError('Ошибка при сохранении фенологических данных');
        console.error('Error saving phenology data:', err);
      }
    },
  });

  // Обработчики событий
  const handleOpenDialog = (data?: PhenologyData) => {
    if (data) {
      // Редактирование существующих данных
      setEditingId(data.id);
      formik.setValues({
        plantId,
        year: data.year,
        floweringStart: data.floweringStart || '',
        floweringEnd: data.floweringEnd || '',
        fruitingStart: data.fruitingStart || '',
        fruitingEnd: data.fruitingEnd || '',
        leafingStart: data.leafingStart || '',
        leafingEnd: data.leafingEnd || '',
        notes: data.notes || '',
      });
    } else {
      // Добавление новых данных
      setEditingId(null);
      formik.resetForm({
        values: {
          plantId,
          year: new Date().getFullYear(),
          floweringStart: '',
          floweringEnd: '',
          fruitingStart: '',
          fruitingEnd: '',
          leafingStart: '',
          leafingEnd: '',
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
        'Вы уверены, что хотите удалить эти фенологические данные?'
      )
    ) {
      try {
        // Здесь должен быть вызов API для удаления данных
        // await plantService.deletePhenologyData(id);

        // Обновляем список данных (временное решение - фильтруем локально)
        setPhenologyData(phenologyData.filter((item) => item.id !== id));

        setSuccess('Фенологические данные успешно удалены');
      } catch (err) {
        setError('Ошибка при удалении фенологических данных');
        console.error('Error deleting phenology data:', err);
      }
    }
  };

  // Форматирование даты для отображения
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  // Генерация списка годов для выбора
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 2; i++) {
      years.push(i);
    }
    return years;
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
        <Typography variant='h5'>Фенологические данные</Typography>

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
                <TableCell>Год</TableCell>
                <TableCell>Начало цветения</TableCell>
                <TableCell>Конец цветения</TableCell>
                <TableCell>Начало плодоношения</TableCell>
                <TableCell>Конец плодоношения</TableCell>
                <TableCell>Начало облиствения</TableCell>
                <TableCell>Конец облиствения</TableCell>
                <TableCell>Примечания</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : phenologyData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align='center'>
                    Нет данных для отображения
                  </TableCell>
                </TableRow>
              ) : (
                phenologyData.map((data) => (
                  <TableRow key={data.id} hover>
                    <TableCell>{data.year}</TableCell>
                    <TableCell>{formatDate(data.floweringStart)}</TableCell>
                    <TableCell>{formatDate(data.floweringEnd)}</TableCell>
                    <TableCell>{formatDate(data.fruitingStart)}</TableCell>
                    <TableCell>{formatDate(data.fruitingEnd)}</TableCell>
                    <TableCell>{formatDate(data.leafingStart)}</TableCell>
                    <TableCell>{formatDate(data.leafingEnd)}</TableCell>
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
              ? 'Редактирование фенологических данных'
              : 'Добавление фенологических данных'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id='year'
                  name='year'
                  label='Год'
                  value={formik.values.year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.year && Boolean(formik.errors.year)}
                  helperText={formik.touched.year && formik.errors.year}
                  margin='normal'
                >
                  {getYearOptions().map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='floweringStart'
                  name='floweringStart'
                  label='Начало цветения'
                  type='date'
                  value={formik.values.floweringStart}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.floweringStart &&
                    Boolean(formik.errors.floweringStart)
                  }
                  helperText={
                    formik.touched.floweringStart &&
                    formik.errors.floweringStart
                  }
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='floweringEnd'
                  name='floweringEnd'
                  label='Конец цветения'
                  type='date'
                  value={formik.values.floweringEnd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.floweringEnd &&
                    Boolean(formik.errors.floweringEnd)
                  }
                  helperText={
                    formik.touched.floweringEnd && formik.errors.floweringEnd
                  }
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='fruitingStart'
                  name='fruitingStart'
                  label='Начало плодоношения'
                  type='date'
                  value={formik.values.fruitingStart}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fruitingStart &&
                    Boolean(formik.errors.fruitingStart)
                  }
                  helperText={
                    formik.touched.fruitingStart && formik.errors.fruitingStart
                  }
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='fruitingEnd'
                  name='fruitingEnd'
                  label='Конец плодоношения'
                  type='date'
                  value={formik.values.fruitingEnd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fruitingEnd &&
                    Boolean(formik.errors.fruitingEnd)
                  }
                  helperText={
                    formik.touched.fruitingEnd && formik.errors.fruitingEnd
                  }
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='leafingStart'
                  name='leafingStart'
                  label='Начало облиствения'
                  type='date'
                  value={formik.values.leafingStart}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.leafingStart &&
                    Boolean(formik.errors.leafingStart)
                  }
                  helperText={
                    formik.touched.leafingStart && formik.errors.leafingStart
                  }
                  InputLabelProps={{ shrink: true }}
                  margin='normal'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='leafingEnd'
                  name='leafingEnd'
                  label='Конец облиствения'
                  type='date'
                  value={formik.values.leafingEnd}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.leafingEnd &&
                    Boolean(formik.errors.leafingEnd)
                  }
                  helperText={
                    formik.touched.leafingEnd && formik.errors.leafingEnd
                  }
                  InputLabelProps={{ shrink: true }}
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

export default PhenologyDataForm;
