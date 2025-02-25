import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Координаты для схемы ботанического сада (примерные)
const gardenCenter: LatLngExpression = [55.75, 37.61]; // Центр карты (можно заменить на реальные координаты)

// Области ботанического сада
const areas = [
  {
    name: 'Дендрарий',
    color: '#34C759',
    coordinates: [
      [55.752, 37.608],
      [55.753, 37.612],
      [55.751, 37.614],
      [55.749, 37.610],
    ] as LatLngExpression[],
  },
  {
    name: 'Цветочная оранжерея',
    color: '#FF2D55',
    coordinates: [
      [55.748, 37.615],
      [55.749, 37.618],
      [55.747, 37.619],
      [55.746, 37.616],
    ] as LatLngExpression[],
  },
  {
    name: 'Травянистые растения',
    color: '#007AFF',
    coordinates: [
      [55.754, 37.605],
      [55.756, 37.608],
      [55.755, 37.611],
      [55.753, 37.607],
    ] as LatLngExpression[],
  },
];

// Точки интереса
const points = [
  {
    name: 'Главный вход',
    position: [55.751, 37.605] as LatLngExpression,
    description: 'Центральный вход в ботанический сад',
  },
  {
    name: 'Административное здание',
    position: [55.753, 37.615] as LatLngExpression,
    description: 'Здание администрации и научных сотрудников',
  },
  {
    name: 'Кафе',
    position: [55.749, 37.613] as LatLngExpression,
    description: 'Кафе для посетителей',
  },
];

interface GardenMapProps {
  height?: string;
}

const GardenMap: React.FC<GardenMapProps> = ({ height = '400px' }) => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Динамический импорт Leaflet компонентов
    import('../leaflet-fix').then(() => {
      setMapReady(true);
    });
  }, []);

  if (!mapReady) {
    return (
      <div 
        style={{ 
          height, 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}
      >
        Загрузка карты...
      </div>
    );
  }

  // Динамический импорт компонентов react-leaflet
  const { MapContainer, TileLayer, Marker, Popup, Polygon } = require('react-leaflet');

  return (
    <MapContainer
      center={gardenCenter}
      zoom={15}
      style={{ height, width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Области ботанического сада */}
      {areas.map((area, index) => (
        <Polygon
          key={index}
          positions={area.coordinates}
          pathOptions={{ color: area.color, fillOpacity: 0.4 }}
        >
          <Popup>{area.name}</Popup>
        </Polygon>
      ))}
      
      {/* Точки интереса */}
      {points.map((point, index) => (
        <Marker key={index} position={point.position}>
          <Popup>
            <strong>{point.name}</strong>
            <p>{point.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GardenMap;
