interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number;
  difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
  language: string;
}

export const quizzes: Quiz[] = [
  // JavaScript Quiz
  {
    id: 1,
    title: 'Тест по основам JavaScript',
    description: 'Проверьте свои знания основ JavaScript',
    language: 'JavaScript',
    difficulty: 'Начинающий',
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: 'Что такое JavaScript?',
        options: [
          'Язык разметки',
          'Язык программирования',
          'База данных',
          'Операционная система'
        ],
        correctAnswer: 1,
        explanation: 'JavaScript - это высокоуровневый язык программирования, который используется для создания интерактивных веб-страниц.'
      },
      {
        id: 2,
        question: 'Какой из этих способов объявления переменных является современным?',
        options: [
          'var name = "John"',
          'let name = "John"',
          'variable name = "John"',
          'string name = "John"'
        ],
        correctAnswer: 1,
        explanation: 'let - это современный способ объявления переменных в JavaScript, введенный в ES6.'
      },
      {
        id: 3,
        question: 'Что выведет console.log(typeof null)?',
        options: [
          'null',
          'undefined',
          'object',
          'boolean'
        ],
        correctAnswer: 2,
        explanation: 'Это известная особенность JavaScript - typeof null возвращает "object", хотя null не является объектом.'
      },
      {
        id: 4,
        question: 'Как создать функцию в JavaScript?',
        options: [
          'function myFunc() {}',
          'def myFunc() {}',
          'create function myFunc() {}',
          'func myFunc() {}'
        ],
        correctAnswer: 0,
        explanation: 'В JavaScript функции создаются с помощью ключевого слова function.'
      },
      {
        id: 5,
        question: 'Что такое DOM?',
        options: [
          'Язык программирования',
          'База данных',
          'Объектная модель документа',
          'Веб-сервер'
        ],
        correctAnswer: 2,
        explanation: 'DOM (Document Object Model) - это объектная модель документа, которая представляет HTML-документ в виде дерева объектов.'
      }
    ]
  },

  // Python Quiz
  {
    id: 2,
    title: 'Тест по основам Python',
    description: 'Проверьте свои знания основ Python',
    language: 'Python',
    difficulty: 'Начинающий',
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: 'Какой символ используется для комментариев в Python?',
        options: [
          '//',
          '#',
          '/*',
          '--'
        ],
        correctAnswer: 1,
        explanation: 'В Python для однострочных комментариев используется символ #.'
      },
      {
        id: 2,
        question: 'Как правильно объявить список в Python?',
        options: [
          'list = [1, 2, 3]',
          'list = (1, 2, 3)',
          'list = {1, 2, 3}',
          'list = <1, 2, 3>'
        ],
        correctAnswer: 0,
        explanation: 'В Python списки объявляются с помощью квадратных скобок [].'
      },
      {
        id: 3,
        question: 'Что выведет print(type([]))?',
        options: [
          '<class \'tuple\'>',
          '<class \'dict\'>',
          '<class \'list\'>',
          '<class \'set\'>'
        ],
        correctAnswer: 2,
        explanation: 'Пустые квадратные скобки [] создают объект типа list.'
      },
      {
        id: 4,
        question: 'Как определить функцию в Python?',
        options: [
          'function myFunc():',
          'def myFunc():',
          'func myFunc():',
          'define myFunc():'
        ],
        correctAnswer: 1,
        explanation: 'В Python функции определяются с помощью ключевого слова def.'
      },
      {
        id: 5,
        question: 'Какой оператор используется для возведения в степень?',
        options: [
          '^',
          '**',
          'pow',
          '^^'
        ],
        correctAnswer: 1,
        explanation: 'В Python оператор ** используется для возведения в степень.'
      }
    ]
  },

  // React Quiz
  {
    id: 3,
    title: 'Тест по основам React',
    description: 'Проверьте свои знания основ React',
    language: 'React',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Что такое JSX?',
        options: [
          'Новый язык программирования',
          'Расширение синтаксиса JavaScript',
          'Библиотека для стилизации',
          'Фреймворк для тестирования'
        ],
        correctAnswer: 1,
        explanation: 'JSX - это расширение синтаксиса JavaScript, которое позволяет писать HTML-подобный код в JavaScript.'
      },
      {
        id: 2,
        question: 'Как передать данные от родительского компонента к дочернему?',
        options: [
          'Через state',
          'Через props',
          'Через context',
          'Через refs'
        ],
        correctAnswer: 1,
        explanation: 'Props (properties) используются для передачи данных от родительского компонента к дочернему.'
      },
      {
        id: 3,
        question: 'Какой хук используется для управления состоянием?',
        options: [
          'useEffect',
          'useState',
          'useContext',
          'useReducer'
        ],
        correctAnswer: 1,
        explanation: 'useState - это хук для управления локальным состоянием компонента.'
      },
      {
        id: 4,
        question: 'Что такое Virtual DOM?',
        options: [
          'Реальный DOM',
          'Виртуальное представление DOM в памяти',
          'Новый браузерный API',
          'Библиотека для работы с DOM'
        ],
        correctAnswer: 1,
        explanation: 'Virtual DOM - это виртуальное представление реального DOM в памяти, которое React использует для оптимизации обновлений.'
      },
      {
        id: 5,
        question: 'Когда вызывается useEffect без зависимостей?',
        options: [
          'Только при монтировании',
          'При каждом рендере',
          'Только при размонтировании',
          'Никогда'
        ],
        correctAnswer: 1,
        explanation: 'useEffect без массива зависимостей вызывается при каждом рендере компонента.'
      }
    ]
  },

  // Java Quiz
  {
    id: 4,
    title: 'Тест по основам Java',
    description: 'Проверьте свои знания основ Java',
    language: 'Java',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Какой модификатор доступа делает член класса доступным только внутри класса?',
        options: [
          'public',
          'protected',
          'private',
          'default'
        ],
        correctAnswer: 2,
        explanation: 'Модификатор private делает член класса доступным только внутри того же класса.'
      },
      {
        id: 2,
        question: 'Что такое JVM?',
        options: [
          'Java Virtual Machine',
          'Java Version Manager',
          'Java Variable Method',
          'Java Verification Module'
        ],
        correctAnswer: 0,
        explanation: 'JVM (Java Virtual Machine) - это виртуальная машина, которая выполняет байт-код Java.'
      },
      {
        id: 3,
        question: 'Какой тип данных используется для хранения целых чисел?',
        options: [
          'float',
          'double',
          'int',
          'char'
        ],
        correctAnswer: 2,
        explanation: 'Тип данных int используется для хранения 32-битных целых чисел.'
      },
      {
        id: 4,
        question: 'Что означает ключевое слово "static"?',
        options: [
          'Переменная не может изменяться',
          'Член принадлежит классу, а не экземпляру',
          'Метод не может быть переопределен',
          'Класс не может наследоваться'
        ],
        correctAnswer: 1,
        explanation: 'Ключевое слово static означает, что член принадлежит классу, а не конкретному экземпляру.'
      },
      {
        id: 5,
        question: 'Какой метод является точкой входа в Java программу?',
        options: [
          'start()',
          'run()',
          'main()',
          'init()'
        ],
        correctAnswer: 2,
        explanation: 'Метод main() является точкой входа в Java программу.'
      }
    ]
  },

  // C++ Quiz
  {
    id: 5,
    title: 'Тест по основам C++',
    description: 'Проверьте свои знания основ C++',
    language: 'C++',
    difficulty: 'Продвинутый',
    timeLimit: 500,
    questions: [
      {
        id: 1,
        question: 'Какой оператор используется для выделения памяти в C++?',
        options: [
          'malloc',
          'new',
          'alloc',
          'create'
        ],
        correctAnswer: 1,
        explanation: 'Оператор new используется для динамического выделения памяти в C++.'
      },
      {
        id: 2,
        question: 'Что такое указатель?',
        options: [
          'Переменная, хранящая значение',
          'Переменная, хранящая адрес другой переменной',
          'Функция для работы с памятью',
          'Тип данных для строк'
        ],
        correctAnswer: 1,
        explanation: 'Указатель - это переменная, которая хранит адрес другой переменной в памяти.'
      },
      {
        id: 3,
        question: 'Какой символ используется для объявления указателя?',
        options: [
          '&',
          '*',
          '#',
          '@'
        ],
        correctAnswer: 1,
        explanation: 'Символ * используется для объявления указателя в C++.'
      },
      {
        id: 4,
        question: 'Что такое конструктор?',
        options: [
          'Функция для уничтожения объекта',
          'Функция для инициализации объекта',
          'Функция для копирования объекта',
          'Функция для сравнения объектов'
        ],
        correctAnswer: 1,
        explanation: 'Конструктор - это специальная функция, которая автоматически вызывается при создании объекта для его инициализации.'
      },
      {
        id: 5,
        question: 'Какое ключевое слово используется для наследования?',
        options: [
          'extends',
          'inherits',
          'public',
          'class'
        ],
        correctAnswer: 2,
        explanation: 'В C++ для наследования используется ключевое слово public (или private/protected) после двоеточия.'
      }
    ]
  },

  // C# Quiz
  {
    id: 6,
    title: 'Тест по основам C#',
    description: 'Проверьте свои знания основ C#',
    language: 'C#',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Какое ключевое слово используется для объявления класса?',
        options: [
          'class',
          'Class',
          'object',
          'struct'
        ],
        correctAnswer: 0,
        explanation: 'Ключевое слово class используется для объявления класса в C#.'
      },
      {
        id: 2,
        question: 'Что такое namespace?',
        options: [
          'Тип данных',
          'Пространство имен',
          'Модификатор доступа',
          'Метод класса'
        ],
        correctAnswer: 1,
        explanation: 'Namespace (пространство имен) используется для организации кода и предотвращения конфликтов имен.'
      },
      {
        id: 3,
        question: 'Какой тип данных используется для логических значений?',
        options: [
          'boolean',
          'bool',
          'logical',
          'bit'
        ],
        correctAnswer: 1,
        explanation: 'Тип данных bool используется для хранения логических значений true/false.'
      },
      {
        id: 4,
        question: 'Что означает ключевое слово "using"?',
        options: [
          'Создание объекта',
          'Подключение пространства имен',
          'Объявление переменной',
          'Определение метода'
        ],
        correctAnswer: 1,
        explanation: 'Ключевое слово using используется для подключения пространств имен.'
      },
      {
        id: 5,
        question: 'Какой метод является точкой входа в C# программу?',
        options: [
          'Start()',
          'Run()',
          'Main()',
          'Begin()'
        ],
        correctAnswer: 2,
        explanation: 'Метод Main() является точкой входа в C# программу.'
      }
    ]
  },

  // PHP Quiz
  {
    id: 7,
    title: 'Тест по основам PHP',
    description: 'Проверьте свои знания основ PHP',
    language: 'PHP',
    difficulty: 'Начинающий',
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: 'Как начинается PHP код?',
        options: [
          '<php>',
          '<?php',
          '<script>',
          '<%'
        ],
        correctAnswer: 1,
        explanation: 'PHP код начинается с тега <?php.'
      },
      {
        id: 2,
        question: 'Какой символ используется для переменных в PHP?',
        options: [
          '@',
          '#',
          '$',
          '%'
        ],
        correctAnswer: 2,
        explanation: 'В PHP все переменные начинаются с символа $.'
      },
      {
        id: 3,
        question: 'Как вывести текст в PHP?',
        options: [
          'print()',
          'echo',
          'console.log()',
          'printf()'
        ],
        correctAnswer: 1,
        explanation: 'Для вывода текста в PHP используется echo или print.'
      },
      {
        id: 4,
        question: 'Как объявить массив в PHP?',
        options: [
          '$arr = []',
          '$arr = array()',
          'Оба варианта верны',
          '$arr = new Array()'
        ],
        correctAnswer: 2,
        explanation: 'В PHP массив можно объявить как $arr = [] или $arr = array().'
      },
      {
        id: 5,
        question: 'Какой оператор используется для конкатенации строк?',
        options: [
          '+',
          '.',
          '&',
          '||'
        ],
        correctAnswer: 1,
        explanation: 'В PHP для конкатенации строк используется оператор точка (.).'
      }
    ]
  },

  // Swift Quiz
  {
    id: 8,
    title: 'Тест по основам Swift',
    description: 'Проверьте свои знания основ Swift',
    language: 'Swift',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Какое ключевое слово используется для объявления константы?',
        options: [
          'var',
          'let',
          'const',
          'final'
        ],
        correctAnswer: 1,
        explanation: 'Ключевое слово let используется для объявления константы в Swift.'
      },
      {
        id: 2,
        question: 'Что такое Optional в Swift?',
        options: [
          'Тип данных для чисел',
          'Тип, который может содержать значение или nil',
          'Функция для проверки условий',
          'Модификатор доступа'
        ],
        correctAnswer: 1,
        explanation: 'Optional - это тип, который может содержать значение или nil (отсутствие значения).'
      },
      {
        id: 3,
        question: 'Как объявить функцию в Swift?',
        options: [
          'function myFunc()',
          'def myFunc()',
          'func myFunc()',
          'void myFunc()'
        ],
        correctAnswer: 2,
        explanation: 'Функции в Swift объявляются с помощью ключевого слова func.'
      },
      {
        id: 4,
        question: 'Какой символ используется для force unwrapping?',
        options: [
          '?',
          '!',
          '*',
          '&'
        ],
        correctAnswer: 1,
        explanation: 'Символ ! используется для force unwrapping Optional значений.'
      },
      {
        id: 5,
        question: 'Что такое guard statement?',
        options: [
          'Цикл',
          'Условие с ранним выходом',
          'Функция',
          'Класс'
        ],
        correctAnswer: 1,
        explanation: 'Guard statement - это условная конструкция с ранним выходом из функции.'
      }
    ]
  },

  // Kotlin Quiz
  {
    id: 9,
    title: 'Тест по основам Kotlin',
    description: 'Проверьте свои знания основ Kotlin',
    language: 'Kotlin',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Какое ключевое слово используется для объявления неизменяемой переменной?',
        options: [
          'var',
          'val',
          'const',
          'final'
        ],
        correctAnswer: 1,
        explanation: 'Ключевое слово val используется для объявления неизменяемой переменной в Kotlin.'
      },
      {
        id: 2,
        question: 'Что такое Null Safety в Kotlin?',
        options: [
          'Защита от null-указателей',
          'Проверка типов',
          'Управление памятью',
          'Обработка исключений'
        ],
        correctAnswer: 0,
        explanation: 'Null Safety - это система типов Kotlin, которая защищает от NullPointerException.'
      },
      {
        id: 3,
        question: 'Как объявить функцию в Kotlin?',
        options: [
          'function myFunc()',
          'def myFunc()',
          'fun myFunc()',
          'func myFunc()'
        ],
        correctAnswer: 2,
        explanation: 'Функции в Kotlin объявляются с помощью ключевого слова fun.'
      },
      {
        id: 4,
        question: 'Какой символ используется для safe call?',
        options: [
          '?.',
          '!.',
          '*.',
          '&.'
        ],
        correctAnswer: 0,
        explanation: 'Оператор ?. используется для безопасного вызова методов на nullable объектах.'
      },
      {
        id: 5,
        question: 'Что такое data class?',
        options: [
          'Класс для работы с базой данных',
          'Класс для хранения данных',
          'Абстрактный класс',
          'Интерфейс'
        ],
        correctAnswer: 1,
        explanation: 'Data class - это специальный класс в Kotlin для хранения данных с автоматически генерируемыми методами.'
      }
    ]
  },

  // Go Quiz
  {
    id: 10,
    title: 'Тест по основам Go',
    description: 'Проверьте свои знания основ Go',
    language: 'Go',
    difficulty: 'Средний',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Как объявить переменную в Go?',
        options: [
          'var x int',
          'int x',
          'x := int',
          'declare x int'
        ],
        correctAnswer: 0,
        explanation: 'В Go переменные объявляются с помощью ключевого слова var.'
      },
      {
        id: 2,
        question: 'Что такое goroutine?',
        options: [
          'Функция',
          'Легковесный поток',
          'Переменная',
          'Пакет'
        ],
        correctAnswer: 1,
        explanation: 'Goroutine - это легковесный поток выполнения в Go.'
      },
      {
        id: 3,
        question: 'Какое ключевое слово используется для создания goroutine?',
        options: [
          'async',
          'thread',
          'go',
          'routine'
        ],
        correctAnswer: 2,
        explanation: 'Ключевое слово go используется для создания новой goroutine.'
      },
      {
        id: 4,
        question: 'Что такое channel в Go?',
        options: [
          'Функция',
          'Средство коммуникации между goroutines',
          'Тип данных',
          'Пакет'
        ],
        correctAnswer: 1,
        explanation: 'Channel - это средство коммуникации между goroutines в Go.'
      },
      {
        id: 5,
        question: 'Как объявить slice в Go?',
        options: [
          'var s []int',
          'var s [int]',
          'var s array[int]',
          'var s list[int]'
        ],
        correctAnswer: 0,
        explanation: 'Slice объявляется как var s []int, где int - тип элементов.'
      }
    ]
  },

  // Rust Quiz
  {
    id: 11,
    title: 'Тест по основам Rust',
    description: 'Проверьте свои знания основ Rust',
    language: 'Rust',
    difficulty: 'Продвинутый',
    timeLimit: 500,
    questions: [
      {
        id: 1,
        question: 'Что такое ownership в Rust?',
        options: [
          'Наследование',
          'Система управления памятью',
          'Полиморфизм',
          'Инкапсуляция'
        ],
        correctAnswer: 1,
        explanation: 'Ownership - это уникальная система управления памятью в Rust без сборщика мусора.'
      },
      {
        id: 2,
        question: 'Какое ключевое слово используется для изменяемых переменных?',
        options: [
          'var',
          'let',
          'mut',
          'mutable'
        ],
        correctAnswer: 2,
        explanation: 'Ключевое слово mut используется для создания изменяемых переменных: let mut x = 5;'
      },
      {
        id: 3,
        question: 'Что такое borrowing?',
        options: [
          'Копирование данных',
          'Временное использование значения без владения',
          'Удаление данных',
          'Создание данных'
        ],
        correctAnswer: 1,
        explanation: 'Borrowing позволяет временно использовать значение без получения владения над ним.'
      },
      {
        id: 4,
        question: 'Какой символ используется для создания ссылки?',
        options: [
          '*',
          '&',
          '#',
          '@'
        ],
        correctAnswer: 1,
        explanation: 'Символ & используется для создания ссылки (borrowing) в Rust.'
      },
      {
        id: 5,
        question: 'Что такое match в Rust?',
        options: [
          'Цикл',
          'Условие',
          'Сопоставление с образцом',
          'Функция'
        ],
        correctAnswer: 2,
        explanation: 'Match - это мощная конструкция для сопоставления с образцом в Rust.'
      }
    ]
  },

  // React Native Quiz
  {
    id: 12,
    title: 'Тест по React Native',
    description: 'Проверьте свои знания React Native',
    language: 'React Native',
    difficulty: 'Продвинутый',
    timeLimit: 400,
    questions: [
      {
        id: 1,
        question: 'Что такое React Native?',
        options: [
          'Веб-фреймворк',
          'Фреймворк для мобильных приложений',
          'База данных',
          'Язык программирования'
        ],
        correctAnswer: 1,
        explanation: 'React Native - это фреймворк для создания кроссплатформенных мобильных приложений.'
      },
      {
        id: 2,
        question: 'Какой компонент используется вместо div?',
        options: [
          'Container',
          'View',
          'Box',
          'Wrapper'
        ],
        correctAnswer: 1,
        explanation: 'В React Native компонент View используется вместо HTML div.'
      },
      {
        id: 3,
        question: 'Как создать кнопку в React Native?',
        options: [
          '<button>',
          '<Button>',
          '<TouchableOpacity>',
          'Оба варианта B и C'
        ],
        correctAnswer: 3,
        explanation: 'В React Native можно использовать как Button, так и TouchableOpacity для создания кнопок.'
      },
      {
        id: 4,
        question: 'Что такое StyleSheet в React Native?',
        options: [
          'CSS файл',
          'Объект для создания стилей',
          'HTML тег',
          'JavaScript библиотека'
        ],
        correctAnswer: 1,
        explanation: 'StyleSheet - это объект React Native для создания и оптимизации стилей.'
      },
      {
        id: 5,
        question: 'Какой хук используется для навигации?',
        options: [
          'useRouter',
          'useNavigation',
          'useRoute',
          'useNavigate'
        ],
        correctAnswer: 1,
        explanation: 'useNavigation - это хук React Navigation для программной навигации.'
      }
    ]
  }
];

export const getQuizByLanguage = (language: string): Quiz | undefined => {
  // Нормализуем название языка для поиска
  const normalizedLanguage = language.toLowerCase();
  
  const languageMap: { [key: string]: string } = {
    'javascript': 'JavaScript',
    'python': 'Python', 
    'react': 'React',
    'java': 'Java',
    'c++': 'C++',
    'c#': 'C#',
    'php': 'PHP',
    'swift': 'Swift',
    'kotlin': 'Kotlin',
    'go': 'Go',
    'rust': 'Rust',
    'мобильная': 'React Native',
    'react native': 'React Native'
  };
  
  const mappedLanguage = languageMap[normalizedLanguage] || language;
  return quizzes.find(quiz => quiz.language === mappedLanguage);
};

export const getQuizById = (id: number): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === id);
}; 