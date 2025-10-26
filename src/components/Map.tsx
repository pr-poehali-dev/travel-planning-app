import { Place } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useMemo } from 'react';

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

const categoryLabels: Record<string, string> = {
  secret: 'Секретные места',
  restaurant: 'Рестораны',
  art: 'Искусство',
  music: 'Музыка',
  hotel: 'Отели',
  transport: 'Транспорт',
};

export function Map({ places, userLocation, onPlaceClick, onDeletePlace }: MapProps) {
  const [selectedMarker, setSelectedMarker] = useState<Place | null>(null);
  const [zoom, setZoom] = useState(0.05);

  const handleMarkerClick = (place: Place) => {
    setSelectedMarker(place);
  };

  const centerLat = userLocation[0];
  const centerLng = userLocation[1];

  const existingCategories = useMemo(() => {
    const cats = new Set(places.map(p => p.category));
    return Array.from(cats).filter(cat => categoryColors[cat]);
  }, [places]);

  const zoomIn = () => setZoom(prev => Math.max(prev * 0.7, 0.005));
  const zoomOut = () => setZoom(prev => Math.min(prev * 1.3, 0.2));

  return (
    <div className="h-full w-full relative bg-gray-100">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        className="absolute inset-0 pointer-events-none"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - zoom},${centerLat - zoom},${centerLng + zoom},${centerLat + zoom}&layer=mapnik`}
      />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="relative w-full h-full">
          {places.map((place) => {
            const offsetX = ((place.coords[1] - centerLng) / (zoom * 2)) * 100;
            const offsetY = (-(place.coords[0] - centerLat) / (zoom * 2)) * 100;
            const color = categoryColors[place.category] || '#0EA5E9';

            return (
              <div
                key={place.id}
                className="absolute pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                style={{
                  left: `calc(50% + ${offsetX}%)`,
                  top: `calc(50% + ${offsetY}%)`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => handleMarkerClick(place)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white"
                  style={{ backgroundColor: color }}
                >
                  {place.emoji}
                </div>
              </div>
            );
          })}

          <div
            className="absolute pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 border-4 border-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
      </div>

      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10 pointer-events-auto">
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
                  {categoryLabels[selectedMarker.category] || selectedMarker.category}
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

      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-auto">
        <Button
          size="icon"
          variant="secondary"
          className="shadow-lg bg-white hover:bg-gray-100"
          onClick={zoomIn}
        >
          <Icon name="Plus" size={20} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="shadow-lg bg-white hover:bg-gray-100"
          onClick={zoomOut}
        >
          <Icon name="Minus" size={20} />
        </Button>
      </div>

      {existingCategories.length > 0 && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10 pointer-events-auto">
          <div className="space-y-2 text-xs">
            <div className="font-semibold mb-2">Легенда</div>
            {existingCategories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                />
                <span>{categoryLabels[category] || category}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}