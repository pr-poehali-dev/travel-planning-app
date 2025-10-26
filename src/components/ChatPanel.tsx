import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import IconComponent from '@/components/ui/icon';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  tripInfo?: {
    city: string;
    placesCount: number;
  };
}

const quickActions = [
  { label: 'Составить маршрут на день', icon: 'Route' },
  { label: 'Где поесть как местный', icon: 'UtensilsCrossed' },
  { label: 'Спрятанные места', icon: 'Eye' },
  { label: 'Оптимизировать маршрут', icon: 'Zap' },
];

export function ChatPanel({ messages, onSendMessage, tripInfo }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {tripInfo && (
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <IconComponent name="MapPin" size={20} />
                {tripInfo.city}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tripInfo.placesCount} {tripInfo.placesCount === 1 ? 'место' : tripInfo.placesCount < 5 ? 'места' : 'мест'} на карте
              </p>
            </div>
            <Badge variant="default" className="animate-pulse-ring">
              Online
            </Badge>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">
                Привет! Я твой личный гид
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Расскажи, куда планируешь поехать или где находишься сейчас,
                и я помогу найти самые интересные места
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <Card
                className={`max-w-[80%] p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-3">
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onSendMessage(action.label)}
            >
              <IconComponent name={action.icon as any} size={14} />
              {action.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Напиши свой запрос..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <IconComponent name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
