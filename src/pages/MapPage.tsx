import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import PolylineIcon from '@mui/icons-material/Polyline';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import L, { CRS, LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Polygon,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import '../leaflet-fix';

// Типы режимов работы с картой
type MapMode =
  | 'view'
  | 'addPlant'
  | 'editPlant'
  | 'addArea'
  | 'editArea'
  | 'deleteArea';

// Интерфейс для растения
interface Plant {
  id: string;
  name: string;
  species: string;
  position: LatLngExpression;
  description?: string;
}

// Интерфейс для области
interface Area {
  id: string;
  name: string;
  type: string;
  color: string;
  positions: LatLngExpression[];
  description?: string;
}

// Демо-данные растений
const initialPlants: Plant[] = [
  {
    id: 'p1',
    name: 'Дуб обыкновенный',
    species: 'Quercus robur',
    position: [150, 250],
    description: 'Величественное дерево семейства Буковых',
  },
  {
    id: 'p2',
    name: 'Сосна обыкновенная',
    species: 'Pinus sylvestris',
    position: [250, 350],
    description: 'Вечнозеленое хвойное дерево',
  },
];

// Демо-данные областей
const initialAreas: Area[] = [
  {
    id: 'a1',
    name: 'Хвойный участок',
    type: 'Дендрарий',
    color: '#34C759',
    positions: [
      [100, 100],
      [100, 200],
      [200, 200],
      [200, 100],
    ],
    description: 'Коллекция хвойных растений',
  },
  {
    id: 'a2',
    name: 'Розарий',
    type: 'Цветник',
    color: '#FF2D55',
    positions: [
      [300, 300],
      [300, 400],
      [400, 400],
      [400, 300],
    ],
    description: 'Коллекция роз различных сортов',
  },
];

// Точки интереса на карте
const points = [
  {
    name: 'Главный вход',
    position: [50, 50] as LatLngExpression, // Координаты в пикселях
    description: 'Центральный вход в ботанический сад',
  },
  {
    name: 'Административное здание',
    position: [150, 100] as LatLngExpression,
    description: 'Здание администрации и научных сотрудников',
  },
  {
    name: 'Дендрарий',
    position: [200, 200] as LatLngExpression,
    description: 'Коллекция древесных растений',
  },
  {
    name: 'Оранжерея',
    position: [300, 150] as LatLngExpression,
    description: 'Коллекция тропических растений',
  },
];

// Компонент для обновления размеров карты при изменении изображения
const MapUpdater: React.FC<{ bounds: LatLngBoundsExpression }> = ({
  bounds,
}) => {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds, map]);

  return null;
};

// Компонент для обработки событий карты в зависимости от режима
interface MapEventHandlerProps {
  mode: MapMode;
  onPlantAdd?: (position: LatLngExpression) => void;
  onPlantSelect?: (plantId: string) => void;
  onAreaPointAdd?: (position: LatLngExpression) => void;
  onAreaSelect?: (areaId: string) => void;
}

