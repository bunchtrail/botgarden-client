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
  IconButton,
  Paper,
  Snackbar,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { referenceService } from '../services';
import { Family, Location } from '../types';

const AdminPage: React.FC = () => {
  // Состояния
  const [tabValue, setTabValue] = useState(0);
  const [families, setFamilies] = useState<Family[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Состояния для диалогов
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [familyName, setFamilyName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationDescription, setLocationDescription] = useState('');

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [familiesData, locationsData] = await Promise.all([
          referenceService.getFamilies(),
          referenceService.getLocations(),
        ]);

        setFamilies(familiesData);
        setLocations(locationsData);

        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
        console.error('Error loading reference data:', err);
      }
    };

    loadData();
  }, []);

  // Обработчики событий
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Обработчики для семейств
  const handleOpenFamilyDialog = (family?: Family) => {
    if (family) {
      setEditingFamily(family);
      setFamilyName(family.name);
    } else {
      setEditingFamily(null);
      setFamilyName('');
    }

    setFamilyDialogOpen(true);
  };

  const handleCloseFamilyDialog = () => {
    setFamilyDialogOpen(false);
    setEditingFamily(null);
    setFamilyName('');
  };

  const handleSaveFamily = async () => {
    try {
      if (!familyName.trim()) {
        setError('Название семейства не может быть пустым');
        return;
      }

      if (editingFamily) {
        // Обновление существующего семейства
        const updatedFamily = await referenceService.updateFamily(
          editingFamily.id,
          familyName
        );
        setFamilies(
          families.map((f) => (f.id === updatedFamily.id ? updatedFamily : f))
        );
        setSuccess('Семейство успешно обновлено');
      } else {
        // Создание нового семейства
        const newFamily = await referenceService.createFamily(familyName);
        setFamilies([...families, newFamily]);
        setSuccess('Семейство успешно добавлено');
      }

      handleCloseFamilyDialog();
    } catch (err) {
      setError('Ошибка при сохранении семейства');
      console.error('Error saving family:', err);
    }
  };

  const handleDeleteFamily = async (id: number) => {
    if (
      window.confirm(
        'Вы уверены, что хотите удалить это семейство? Это может повлиять на связанные растения.'
      )
    ) {
      try {
        await referenceService.deleteFamily(id);
        setFamilies(families.filter((f) => f.id !== id));
        setSuccess('Семейство успешно удалено');
      } catch (err) {
        setError('Ошибка при удалении семейства');
        console.error('Error deleting family:', err);
      }
    }
  };

  // Обработчики для местоположений
  const handleOpenLocationDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setLocationName(location.name);
      setLocationDescription(location.description || '');
    } else {
      setEditingLocation(null);
      setLocationName('');
      setLocationDescription('');
    }

    setLocationDialogOpen(true);
  };

  const handleCloseLocationDialog = () => {
    setLocationDialogOpen(false);
    setEditingLocation(null);
    setLocationName('');
    setLocationDescription('');
  };

  const handleSaveLocation = async () => {
    try {
      if (!locationName.trim()) {
        setError('Название местоположения не может быть пустым');
        return;
      }

      const locationData = {
        name: locationName,
        description: locationDescription || undefined,
      };

      if (editingLocation) {
        // Обновление существующего местоположения
        const updatedLocation = await referenceService.updateLocation(
          editingLocation.id,
          locationData
        );
        setLocations(
          locations.map((l) =>
            l.id === updatedLocation.id ? updatedLocation : l
          )
        );
        setSuccess('Местоположение успешно обновлено');
      } else {
        // Создание нового местоположения
        const newLocation = await referenceService.createLocation(locationData);
        setLocations([...locations, newLocation]);
        setSuccess('Местоположение успешно добавлено');
      }

      handleCloseLocationDialog();
    } catch (err) {
      setError('Ошибка при сохранении местоположения');
      console.error('Error saving location:', err);
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (
      window.confirm(
        'Вы уверены, что хотите удалить это местоположение? Это может повлиять на связанные растения.'
      )
    ) {
      try {
        await referenceService.deleteLocation(id);
        setLocations(locations.filter((l) => l.id !== id));
        setSuccess('Местоположение успешно удалено');
      } catch (err) {
        setError('Ошибка при удалении местоположения');
        console.error('Error deleting location:', err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h4' gutterBottom>
        Администрирование
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label='Семейства растений' />
          <Tab label='Местоположения (экспозиции)' />
        </Tabs>

        {/* Вкладка с семействами */}
        {tabValue === 0 && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>Список семейств растений</Typography>

              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleOpenFamilyDialog()}
              >
                Добавить семейство
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align='center'>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : families.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align='center'>
                        Нет данных для отображения
                      </TableCell>
                    </TableRow>
                  ) : (
                    families.map((family) => (
                      <TableRow key={family.id} hover>
                        <TableCell>{family.id}</TableCell>
                        <TableCell>{family.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            <IconButton
                              size='small'
                              onClick={() => handleOpenFamilyDialog(family)}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleDeleteFamily(family.id)}
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
          </Box>
        )}

        {/* Вкладка с местоположениями */}
        {tabValue === 1 && (
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>
                Список местоположений (экспозиций)
              </Typography>

              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                onClick={() => handleOpenLocationDialog()}
              >
                Добавить местоположение
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Описание</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align='center'>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : locations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align='center'>
                        Нет данных для отображения
                      </TableCell>
                    </TableRow>
                  ) : (
                    locations.map((location) => (
                      <TableRow key={location.id} hover>
                        <TableCell>{location.id}</TableCell>
                        <TableCell>{location.name}</TableCell>
                        <TableCell>{location.description || '-'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            <IconButton
                              size='small'
                              onClick={() => handleOpenLocationDialog(location)}
                            >
                              <EditIcon fontSize='small' />
                            </IconButton>
                            <IconButton
                              size='small'
                              color='error'
                              onClick={() => handleDeleteLocation(location.id)}
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
          </Box>
        )}
      </Paper>

      {/* Диалог для семейств */}
      <Dialog open={familyDialogOpen} onClose={handleCloseFamilyDialog}>
        <DialogTitle>
          {editingFamily ? 'Редактирование семейства' : 'Добавление семейства'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='family-name'
            label='Название семейства'
            type='text'
            fullWidth
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFamilyDialog}>Отмена</Button>
          <Button
            onClick={handleSaveFamily}
            variant='contained'
            color='primary'
          >
            {editingFamily ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для местоположений */}
      <Dialog open={locationDialogOpen} onClose={handleCloseLocationDialog}>
        <DialogTitle>
          {editingLocation
            ? 'Редактирование местоположения'
            : 'Добавление местоположения'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='location-name'
            label='Название местоположения'
            type='text'
            fullWidth
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
          />
          <TextField
            margin='dense'
            id='location-description'
            label='Описание'
            type='text'
            fullWidth
            multiline
            rows={3}
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLocationDialog}>Отмена</Button>
          <Button
            onClick={handleSaveLocation}
            variant='contained'
            color='primary'
          >
            {editingLocation ? 'Сохранить' : 'Добавить'}
          </Button>
        </DialogActions>
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

export default AdminPage;
