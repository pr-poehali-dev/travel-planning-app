import { useState } from 'react';
import { Map } from '@/components/Map';
import { ChatPanel } from '@/components/ChatPanel';
import { PlaceDetailSheet } from '@/components/PlaceDetailSheet';
import { Place, ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import IconComponent from '@/components/ui/icon';
import { toast } from 'sonner';

const initialPlaces: Place[] = [
  {
    id: '1',
    name: 'U37 Creative Warehouse',
    name_local: 'U37创意仓库',
    coords: [30.6586, 104.0647],
    category: 'art',
    emoji: '🎨',
    description: 'Андеграунд арт-пространство с галереями, барами и уличным искусством. Место встречи местной креативной молодежи.',
    price: '0-50¥',
    time: '14:00-22:00',
    address: '37 Wuhou District, Chengdu',
    distance_from_user: '2.3 км',
    why_recommended: 'Настоящая культурная жизнь Чэнду, далеко от туристических маршрутов. Здесь ты почувствуешь пульс современного китайского искусства.',
    rating_local: 4.7,
    tags: ['underground', 'art', 'local'],
  },
  {
    id: '2',
    name: 'MAO Livehouse',
    name_local: 'MAO现场音乐',
    coords: [30.6620, 104.0820],
    category: 'music',
    emoji: '🎵',
    description: 'Легендарный концертный зал, где играют лучшие инди-группы Китая. Отличная акустика и камерная атмосфера.',
    price: '100-200¥',
    time: '19:00-02:00',
    address: 'Little Bar Street, Chengdu',
    distance_from_user: '3.1 км',
    why_recommended: 'Если хочешь понять современную китайскую музыкальную сцену, это must-visit. Проверяй расписание заранее.',
    source_url: 'https://reddit.com/r/chengdu',
    rating_local: 4.8,
    tags: ['music', 'indie', 'nightlife'],
  },
  {
    id: '3',
    name: 'Yuanyang Lou',
    name_local: '鸳鸯楼',
    coords: [30.6550, 104.0550],
    category: 'secret',
    emoji: '🏢',
    description: 'Старые жилые дома с невероятной архитектурой 1960-х. Популярное место для фото у местных, но почти неизвестное туристам.',
    price: 'Бесплатно',
    time: 'Весь день',
    address: 'Jiuyanqiao District, Chengdu',
    distance_from_user: '1.8 км',
    why_recommended: 'Аутентичная атмосфера старого Чэнду. Приходи утром для лучшего света и меньше людей.',
    rating_local: 4.9,
    tags: ['photography', 'hidden', 'architecture'],
  },
  {
    id: '4',
    name: 'Shiyi Street Food',
    name_local: '拾壹街美食',
    coords: [30.6600, 104.0700],
    category: 'restaurant',
    emoji: '🍜',
    description: 'Уличная еда, где едят местные. Настоящая сычуаньская кухня без туристических наценок.',
    price: '20-60¥',
    time: '11:00-23:00',
    address: 'Shiyi Street, Wuhou District',
    distance_from_user: '2.5 км',
    why_recommended: 'Забудь про туристические рестораны. Здесь готовят так, как едят местные жители. Попробуй malatang и chuan chuan.',
    rating_local: 4.6,
    tags: ['food', 'local', 'street food', 'spicy'],
  },
];

export default function Index() {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userLocation] = useState<[number, number]>([30.6586, 104.0647]);
  const [isMobileMapView, setIsMobileMapView] = useState(false);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responses: Record<string, string> = {
        'Составить маршрут на день': `Отличная идея! Я составил маршрут на день:\n\n1. 🏢 Yuanyang Lou (09:00) - утренние фото\n2. 🎨 U37 Creative Warehouse (14:00) - искусство\n3. 🍜 Shiyi Street Food (19:00) - ужин\n4. 🎵 MAO Livehouse (21:00) - концерт\n\nВесь маршрут займет ~8 часов, общее расстояние 6.5 км`,
        'Где поесть как местный': `На карте у тебя уже есть 🍜 Shiyi Street Food - это must-visit!\n\nТакже могу добавить:\n- Маленькие noodle shops на People's Park\n- Hotpot на Yulin Road\n- Dumpling houses в старом городе\n\nХочешь, добавлю их на карту?`,
        'Спрятанные места': `Уже добавил несколько на карту! Особенно рекомендую 🏢 Yuanyang Lou - это настоящий hidden gem.\n\nЕще могу найти:\n- Секретные roof bars\n- Заброшенные фабрики-галереи\n- Тихие чайные домики в старых районах\n\nЧто интересно?`,
        'Оптимизировать маршрут': `Анализирую расположение точек... ✨\n\nОптимизировал маршрут! Теперь порядок такой:\n1. Yuanyang Lou (ближайшее)\n2. U37 Creative Warehouse\n3. Shiyi Street Food\n4. MAO Livehouse\n\nЭто сэкономит ~30 минут на дорогу!`,
      };

      const response = responses[content] || `Понял тебя! Работаю над запросом "${content}".\n\nМогу помочь с:\n• Поиском мест\n• Составлением маршрутов\n• Практическими советами\n• Оптимизацией плана\n\nЧто именно интересует?`;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setIsSheetOpen(true);
  };

  const handleDeletePlace = (placeId: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    toast.success('Место удалено с карты');
  };

  const handleNavigate = (coords: [number, number]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
    window.open(url, '_blank');
  };

  const handleShareTrip = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Ссылка скопирована в буфер обмена!');
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🗺️</div>
          <div>
            <h1 className="text-lg font-bold">Travel Planner</h1>
            <p className="text-xs text-muted-foreground">AI-гид по миру</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShareTrip}>
            <IconComponent name="Share2" size={16} />
            <span className="hidden sm:inline">Поделиться</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMapView(!isMobileMapView)}
          >
            <IconComponent name={isMobileMapView ? 'MessageSquare' : 'Map'} size={16} />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full md:w-2/5 lg:w-1/3 border-r flex-shrink-0 ${
            isMobileMapView ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            tripInfo={{
              city: 'Чэнду, Китай',
              placesCount: places.length,
            }}
          />
        </div>

        <div
          className={`flex-1 ${
            isMobileMapView ? 'block' : 'hidden md:block'
          }`}
        >
          <Map
            places={places}
            userLocation={userLocation}
            onPlaceClick={handlePlaceClick}
            onDeletePlace={handleDeletePlace}
          />
        </div>
      </div>

      <PlaceDetailSheet
        place={selectedPlace}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
