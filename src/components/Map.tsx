import { Place } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useEffect, useRef, useState } from 'react';

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

export function Map({ places, userLocation, onPlaceClick, onDeletePlace }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);

  const handleMarkerClick = (place: Place) => {
    setSelectedMarker(place);
  };

  const centerLat = userLocation[0];
  const centerLng = userLocation[1];

  return (
    <div className="h-full w-full relative bg-gray-100" ref={mapRef}>
      {/* OpenStreetMap embed */}
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        className="absolute inset-0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.05},${centerLat - 0.05},${centerLng + 0.05},${centerLat + 0.05}&layer=mapnik&marker=${centerLat},${centerLng}`}
      />

      {/* Overlay with markers */}
      <div className="absolute inset-0 pointer-events-none">
        <svg width="100%" height="100%" className="pointer-events-auto">
          {/* User location marker */}
          <circle
            cx="50%"
            cy="50%"
            r="12"
            fill="#0EA5E9"
            stroke="white"
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          <circle
            cx="50%"
            cy="50%"
            r="4"
            fill="white"
          />

          {/* Place markers */}
          {places.map((place, index) => {
            const offsetX = (place.coords[1] - centerLng) * 2000;
            const offsetY = -(place.coords[0] - centerLat) * 2000;
            const x = `calc(50% + ${offsetX}px)`;
            const y = `calc(50% + ${offsetY}px)`;
            const color = categoryColors[place.category] || '#0EA5E9';

            return (
              <g key={place.id} onClick={() => handleMarkerClick(place)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-lg hover:scale-110 transition-transform"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  className="pointer-events-none select-none"
                >
                  {place.emoji}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected marker popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10">
          <Card className="p-4 shadow-xl">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-base">
                    {selectedMarker.emoji} {selectedMarker.name}
                  </h3>
                  {selectedMarker.name_local && (
                    <p className="text-sm text-muted-foreground">{selectedMarker.name_local}</p>
                  )}
                </div>
                <Badge variant="secondary" className="shrink-0">
                  {selectedMarker.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {selectedMarker.description}
              </p>

              <div className="flex gap-2 text-xs text-muted-foreground">
                {selectedMarker.price && (
                  <span className="flex items-center gap-1">
                    <Icon name="DollarSign" size={12} />
                    {selectedMarker.price}
                  </span>
                )}
                {selectedMarker.time && (
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {selectedMarker.time}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    onPlaceClick(selectedMarker);
                    setSelectedMarker(null);
                  }}
                >
                  Подробнее
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onDeletePlace(selectedMarker.id);
                    setSelectedMarker(null);
                  }}
                >
                  <Icon name="Trash2" size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedMarker(null)}
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
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
