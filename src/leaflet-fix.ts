import L from 'leaflet';

// Исправляем проблему с иконками маркеров в Leaflet
// Это решение необходимо, так как Webpack не обрабатывает правильно пути к изображениям в CSS Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Используем приведение типов для обхода проблемы с TypeScript
// @ts-ignore - игнорируем ошибку TypeScript, так как мы знаем, что это свойство существует в рантайме
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export default L; 