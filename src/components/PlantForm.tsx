import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { plantService, referenceService } from '../services';
import { Department, Family, Location, Plant } from '../types';
import BiometryDataForm from './BiometryDataForm';
import PhenologyDataForm from './PhenologyDataForm';

// Схема валидации для формы растения
const validationSchema = yup.object({
  inventoryNumber: yup
    .string()
    .required('Инвентарный номер обязателен')
    .max(50, 'Инвентарный номер не должен превышать 50 символов'),
  genus: yup
    .string()
    .required('Род обязателен')
    .max(100, 'Род не должен превышать 100 символов'),
  species: yup
    .string()
    .required('Вид обязателен')
    .max(100, 'Вид не должен превышать 100 символов'),
  cultivar: yup
    .string()
    .max(100, 'Сорт/форма не должен превышать 100 символов'),
  familyId: yup.number().required('Семейство обязательно'),
  locationId: yup.number().required('Местоположение обязательно'),
  department: yup
    .string()
    .required('Отдел обязателен')
    .oneOf(['dendrology', 'flora', 'floriculture'], 'Некорректный отдел'),
  notes: yup.string().max(1000, 'Примечания не должны превышать 1000 символов'),
});

// Интерфейс для пропсов компонента
interface PlantFormProps {
  isEdit?: boolean;
}

const PlantForm: React.FC<PlantFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Состояния
  const [families, setFamilies] = useState<Family[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Получаем отдел из состояния навигации (если создаем новое растение)
  const initialDepartment = location.state?.department || 'dendrology';

  // Формик для управления формой
  const formik = useFormik<
    Omit<Plant, 'id' | 'createdAt' | 'updatedAt' | 'family' | 'location'>
  >({
    initialValues: {
      inventoryNumber: '',
      genus: '',
      species: '',
      cultivar: '',
      familyId: 0,
      locationId: 0,
      department: initialDepartment as Department,
      hasHerbarium: false,
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (isEdit && id) {
          // Обновление существующего растения
          await plantService.updatePlant(parseInt(id), values);
          setSuccess('Растение успешно обновлено');
        } else {
          // Создание нового растения
          await plantService.createPlant(values);
          setSuccess('Растение успешно добавлено');

          // Сбрасываем форму при создании нового растения
          if (!isEdit) {
            formik.resetForm({
              values: {
                ...formik.initialValues,
                department: values.department, // Сохраняем выбранный отдел
              },
            });
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Ошибка при сохранении данных');
        setLoading(false);
        console.error('Error saving plant:', err);
      }
    },
  });

  // Загрузка справочников и данных растения (если редактирование)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загрузка справочников
        const [familiesData, locationsData] = await Promise.all([
          referenceService.getFamilies(),
          referenceService.getLocations(),
        ]);

        setFamilies(familiesData);
        setLocations(locationsData);

        // Если редактирование, загружаем данные растения
        if (isEdit && id) {
          const plant = await plantService.getPlantById(parseInt(id));

          formik.setValues({
            inventoryNumber: plant.inventoryNumber,
            genus: plant.genus,
            species: plant.species,
            cultivar: plant.cultivar || '',
            familyId: plant.familyId,
            locationId: plant.locationId,
            department: plant.department,
            hasHerbarium: plant.hasHerbarium,
            notes: plant.notes || '',
          });
        }

        setInitialLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setInitialLoading(false);
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, [id, isEdit, formik]);

  // Обработчик изменения вкладки
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Получение названия отдела
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDepartmentName = (department: Department) => {
    switch (department) {
      case 'dendrology':
        return 'Дендрология';
      case 'flora':
        return 'Флора';
      case 'floriculture':
        return 'Цветоводство';
      default:
        return '';
    }
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        {isEdit ? 'Редактирование растения' : 'Добавление нового растения'}
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label='Основная информация' />
          {isEdit && id && <Tab label='Фенологические данные' />}
          {isEdit && id && <Tab label='Биометрические данные' />}
        </Tabs>

        {/* Вкладка с основной информацией */}
        {tabValue === 0 && (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='inventoryNumber'
                  name='inventoryNumber'
                  label='Инвентарный номер'
                  value={formik.values.inventoryNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.inventoryNumber &&
                    Boolean(formik.errors.inventoryNumber)
                  }
                  helperText={
                    formik.touched.inventoryNumber &&
                    formik.errors.inventoryNumber
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id='department'
                  name='department'
                  label='Отдел'
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.department &&
                    Boolean(formik.errors.department)
                  }
                  helperText={
                    formik.touched.department && formik.errors.department
                  }
                >
                  <MenuItem value='dendrology'>Дендрология</MenuItem>
                  <MenuItem value='flora'>Флора</MenuItem>
                  <MenuItem value='floriculture'>Цветоводство</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='genus'
                  name='genus'
                  label='Род'
                  value={formik.values.genus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.genus && Boolean(formik.errors.genus)}
                  helperText={formik.touched.genus && formik.errors.genus}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='species'
                  name='species'
                  label='Вид'
                  value={formik.values.species}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.species && Boolean(formik.errors.species)
                  }
                  helperText={formik.touched.species && formik.errors.species}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id='cultivar'
                  name='cultivar'
                  label='Сорт/Форма'
                  value={formik.values.cultivar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.cultivar && Boolean(formik.errors.cultivar)
                  }
                  helperText={formik.touched.cultivar && formik.errors.cultivar}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id='familyId'
                  name='familyId'
                  label='Семейство'
                  value={formik.values.familyId || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.familyId && Boolean(formik.errors.familyId)
                  }
                  helperText={formik.touched.familyId && formik.errors.familyId}
                >
                  <MenuItem value='' disabled>
                    Выберите семейство
                  </MenuItem>
                  {families.map((family) => (
                    <MenuItem key={family.id} value={family.id}>
                      {family.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id='locationId'
                  name='locationId'
                  label='Местоположение'
                  value={formik.values.locationId || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.locationId &&
                    Boolean(formik.errors.locationId)
                  }
                  helperText={
                    formik.touched.locationId && formik.errors.locationId
                  }
                >
                  <MenuItem value='' disabled>
                    Выберите местоположение
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id='hasHerbarium'
                      name='hasHerbarium'
                      checked={formik.values.hasHerbarium}
                      onChange={formik.handleChange}
                    />
                  }
                  label='Наличие гербария'
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='notes'
                  name='notes'
                  label='Примечания'
                  multiline
                  rows={4}
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.notes && Boolean(formik.errors.notes)}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant='outlined' onClick={() => navigate(-1)}>
                    Отмена
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : isEdit ? (
                      'Сохранить'
                    ) : (
                      'Добавить'
                    )}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}

        {/* Вкладка с фенологическими данными */}
        {tabValue === 1 && isEdit && id && (
          <PhenologyDataForm plantId={parseInt(id)} />
        )}

        {/* Вкладка с биометрическими данными */}
        {tabValue === 2 && isEdit && id && (
          <BiometryDataForm plantId={parseInt(id)} />
        )}
      </Paper>

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

export default PlantForm;