const MapEventHandler: React.FC<MapEventHandlerProps> = ({
  mode,
  onPlantAdd,
  onPlantSelect,
  onAreaPointAdd,
  onAreaSelect,
}) => {
  const map = useMapEvents({
    click: (e) => {
      if (mode === 'addPlant' && onPlantAdd) {
        onPlantAdd([e.latlng.lat, e.latlng.lng]);
      } else if (mode === 'addArea' && onAreaPointAdd) {
        onAreaPointAdd([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  return null;
};

// Компонент для управления режимами карты
const MapControls: React.FC<{
  mode: MapMode;
  setMode: React.Dispatch<React.SetStateAction<MapMode>>;
  onSave?: () => void;
}> = ({ mode, setMode, onSave }) => {
  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: MapMode | null
  ) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleModeChange}
        aria-label='режимы работы с картой'
        size='small'
        sx={{
          mb: 1,
          '& .MuiToggleButtonGroup-grouped': {
            border: 1,
            borderColor: 'divider',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          },
        }}
      >
        <ToggleButton value='view' aria-label='просмотр'>
          <Tooltip title='Режим просмотра'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span>Просмотр</span>
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='addPlant' aria-label='добавить растение'>
          <Tooltip title='Добавить растение'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalFloristIcon sx={{ mr: 0.5 }} fontSize='small' />
              <span>Добавить растение</span>
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='editPlant' aria-label='редактировать растение'>
          <Tooltip title='Редактировать растение'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 0.5 }} fontSize='small' />
              <span>Редактировать растение</span>
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='addArea' aria-label='добавить область'>
          <Tooltip title='Добавить область'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PolylineIcon sx={{ mr: 0.5 }} fontSize='small' />
              <span>Добавить область</span>
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='editArea' aria-label='редактировать область'>
          <Tooltip title='Редактировать область'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 0.5 }} fontSize='small' />
              <span>Редактировать область</span>
            </Box>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value='deleteArea' aria-label='удалить область'>
          <Tooltip title='Удалить область'>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DeleteIcon sx={{ mr: 0.5 }} fontSize='small' />
              <span>Удалить область</span>
            </Box>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      {mode !== 'view' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'rgba(0, 122, 255, 0.1)',
            p: 1,
            borderRadius: 1,
          }}
        >
          <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
            {mode === 'addPlant' &&
              'Нажмите на карту, чтобы добавить новое растение'}
            {mode === 'editPlant' &&
              'Выберите растение на карте для редактирования'}
            {mode === 'addArea' &&
              'Нажимайте на карту, чтобы добавить точки области. Минимум 3 точки.'}
            {mode === 'editArea' && 'Выберите область для редактирования'}
            {mode === 'deleteArea' && 'Выберите область для удаления'}
          </Typography>
          <Stack direction='row' spacing={1}>
            {(mode === 'addPlant' || mode === 'addArea') && (
              <Button
                size='small'
                variant='contained'
                startIcon={<SaveIcon />}
                onClick={onSave}
                sx={{ borderRadius: '20px' }}
              >
                Сохранить
              </Button>
            )}
            <Button
              size='small'
              variant='outlined'
              startIcon={<CancelIcon />}
              onClick={() => setMode('view')}
              sx={{ borderRadius: '20px' }}
            >
              Отмена
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

