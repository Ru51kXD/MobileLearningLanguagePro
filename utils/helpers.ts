// Форматирование даты
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Получение цвета для уровня сложности
export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Начинающий':
      return '#10b981';
    case 'Средний':
      return '#f59e0b';
    case 'Сложный':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

// Расчет процента прогресса
export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Форматирование очков
export const formatPoints = (points: number): string => {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
};

// Получение уровня пользователя на основе очков
export const getUserLevel = (points: number): string => {
  if (points < 500) return 'Начинающий';
  if (points < 1500) return 'Прогрессирующий';
  if (points < 3000) return 'Продвинутый';
  if (points < 5000) return 'Эксперт';
  return 'Мастер';
};

// Генерация случайного ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Получение поздравительного сообщения на основе результата викторины
export const getQuizMessage = (percentage: number): string => {
  if (percentage >= 90) return 'Превосходно! 🎉';
  if (percentage >= 70) return 'Отлично! 👏';
  if (percentage >= 50) return 'Хорошо! 👍';
  if (percentage >= 30) return 'Неплохо! 💪';
  return 'Попробуйте еще раз! 📚';
};

// Конвертация времени в читаемый формат
export const timeAgo = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
  
  return formatDate(dateString);
};

// Получение рандомного элемента из массива
export const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Перемешивание массива
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}; 