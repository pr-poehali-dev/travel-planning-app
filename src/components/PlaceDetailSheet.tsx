import { Place } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import IconComponent from '@/components/ui/icon';

interface PlaceDetailSheetProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (coords: [number, number]) => void;
}

export function PlaceDetailSheet({
  place,
  isOpen,
  onClose,
  onNavigate,
}: PlaceDetailSheetProps) {
  if (!place) return null;

  const handleGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.coords[0]},${place.coords[1]}`;
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="text-3xl">{place.emoji}</span>
            <span>{place.name}</span>
          </SheetTitle>
          {place.name_local && (
            <SheetDescription className="text-base">
              {place.name_local}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex gap-2">
            <Badge variant="secondary" className="capitalize">
              {place.category}
            </Badge>
            {place.rating_local && (
              <Badge variant="outline">
                ⭐ {place.rating_local}
              </Badge>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <IconComponent name="FileText" size={18} />
              Описание
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {place.description}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <IconComponent name="Info" size={18} />
              Практическая информация
            </h3>
            <div className="space-y-3">
              {place.price && (
                <div className="flex items-start gap-3">
                  <IconComponent name="DollarSign" size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Цена</div>
                    <div className="text-sm text-muted-foreground">{place.price}</div>
                  </div>
                </div>
              )}
              
              {place.time && (
                <div className="flex items-start gap-3">
                  <IconComponent name="Clock" size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Время работы</div>
                    <div className="text-sm text-muted-foreground">{place.time}</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <IconComponent name="MapPin" size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Адрес</div>
                  <div className="text-sm text-muted-foreground">{place.address}</div>
                </div>
              </div>

              {place.distance_from_user && (
                <div className="flex items-start gap-3">
                  <IconComponent name="Navigation" size={18} className="text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Расстояние от тебя</div>
                    <div className="text-sm text-muted-foreground">{place.distance_from_user}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <IconComponent name="Sparkles" size={18} />
              Почему стоит посетить
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {place.why_recommended}
            </p>
          </div>

          {place.tags && place.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {place.source_url && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <IconComponent name="ExternalLink" size={18} />
                  Источник
                </h3>
                <a
                  href={place.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Читать оригинальную рекомендацию
                </a>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              onClick={handleGoogleMaps}
            >
              <IconComponent name="Map" size={18} />
              Google Maps
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onNavigate(place.coords)}
            >
              <IconComponent name="Navigation" size={18} />
              Навигация
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