const MapPage: React.FC = () => {
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(600);
  const [error, setError] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>('view');
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [newAreaPoints, setNewAreaPoints] = useState<LatLngExpression[]>([]);
  const [showPlantDialog, setShowPlantDialog] = useState(false);
  const [showAreaDialog, setShowAreaDialog] = useState(false);
  const [tempPlant, setTempPlant] = useState<Partial<Plant>>({});
  const [tempArea, setTempArea] = useState<Partial<Area>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Используем демо-изображение по умолчанию
  const defaultImage = '/garden-map-demo.jpg';

  // Границы изображения для Leaflet
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  // Обработчик загрузки изображения
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, загрузите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
        setCustomImage(img.src);
        setError(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Сброс изображения к значению по умолчанию
  const resetToDefault = () => {
    setCustomImage(null);
    setImageWidth(800);
    setImageHeight(600);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Обработчик добавления нового растения
  const handlePlantAdd = (position: LatLngExpression) => {
    setTempPlant({
      position,
      name: '',
      species: '',
    });
    setShowPlantDialog(true);
  };

  // Обработчик выбора растения для редактирования
  const handlePlantSelect = (plantId: string) => {
    const plant = plants.find((p) => p.id === plantId);
    if (plant && mapMode === 'editPlant') {
      setSelectedPlant(plant);
      setTempPlant({ ...plant });
      setShowPlantDialog(true);
    }
  };

  // Обработчик добавления точки для новой области
  const handleAreaPointAdd = (position: LatLngExpression) => {
    setNewAreaPoints((prev) => [...prev, position]);
  };

  // Обработчик выбора области для редактирования
  const handleAreaSelect = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    if (area) {
      if (mapMode === 'editArea') {
        setSelectedArea(area);
        setTempArea({ ...area });
        setShowAreaDialog(true);
      } else if (mapMode === 'deleteArea') {
        // Подтверждение удаления можно добавить здесь
        setAreas(areas.filter((a) => a.id !== areaId));
        setMapMode('view');
      }
    }
  };

  // Сохранение нового растения
  const handleSavePlant = () => {
    if (tempPlant.name && tempPlant.species && tempPlant.position) {
      if (selectedPlant) {
        // Обновление существующего растения
        setPlants(
          plants.map((p) =>
            p.id === selectedPlant.id
              ? ({ ...p, ...tempPlant, id: p.id } as Plant)
              : p
          )
        );
      } else {
        // Добавление нового растения
        const newPlant: Plant = {
          id: `p${Date.now()}`,
          name: tempPlant.name,
          species: tempPlant.species,
          position: tempPlant.position,
          description: tempPlant.description,
        };
        setPlants([...plants, newPlant]);
      }
      setShowPlantDialog(false);
      setSelectedPlant(null);
      setTempPlant({});
      setMapMode('view');
    }
  };

  // Сохранение новой области
  const handleSaveArea = () => {
    if (tempArea.name && tempArea.type && tempArea.color) {
      if (selectedArea) {
        // Обновление существующей области
        setAreas(
          areas.map((a) =>
            a.id === selectedArea.id
              ? ({ ...a, ...tempArea, id: a.id } as Area)
              : a
          )
        );
      } else if (newAreaPoints.length >= 3) {
        // Добавление новой области
        const newArea: Area = {
          id: `a${Date.now()}`,
          name: tempArea.name,
          type: tempArea.type,
          color: tempArea.color,
          positions: newAreaPoints,
          description: tempArea.description,
        };
        setAreas([...areas, newArea]);
        setNewAreaPoints([]);
      }
      setShowAreaDialog(false);
      setSelectedArea(null);
      setTempArea({});
      setMapMode('view');
    }
  };

  // Сохранение в зависимости от режима
  const handleSave = () => {
    if (mapMode === 'addArea' && newAreaPoints.length >= 3) {
      setTempArea({
        name: '',
        type: '',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16), // Случайный цвет
      });
      setShowAreaDialog(true);
    }
  };

  // Эффект для очистки временных данных при смене режима
  useEffect(() => {
    if (mapMode === 'view') {
      setNewAreaPoints([]);
      setSelectedPlant(null);
      setSelectedArea(null);
    }
  }, [mapMode]);

  return (
    <Container
      maxWidth='xl'
      sx={{
        py: 2,
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        variant='h4'
        component='h1'
        sx={{ mb: 2, textAlign: 'center' }}
      >
        Карта ботанического сада
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2 },
          mb: 2,
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ mb: 1 }}>
              Схема ботанического сада
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl>
                <Input
                  type='file'
                  inputRef={fileInputRef}
                  onChange={handleImageUpload}
                  sx={{ display: 'none' }}
                  id='map-upload-input'
                  inputProps={{ accept: 'image/*' }}
                />
                <Button
                  variant='contained'
                  component='label'
                  htmlFor='map-upload-input'
                  startIcon={<UploadIcon />}
                  size='small'
                  sx={{
                    borderRadius: '20px',
                  }}
                >
                  Загрузить схему
                </Button>
              </FormControl>
              <Button
                variant='outlined'
                color='error'
                startIcon={<DeleteIcon />}
                onClick={resetToDefault}
                size='small'
                sx={{
                  borderRadius: '20px',
                }}
              >
                Сбросить
              </Button>
            </Box>
          </Box>

          <Box>
            <Typography variant='h6' sx={{ mb: 1 }}>
              Режимы работы с картой
            </Typography>
            <MapControls
              mode={mapMode}
              setMode={setMapMode}
              onSave={handleSave}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity='error' sx={{ mb: 2, maxWidth: '600px' }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            flexGrow: 1,
            width: '100%',
            border: '1px solid #eee',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <MapContainer
            center={[imageHeight / 2, imageWidth / 2]}
            zoom={0}
            style={{ height: '100%', width: '100%' }}
            crs={CRS.Simple}
            minZoom={-2}
            maxZoom={2}
            zoomControl={true}
            attributionControl={false}
          >
            <ImageOverlay bounds={bounds} url={customImage || defaultImage} />
            <MapUpdater bounds={bounds} />
            <MapEventHandler
              mode={mapMode}
              onPlantAdd={handlePlantAdd}
              onPlantSelect={handlePlantSelect}
              onAreaPointAdd={handleAreaPointAdd}
              onAreaSelect={handleAreaSelect}
            />

            {/* Маркеры точек интереса */}
            {points.map((point, index) => (
              <Marker key={`poi-${index}`} position={point.position}>
                <Popup>
                  <Typography variant='subtitle2'>{point.name}</Typography>
                  <Typography variant='body2'>{point.description}</Typography>
                </Popup>
              </Marker>
            ))}

            {/* Маркеры растений */}
            {plants.map((plant) => (
              <Marker
                key={plant.id}
                position={plant.position}
                eventHandlers={{
                  click: () => handlePlantSelect(plant.id),
                }}
                icon={L.divIcon({
                  className: 'plant-marker',
                  html: `<div style="color: green; font-size: 24px;">🌱</div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              >
                <Popup>
                  <Typography variant='subtitle2'>{plant.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {plant.species}
                  </Typography>
                  {plant.description && (
                    <Typography variant='body2'>{plant.description}</Typography>
                  )}
                </Popup>
              </Marker>
            ))}

            {/* Области */}
            {areas.map((area) => (
              <Polygon
                key={area.id}
                positions={area.positions}
                pathOptions={{
                  color: area.color,
                  fillOpacity: 0.3,
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => handleAreaSelect(area.id),
                }}
              >
                <Popup>
                  <Typography variant='subtitle2'>{area.name}</Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {area.type}
                  </Typography>
                  {area.description && (
                    <Typography variant='body2'>{area.description}</Typography>
                  )}
                </Popup>
              </Polygon>
            ))}

            {/* Отображение создаваемой области */}
            {newAreaPoints.length > 0 && (
              <Polygon
                positions={newAreaPoints}
                pathOptions={{
                  color: '#007AFF',
                  fillOpacity: 0.2,
                  weight: 2,
                  dashArray: '5, 5',
                }}
              />
            )}
          </MapContainer>
        </Box>

        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'block', mt: 1, textAlign: 'center' }}
        >
          * Карта схематична и может не отражать точное расположение объектов.
          Для более точной информации обратитесь к администрации.
        </Typography>
      </Paper>

      {/* Диалог для добавления/редактирования растения */}
      <Dialog open={showPlantDialog} onClose={() => setShowPlantDialog(false)}>
        <DialogTitle>
          {selectedPlant
            ? 'Редактирование растения'
            : 'Добавление нового растения'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Название растения'
            fullWidth
            variant='outlined'
            value={tempPlant.name || ''}
            onChange={(e) =>
              setTempPlant({ ...tempPlant, name: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Вид (латинское название)'
            fullWidth
            variant='outlined'
            value={tempPlant.species || ''}
            onChange={(e) =>
              setTempPlant({ ...tempPlant, species: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Описание'
            fullWidth
            multiline
            rows={3}
            variant='outlined'
            value={tempPlant.description || ''}
            onChange={(e) =>
              setTempPlant({ ...tempPlant, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlantDialog(false)}>Отмена</Button>
          <Button onClick={handleSavePlant} variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог для добавления/редактирования области */}
      <Dialog open={showAreaDialog} onClose={() => setShowAreaDialog(false)}>
        <DialogTitle>
          {selectedArea ? 'Редактирование области' : 'Добавление новой области'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Название области'
            fullWidth
            variant='outlined'
            value={tempArea.name || ''}
            onChange={(e) => setTempArea({ ...tempArea, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Тип области'
            fullWidth
            variant='outlined'
            value={tempArea.type || ''}
            onChange={(e) => setTempArea({ ...tempArea, type: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Цвет (HEX)'
            fullWidth
            variant='outlined'
            value={tempArea.color || ''}
            onChange={(e) =>
              setTempArea({ ...tempArea, color: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin='dense'
            label='Описание'
            fullWidth
            multiline
            rows={3}
            variant='outlined'
            value={tempArea.description || ''}
            onChange={(e) =>
              setTempArea({ ...tempArea, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAreaDialog(false)}>Отмена</Button>
          <Button onClick={handleSaveArea} variant='contained'>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MapPage;
