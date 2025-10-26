import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Place } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useEffect } from 'react';

interface MapProps {
  places: Place[];
  userLocation: [number, number];
  onPlaceClick: (place: Place) => void;
  onDeletePlace: (placeId: string) => void;
}

const categoryColors: Record<string, string> = {
  secret: '#9b87f5',
  restaurant: '#F97316',
  art: '#D946EF',
  music: '#0EA5E9',
  hotel: '#10B981',
  transport: '#6B7280',
};

function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function Map({ places, userLocation, onPlaceClick, onDeletePlace }: MapProps) {
  const createCustomIcon = (category: string, emoji: string) => {
    const color = categoryColors[category] || '#0EA5E9';
    const svgContent = `<svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg"><path d="M20 0C8.954 0 0 8.954 0 20c0 14 20 30 20 30s20-16 20-30C40 8.954 31.046 0 20 0z" fill="${color}" stroke="white" stroke-width="2"/><text x="20" y="24" font-size="16" text-anchor="middle" fill="white">${emoji}</text></svg>`;
    return new Icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50],
    });
  };

  const userSvg = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#0EA5E9" stroke="white" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
  const userIcon = new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(userSvg)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={userLocation}
        zoom={13}
        className="h-full w-full rounded-lg"
        zoomControl={true}
      >
        <MapUpdater center={userLocation} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            <div className="text-sm font-medium">📍 Твоя локация</div>
          </Popup>
        </Marker>

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.coords}
            icon={createCustomIcon(place.category, place.emoji)}
          >
            <Popup minWidth={280}>
              <Card className="border-0 shadow-none p-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{place.emoji} {place.name}</h3>
                      {place.name_local && (
                        <p className="text-sm text-muted-foreground">{place.name_local}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {place.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {place.description}
                  </p>
                  
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {place.price && (
                      <span className="flex items-center gap-1">
                        <Icon name="DollarSign" size={12} />
                        {place.price}
                      </span>
                    )}
                    {place.time && (
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        {place.time}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1"
                      onClick={() => onPlaceClick(place)}
                    >
                      Подробнее
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeletePlace(place.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="space-y-2 text-xs">
          <div className="font-semibold mb-2">Легенда</div>
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}