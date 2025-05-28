import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, SafeAreaView, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { saveLessonProgress } from '../database/database';
import { getQuizByLanguage } from '../data/quizzes';

const { width, height } = Dimensions.get('window');

interface Course {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string[];
  lessons: number;
  difficulty: 'Начинающий' | 'Средний' | 'Продвинутый';
  progress: number;
  category: string;
  estimatedTime: string;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  duration: number;
  completed: boolean;
  type: 'theory' | 'practice' | 'test';
}

const LessonsScreen = () => {
  const navigation = useNavigation();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [coursesData, setCoursesData] = useState<Course[]>([]);

  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Инициализируем данные курсов
    setCoursesData(courses);
  }, []);

  const courses: Course[] = [
    {
      id: 1,
      title: 'JavaScript Основы',
      description: 'Изучите основы JavaScript с нуля до продвинутого уровня',
      icon: 'logo-javascript',
      color: ['#f7df1e', '#f0d000'],
      lessons: 8,
      difficulty: 'Начинающий',
      progress: 0,
      category: 'Веб-разработка',
      estimatedTime: '6 недель',
      chapters: [
        {
          id: 1,
          title: 'Введение в JavaScript',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Что такое JavaScript?',
              description: 'Знакомство с языком программирования JavaScript',
              content: `JavaScript - это высокоуровневый, интерпретируемый язык программирования.

Основные особенности JavaScript:
• Динамическая типизация
• Прототипное наследование  
• Функции первого класса
• Событийно-ориентированное программирование

JavaScript используется для:
- Веб-разработки (фронтенд и бэкенд)
- Мобильных приложений
- Десктопных приложений
- Серверных приложений

Пример простого кода:
console.log("Привет, мир!");

let name = "Студент";
console.log("Привет, " + name + "!");`,
              duration: 15,
              completed: false,
              type: 'theory'
    },
    {
      id: 2,
              title: 'Переменные и типы данных',
              description: 'Изучаем переменные, константы и типы данных в JavaScript',
              content: `В JavaScript есть несколько способов объявления переменных:

1. var - устаревший способ
2. let - для изменяемых переменных
3. const - для констант

Типы данных:
• Number - числа
• String - строки
• Boolean - логический тип
• Object - объекты
• Array - массивы
• null - пустое значение
• undefined - неопределенное значение

Примеры:
let age = 25;
const name = "Иван";
let isStudent = true;
let hobbies = ["программирование", "чтение"];`,
              duration: 20,
              completed: false,
              type: 'theory'
    },
    {
      id: 3,
              title: 'Тест: Основы JavaScript',
              description: 'Проверьте свои знания основ JavaScript',
              content: 'Тестирование знаний по основам JavaScript',
              duration: 10,
              completed: false,
              type: 'test'
            }
          ]
        },
        {
          id: 2,
          title: 'Функции и области видимости',
          completed: false,
          lessons: [
            {
              id: 4,
              title: 'Объявление функций',
              description: 'Различные способы создания функций в JavaScript',
              content: `Функции в JavaScript можно создавать несколькими способами:

1. Function Declaration:
function greet(name) {
    return "Привет, " + name + "!";
}

2. Function Expression:
const greet = function(name) {
    return "Привет, " + name + "!";
};

3. Arrow Functions:
const greet = (name) => {
    return "Привет, " + name + "!";
};

// Сокращенная запись
const greet = name => "Привет, " + name + "!";

Функции могут принимать параметры и возвращать значения.`,
              duration: 25,
              completed: false,
              type: 'theory'
            },
            {
              id: 5,
              title: 'Области видимости',
              description: 'Понимание scope в JavaScript',
              content: `Область видимости определяет, где переменные доступны в коде.

Типы областей видимости:
• Глобальная область
• Функциональная область
• Блочная область (let, const)

Примеры:
var globalVar = "Глобальная";

function myFunction() {
    var functionVar = "Функциональная";
    
    if (true) {
        let blockVar = "Блочная";
        const blockConst = "Блочная константа";
    }
}

Hoisting - поднятие объявлений переменных и функций.`,
              duration: 20,
              completed: false,
              type: 'theory'
            },
            {
              id: 6,
              title: 'Тест: Функции JavaScript',
              description: 'Проверьте знания функций и областей видимости',
              content: 'Тестирование знаний по функциям JavaScript',
              duration: 10,
              completed: false,
              type: 'test'
            }
          ]
        },
        {
          id: 3,
          title: 'Объекты и массивы',
          completed: false,
          lessons: [
            {
              id: 7,
              title: 'Работа с объектами',
              description: 'Создание и использование объектов в JavaScript',
              content: `Объекты - это коллекции пар ключ-значение.

Создание объектов:
const person = {
    name: "Иван",
    age: 30,
    city: "Москва"
};

// Доступ к свойствам
console.log(person.name);
console.log(person["age"]);

// Добавление свойств
person.job = "Программист";

// Методы объекта
const calculator = {
    add: function(a, b) {
        return a + b;
    },
    multiply: (a, b) => a * b
};`,
              duration: 25,
              completed: false,
              type: 'theory'
            },
            {
              id: 8,
              title: 'Работа с массивами',
              description: 'Методы массивов и их применение',
              content: `Массивы - это упорядоченные списки элементов.

Создание массивов:
const fruits = ["яблоко", "банан", "апельсин"];
const numbers = [1, 2, 3, 4, 5];

Основные методы:
• push() - добавить в конец
• pop() - удалить с конца
• shift() - удалить с начала
• unshift() - добавить в начало

Методы высшего порядка:
• map() - преобразование
• filter() - фильтрация
• reduce() - свертка
• forEach() - итерация

Пример:
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);`,
              duration: 30,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Python для начинающих',
      description: 'Изучите Python - простой и мощный язык программирования',
      icon: 'logo-python',
      color: ['#3776ab', '#ffd43b'],
      lessons: 6,
      difficulty: 'Начинающий',
      progress: 0,
      category: 'Программирование',
      estimatedTime: '5 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Python',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Python',
              description: 'Знакомство с языком Python и его особенностями',
              content: `Python - это высокоуровневый язык программирования общего назначения.

Особенности Python:
• Простой и читаемый синтаксис
• Интерпретируемый язык
• Динамическая типизация
• Большая стандартная библиотека
• Кроссплатформенность

Python используется для:
- Веб-разработки
- Анализа данных
- Машинного обучения
- Автоматизации
- Научных вычислений

Пример кода:
print("Привет, мир!")

name = "Студент"
print(f"Привет, {name}!")`,
              duration: 15,
              completed: false,
              type: 'theory'
            },
            {
              id: 2,
              title: 'Переменные и типы данных',
              description: 'Работа с переменными и основными типами данных в Python',
              content: `В Python переменные создаются простым присваиванием:

Основные типы данных:
• int - целые числа
• float - числа с плавающей точкой
• str - строки
• bool - логический тип
• list - списки
• dict - словари
• tuple - кортежи

Примеры:
age = 25
height = 175.5
name = "Анна"
is_student = True
grades = [5, 4, 5, 3]
person = {"name": "Иван", "age": 30}

Python автоматически определяет тип переменной.`,
              duration: 20,
              completed: false,
              type: 'theory'
            },
            {
              id: 3,
              title: 'Тест: Основы Python',
              description: 'Проверьте знания основ Python',
              content: 'Тестирование знаний по основам Python',
              duration: 10,
              completed: false,
              type: 'test'
            }
          ]
        },
        {
          id: 2,
          title: 'Функции и модули',
          completed: false,
          lessons: [
            {
              id: 4,
              title: 'Функции в Python',
              description: 'Создание и использование функций',
              content: `Функции в Python создаются с помощью ключевого слова def.

Синтаксис:
def function_name(parameters):
    """Документация функции"""
    # тело функции
    return result

Примеры:
def greet(name):
    return f"Привет, {name}!"

def add_numbers(a, b=0):
    return a + b

# Функция с переменным количеством аргументов
def sum_all(*args):
    return sum(args)

# Функция с именованными аргументами
def create_profile(**kwargs):
    return kwargs

# Лямбда-функции
square = lambda x: x ** 2`,
              duration: 25,
              completed: false,
              type: 'theory'
            },
            {
              id: 5,
              title: 'Модули и пакеты',
              description: 'Организация кода в модули',
              content: `Модули позволяют организовать код в отдельные файлы.

Импорт модулей:
import math
from datetime import datetime
import numpy as np
from collections import Counter

Создание собственного модуля:
# файл mymodule.py
def my_function():
    return "Hello from module"

PI = 3.14159

# использование
import mymodule
result = mymodule.my_function()

Популярные модули:
• os - работа с операционной системой
• sys - системные параметры
• json - работа с JSON
• requests - HTTP запросы
• pandas - анализ данных`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        },
        {
          id: 3,
          title: 'Объектно-ориентированное программирование',
          completed: false,
          lessons: [
            {
              id: 6,
              title: 'Классы и объекты',
              description: 'Основы ООП в Python',
              content: `Классы - это шаблоны для создания объектов.

Создание класса:
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def greet(self):
        return f"Привет, меня зовут {self.name}"
    
    def have_birthday(self):
        self.age += 1

# Создание объекта
person = Person("Анна", 25)
print(person.greet())

Наследование:
class Student(Person):
    def __init__(self, name, age, university):
        super().__init__(name, age)
        self.university = university
    
    def study(self):
        return f"{self.name} учится в {self.university}"`,
              duration: 30,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'React Разработка',
      description: 'Создавайте современные веб-приложения с React',
      icon: 'logo-react',
      color: ['#61dafb', '#21232a'],
      lessons: 5,
      difficulty: 'Средний',
      progress: 0,
      category: 'Фронтенд',
      estimatedTime: '4 недели',
      chapters: [
        {
          id: 1,
          title: 'Введение в React',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Что такое React?',
              description: 'Знакомство с библиотекой React',
              content: `React - это JavaScript библиотека для создания пользовательских интерфейсов.

Ключевые концепции React:
• Компонентный подход
• Виртуальный DOM
• Однонаправленный поток данных
• JSX синтаксис
• Состояние и пропсы

Преимущества React:
- Переиспользуемые компоненты
- Высокая производительность
- Большое сообщество
- Богатая экосистема

Пример компонента:
function Welcome(props) {
  return <h1>Привет, {props.name}!</h1>;
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            },
            {
              id: 2,
              title: 'JSX и компоненты',
              description: 'Изучаем JSX синтаксис и создание компонентов',
              content: `JSX - это расширение синтаксиса JavaScript для React.

Основы JSX:
• Похож на HTML, но это JavaScript
• Можно вставлять выражения в {}
• Атрибуты пишутся в camelCase
• Должен возвращать один корневой элемент

Примеры:
const element = <h1>Привет, мир!</h1>;

const name = "Анна";
const greeting = <h1>Привет, {name}!</h1>;

function Button() {
  return <button onClick={() => alert('Клик!')}>Нажми меня</button>;
}`,
              duration: 25,
              completed: false,
              type: 'theory'
            },
            {
              id: 3,
              title: 'Тест: Основы React',
              description: 'Проверьте знания основ React',
              content: 'Тестирование знаний по основам React',
              duration: 10,
              completed: false,
              type: 'test'
            }
          ]
        },
        {
          id: 2,
          title: 'Состояние и хуки',
          completed: false,
          lessons: [
            {
              id: 4,
              title: 'useState хук',
              description: 'Управление состоянием компонента',
              content: `useState - это хук для управления локальным состоянием.

Синтаксис:
const [state, setState] = useState(initialValue);

Примеры:
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Счетчик: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Увеличить
      </button>
    </div>
  );
}

Состояние с объектами:
const [user, setUser] = useState({
  name: '',
  email: ''
});

const updateName = (newName) => {
  setUser(prevUser => ({
    ...prevUser,
    name: newName
  }));
};`,
              duration: 25,
              completed: false,
              type: 'theory'
            },
            {
              id: 5,
              title: 'useEffect хук',
              description: 'Побочные эффекты в React',
              content: `useEffect позволяет выполнять побочные эффекты.

Синтаксис:
useEffect(() => {
  // код эффекта
}, [dependencies]);

Примеры:
// Эффект при каждом рендере
useEffect(() => {
  console.log('Компонент обновился');
});

// Эффект только при монтировании
useEffect(() => {
  console.log('Компонент смонтирован');
}, []);

// Эффект с зависимостями
useEffect(() => {
  document.title = \`Счетчик: \${count}\`;
}, [count]);

// Очистка эффекта
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Тик');
  }, 1000);
  
  return () => clearInterval(timer);
}, []);`,
              duration: 30,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Java Программирование',
      description: 'Изучите Java - мощный объектно-ориентированный язык',
      icon: 'cafe',
      color: ['#f89820', '#ed8b00'],
      lessons: 22,
      difficulty: 'Средний',
      progress: 0,
      category: 'Программирование',
      estimatedTime: '6 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Java',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Java',
              description: 'Знакомство с языком программирования Java',
              content: `Java - это объектно-ориентированный язык программирования.

Особенности Java:
• Платформонезависимость (Write Once, Run Anywhere)
• Автоматическое управление памятью
• Строгая типизация
• Многопоточность
• Безопасность

Java используется для:
- Корпоративных приложений
- Android разработки
- Веб-приложений
- Десктопных приложений

Пример программы:
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Привет, мир!");
    }
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            },
            {
              id: 2,
              title: 'Переменные и типы данных',
              description: 'Работа с переменными и типами данных в Java',
              content: `В Java все переменные должны быть объявлены с указанием типа.

Примитивные типы:
• byte - 8-битное целое число
• short - 16-битное целое число  
• int - 32-битное целое число
• long - 64-битное целое число
• float - число с плавающей точкой
• double - число двойной точности
• boolean - логический тип
• char - символ

Примеры:
int age = 25;
double height = 175.5;
String name = "Анна";
boolean isStudent = true;
char grade = 'A';`,
              duration: 25,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Мобильная разработка',
      description: 'Создавайте мобильные приложения с React Native',
      icon: 'phone-portrait',
      color: ['#61dafb', '#282c34'],
      lessons: 16,
      difficulty: 'Продвинутый',
      progress: 0,
      category: 'Мобильная разработка',
      estimatedTime: '5 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы React Native',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в React Native',
              description: 'Знакомство с фреймворком React Native',
              content: `React Native - это фреймворк для создания мобильных приложений.

Особенности React Native:
• Один код для iOS и Android
• Использует React концепции
• Нативная производительность
• Hot Reload для быстрой разработки
• Большое сообщество

Компоненты React Native:
- View (аналог div)
- Text (для текста)
- ScrollView (прокручиваемый контейнер)
- TouchableOpacity (кнопка)

Пример:
import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <Text>Привет, мир!</Text>
    </View>
  );
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'C++ Программирование',
      description: 'Изучите C++ - мощный язык системного программирования',
      icon: 'code-slash',
      color: ['#00599c', '#004482'],
      lessons: 24,
      difficulty: 'Продвинутый',
      progress: 0,
      category: 'Системное программирование',
      estimatedTime: '8 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы C++',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в C++',
              description: 'Знакомство с языком программирования C++',
              content: `C++ - это компилируемый язык программирования общего назначения.

Особенности C++:
• Низкоуровневое управление памятью
• Объектно-ориентированное программирование
• Высокая производительность
• Статическая типизация
• Поддержка множественного наследования

C++ используется для:
- Системного программирования
- Игровой разработки
- Встроенных систем
- Высокопроизводительных приложений

Пример программы:
#include <iostream>
using namespace std;

int main() {
    cout << "Привет, мир!" << endl;
    return 0;
}`,
              duration: 25,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'C# Разработка',
      description: 'Изучите C# и .NET для создания современных приложений',
      icon: 'logo-microsoft',
      color: ['#239120', '#68217a'],
      lessons: 20,
      difficulty: 'Средний',
      progress: 0,
      category: 'Программирование',
      estimatedTime: '6 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы C#',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в C#',
              description: 'Знакомство с языком программирования C#',
              content: `C# - это современный объектно-ориентированный язык программирования.

Особенности C#:
• Управляемая среда выполнения (.NET)
• Автоматическая сборка мусора
• Строгая типизация
• Богатая стандартная библиотека
• Кроссплатформенность

C# используется для:
- Веб-приложений (ASP.NET)
- Десктопных приложений (WPF, WinForms)
- Мобильных приложений (Xamarin)
- Игр (Unity)

Пример программы:
using System;

class Program {
    static void Main() {
        Console.WriteLine("Привет, мир!");
    }
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'PHP Веб-разработка',
      description: 'Создавайте динамические веб-сайты с PHP',
      icon: 'code-working',
      color: ['#777bb4', '#4f5b93'],
      lessons: 18,
      difficulty: 'Начинающий',
      progress: 0,
      category: 'Веб-разработка',
      estimatedTime: '4 недели',
      chapters: [
        {
          id: 1,
          title: 'Основы PHP',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в PHP',
              description: 'Знакомство с языком PHP для веб-разработки',
              content: `PHP - это серверный язык программирования для веб-разработки.

Особенности PHP:
• Интерпретируемый язык
• Встраивается в HTML
• Большое количество фреймворков
• Простота изучения
• Широкая поддержка хостингов

PHP используется для:
- Динамических веб-сайтов
- CMS систем (WordPress, Drupal)
- E-commerce платформ
- API разработки

Пример кода:
<?php
echo "Привет, мир!";

$name = "Студент";
echo "Привет, " . $name . "!";
?>`,
              duration: 15,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Swift для iOS',
      description: 'Разрабатывайте приложения для iOS с Swift',
      icon: 'logo-apple',
      color: ['#fa7343', '#ff8c00'],
      lessons: 19,
      difficulty: 'Средний',
      progress: 0,
      category: 'Мобильная разработка',
      estimatedTime: '5 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Swift',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Swift',
              description: 'Знакомство с языком программирования Swift',
              content: `Swift - это современный язык программирования от Apple.

Особенности Swift:
• Безопасность типов
• Высокая производительность
• Современный синтаксис
• Интероперабельность с Objective-C
• Открытый исходный код

Swift используется для:
- iOS приложений
- macOS приложений
- watchOS приложений
- tvOS приложений

Пример кода:
import Foundation

print("Привет, мир!")

let name = "Студент"
print("Привет, \\(name)!")`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Kotlin для Android',
      description: 'Создавайте Android приложения с Kotlin',
      icon: 'logo-android',
      color: ['#0f9d58', '#0d8043'],
      lessons: 17,
      difficulty: 'Средний',
      progress: 0,
      category: 'Мобильная разработка',
      estimatedTime: '4 недели',
      chapters: [
        {
          id: 1,
          title: 'Основы Kotlin',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Kotlin',
              description: 'Знакомство с языком программирования Kotlin',
              content: `Kotlin - это современный язык программирования для JVM.

Особенности Kotlin:
• 100% совместимость с Java
• Null Safety
• Краткий синтаксис
• Функциональное программирование
• Корутины для асинхронности

Kotlin используется для:
- Android разработки
- Серверной разработки
- Мультиплатформенной разработки
- Веб-разработки

Пример кода:
fun main() {
    println("Привет, мир!")
    
    val name = "Студент"
    println("Привет, $name!")
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 11,
      title: 'Go Программирование',
      description: 'Изучите Go - простой и эффективный язык от Google',
      icon: 'logo-google',
      color: ['#00add8', '#007d9c'],
      lessons: 15,
      difficulty: 'Средний',
      progress: 0,
      category: 'Системное программирование',
      estimatedTime: '4 недели',
      chapters: [
        {
          id: 1,
          title: 'Основы Go',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Go',
              description: 'Знакомство с языком программирования Go',
              content: `Go (Golang) - это язык программирования от Google.

Особенности Go:
• Простота и читаемость
• Быстрая компиляция
• Встроенная поддержка конкурентности
• Сборщик мусора
• Статическая типизация

Go используется для:
- Микросервисов
- Облачных приложений
- DevOps инструментов
- Сетевых приложений

Пример кода:
package main

import "fmt"

func main() {
    fmt.Println("Привет, мир!")
    
    name := "Студент"
    fmt.Printf("Привет, %s!\\n", name)
}`,
              duration: 18,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 12,
      title: 'Rust Программирование',
      description: 'Изучите Rust - безопасный системный язык программирования',
      icon: 'hardware-chip',
      color: ['#ce422b', '#a33319'],
      lessons: 21,
      difficulty: 'Продвинутый',
      progress: 0,
      category: 'Системное программирование',
      estimatedTime: '7 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Rust',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Rust',
              description: 'Знакомство с языком программирования Rust',
              content: `Rust - это системный язык программирования, фокусирующийся на безопасности.

Особенности Rust:
• Безопасность памяти без сборщика мусора
• Система владения (ownership)
• Высокая производительность
• Конкурентность без гонок данных
• Кроссплатформенность

Rust используется для:
- Системного программирования
- Веб-серверов
- Блокчейн проектов
- Игровых движков

Пример кода:
fn main() {
    println!("Привет, мир!");
    
    let name = "Студент";
    println!("Привет, {}!", name);
}`,
              duration: 25,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 13,
      title: 'Python для начинающих',
      description: 'Изучите Python - простой и мощный язык программирования',
      icon: 'logo-python',
      color: ['#3776ab', '#4b8bbe'],
      lessons: 20,
      difficulty: 'Начинающий',
      progress: 0,
      category: 'Программирование',
      estimatedTime: '5 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Python',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Python',
              description: 'Знакомство с языком Python и его возможностями',
              content: `Python - это высокоуровневый язык программирования общего назначения.

Преимущества Python:
• Простой и читаемый синтаксис
• Большая стандартная библиотека
• Кроссплатформенность
• Активное сообщество

Python используется в:
- Веб-разработке
- Анализе данных
- Машинном обучении
- Автоматизации
- Научных вычислениях

Первая программа:
print("Привет, мир!")

name = "Студент"
print(f"Привет, {name}!")`,
              duration: 15,
              completed: false,
              type: 'theory'
            },
            {
              id: 2,
              title: 'Переменные и типы данных',
              description: 'Работа с переменными и основными типами данных в Python',
              content: `В Python переменные создаются простым присваиванием:

Основные типы данных:
• int - целые числа
• float - числа с плавающей точкой
• str - строки
• bool - логический тип
• list - списки
• dict - словари
• tuple - кортежи

Примеры:
age = 25
height = 175.5
name = "Анна"
is_student = True
grades = [5, 4, 5, 3, 4]
person = {"name": "Иван", "age": 30}

Python автоматически определяет тип переменной.`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 14,
      title: 'React разработка',
      description: 'Создавайте современные веб-приложения с React',
      icon: 'logo-react',
      color: ['#61dafb', '#21232a'],
      lessons: 18,
      difficulty: 'Средний',
      progress: 0,
      category: 'Веб-разработка',
      estimatedTime: '4 недели',
      chapters: [
        {
          id: 1,
          title: 'Основы React',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Что такое React?',
              description: 'Введение в библиотеку React для создания пользовательских интерфейсов',
              content: `React - это JavaScript библиотека для создания пользовательских интерфейсов.

Ключевые концепции React:
• Компоненты - переиспользуемые части UI
• JSX - синтаксис для описания UI
• Virtual DOM - виртуальное представление DOM
• State - состояние компонента
• Props - свойства компонента

Преимущества React:
- Компонентный подход
- Высокая производительность
- Большая экосистема
- Активное сообщество

Простой компонент:
function Welcome(props) {
  return <h1>Привет, {props.name}!</h1>;
}`,
              duration: 20,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 15,
      title: 'Java программирование',
      description: 'Изучите объектно-ориентированное программирование на Java',
      icon: 'cafe-outline',
      color: ['#ed8b00', '#5382a1'],
      lessons: 22,
      difficulty: 'Средний',
      progress: 0,
      category: 'Программирование',
      estimatedTime: '7 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы Java',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в Java',
              description: 'Знакомство с языком программирования Java',
              content: `Java - это объектно-ориентированный язык программирования.

Особенности Java:
• Платформонезависимость (Write Once, Run Anywhere)
• Автоматическое управление памятью
• Строгая типизация
• Многопоточность
• Безопасность

Java используется для:
- Корпоративных приложений
- Android разработки
- Веб-приложений
- Больших данных

Первая программа:
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Привет, мир!");
    }
}`,
              duration: 18,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    },
    {
      id: 16,
      title: 'Мобильная разработка',
      description: 'Создавайте мобильные приложения с React Native',
      icon: 'phone-portrait-outline',
      color: ['#61dafb', '#0066cc'],
      lessons: 16,
      difficulty: 'Продвинутый',
      progress: 0,
      category: 'Мобильная разработка',
      estimatedTime: '6 недель',
      chapters: [
        {
          id: 1,
          title: 'Основы React Native',
          completed: false,
          lessons: [
            {
              id: 1,
              title: 'Введение в React Native',
              description: 'Создание кроссплатформенных мобильных приложений',
              content: `React Native позволяет создавать мобильные приложения используя React.

Преимущества React Native:
• Один код для iOS и Android
• Использование JavaScript и React
• Нативная производительность
• Горячая перезагрузка
• Большое сообщество

Основные компоненты:
- View - контейнер
- Text - текст
- ScrollView - прокручиваемый контейнер
- TouchableOpacity - кнопка
- Image - изображение

Пример компонента:
import React from 'react';
import { View, Text } from 'react-native';

const App = () => {
  return (
    <View>
      <Text>Привет, React Native!</Text>
    </View>
  );
};`,
              duration: 25,
              completed: false,
              type: 'theory'
            }
          ]
        }
      ]
    }
  ];

  // Функция для подсчета общего количества уроков в курсе
  const calculateTotalLessons = (course: Course): number => {
    return course.chapters.reduce((total, chapter) => 
      total + chapter.lessons.length, 0
    );
  };

  // Используем coursesData вместо courses для отображения
  const displayCourses = coursesData.length > 0 ? coursesData : courses;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Начинающий':
        return '#10b981';
      case 'Средний':
        return '#f59e0b';
      case 'Продвинутый':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const closeCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const startLesson = (lesson: Lesson) => {
    if (lesson.type === 'test') {
      // Получаем тест для текущего курса
      let courseName = selectedCourse?.title || 'JavaScript';
      
      // Нормализуем название курса для поиска теста
      if (courseName.includes('JavaScript')) courseName = 'JavaScript';
      else if (courseName.includes('Python')) courseName = 'Python';
      else if (courseName.includes('React') && !courseName.includes('Native')) courseName = 'React';
      else if (courseName.includes('Java') && !courseName.includes('Script')) courseName = 'Java';
      else if (courseName.includes('Мобильная') || courseName.includes('React Native')) courseName = 'React Native';
      else if (courseName.includes('C++')) courseName = 'C++';
      else if (courseName.includes('C#')) courseName = 'C#';
      else if (courseName.includes('PHP')) courseName = 'PHP';
      else if (courseName.includes('Swift')) courseName = 'Swift';
      else if (courseName.includes('Kotlin')) courseName = 'Kotlin';
      else if (courseName.includes('Go')) courseName = 'Go';
      else if (courseName.includes('Rust')) courseName = 'Rust';
      
      const quiz = getQuizByLanguage(courseName);
      
      // Переходим к тесту
      navigation.navigate('QuizDetail', {
        quiz: quiz,
        lesson: lesson,
        course: selectedCourse
      });
      setShowCourseModal(false);
    } else {
      // Открываем урок
      setCurrentLesson(lesson);
      setLessonProgress(0);
      setIsLessonCompleted(false);
      setShowLessonModal(true);
      
      // Симуляция прогресса урока
      const progressInterval = setInterval(() => {
        setLessonProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsLessonCompleted(true);
            return 100;
          }
          return prev + 5; // Увеличиваем скорость прогресса
        });
      }, 200); // Уменьшаем интервал для быстрого прогресса
    }
  };

  const completeLesson = async () => {
    console.log('completeLesson вызвана');
    console.log('currentLesson:', currentLesson?.title);
    console.log('selectedCourse:', selectedCourse?.title);
    console.log('isLessonCompleted:', isLessonCompleted);
    
    if (!isLessonCompleted) {
      Alert.alert(
        'Внимание',
        'Сначала завершите чтение урока',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!currentLesson) {
      Alert.alert('Ошибка', 'Данные урока не найдены');
      return;
    }

    try {
      console.log('Сохраняем прогресс урока...');
      await saveLessonProgress(
        1, // userId
        currentLesson.id,
        selectedCourse?.title || 'Неизвестный курс',
        currentLesson.title,
        currentLesson.duration * 60, // время в секундах
        100 // score
      );
      
      // Помечаем урок как завершенный в локальном состоянии
      if (selectedCourse) {
        // Обновляем selectedCourse
        const updatedSelectedCourse = { ...selectedCourse };
        updatedSelectedCourse.chapters.forEach(chapter => {
          chapter.lessons.forEach(lesson => {
            if (lesson.id === currentLesson.id) {
              lesson.completed = true;
            }
          });
        });
        setSelectedCourse(updatedSelectedCourse);
        
        // Обновляем основной список курсов
        const updatedCoursesData = coursesData.map(course => {
          if (course.id === selectedCourse.id) {
            const updatedCourse = { ...course };
            updatedCourse.chapters.forEach(chapter => {
              chapter.lessons.forEach(lesson => {
                if (lesson.id === currentLesson.id) {
                  lesson.completed = true;
                }
              });
            });
            
            // Пересчитываем прогресс курса
            const totalLessons = updatedCourse.chapters.reduce((total, chapter) => 
              total + chapter.lessons.length, 0
            );
            const completedLessons = updatedCourse.chapters.reduce((total, chapter) => 
              total + chapter.lessons.filter(lesson => lesson.completed).length, 0
            );
            updatedCourse.progress = Math.round((completedLessons / totalLessons) * 100);
            
            return updatedCourse;
          }
          return course;
        });
        setCoursesData(updatedCoursesData);
      }
      
      console.log('Прогресс сохранен успешно');
      Alert.alert(
        'Урок завершен! ✅',
        `Вы успешно завершили урок "${currentLesson.title}"\n\nУрок добавлен в вашу статистику.`,
        [
          {
            text: 'Продолжить',
            onPress: () => {
              console.log('Закрываем модальное окно урока');
              setShowLessonModal(false);
              setCurrentLesson(null);
              setLessonProgress(0);
              setIsLessonCompleted(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить прогресс урока. Попробуйте еще раз.');
    }
  };

  const closeLessonModal = () => {
    setShowLessonModal(false);
    setCurrentLesson(null);
    setLessonProgress(0);
    setIsLessonCompleted(false);
  };

  const renderCourseCard = (course: Course, index: number) => {
    return (
      <Animated.View
        key={course.id}
        style={[
          styles.courseCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => openCourse(course)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={course.color}
            style={styles.courseGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.courseHeader}>
              <View style={styles.courseIconContainer}>
                <Ionicons name={course.icon as any} size={32} color="white" />
                </View>
              <View style={styles.courseDifficulty}>
                <Text style={styles.difficultyText}>{course.difficulty}</Text>
                </View>
              </View>
              
            <View style={styles.courseContent}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseDescription}>{course.description}</Text>
              
              <View style={styles.courseStats}>
                <View style={styles.statItem}>
                  <Ionicons name="book-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{calculateTotalLessons(course)} уроков</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{course.estimatedTime}</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
        style={[
                      styles.progressFill, 
                      { width: `${course.progress}%` }
                    ]} 
                  />
              </View>
                <Text style={styles.progressText}>{course.progress}%</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderCourseModal = () => {
    if (!selectedCourse) return null;

    return (
      <Modal
        visible={showCourseModal}
        transparent
        animationType="slide"
        onRequestClose={closeCourseModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={closeCourseModal}
            activeOpacity={1} 
          />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedCourse.title}</Text>
              <TouchableOpacity onPress={closeCourseModal}>
                <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
                </View>
                
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedCourse.chapters.map((chapter) => (
                <View key={chapter.id} style={styles.chapterContainer}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  
                  {chapter.lessons.map((lesson) => (
                    <TouchableOpacity
                      key={lesson.id}
                      style={styles.lessonItem}
                      onPress={() => {
                        if (lesson.type === 'test') {
                          closeCourseModal();
                          navigation.navigate('QuizDetail', { 
                            lesson, 
                            course: selectedCourse 
                          });
                        } else {
                          startLesson(lesson);
                        }
                      }}
                    >
                      <View style={styles.lessonIcon}>
                        <Ionicons 
                          name={
                            lesson.type === 'test' ? 'help-circle' :
                            lesson.type === 'practice' ? 'code' : 'book'
                          } 
                          size={20} 
                          color="#6366f1" 
                        />
                  </View>
                      
                      <View style={styles.lessonContent}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <Text style={styles.lessonDescription}>{lesson.description}</Text>
                        <View style={styles.lessonMeta}>
                          <Text style={styles.lessonDuration}>{lesson.duration} мин</Text>
                          <Text style={styles.lessonType}>
                            {lesson.type === 'test' ? 'Тест' : 
                             lesson.type === 'practice' ? 'Практика' : 'Теория'}
                          </Text>
                  </View>
                  </View>
                      
                      <View style={styles.lessonStatus}>
                        {lesson.completed ? (
                          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                        ) : (
                          <Ionicons name="play-circle" size={24} color="#6366f1" />
                        )}
              </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
         );
   };

  const renderLessonModal = () => {
    if (!currentLesson) return null;

     return (
      <Modal
        visible={showLessonModal}
        animationType="slide"
        onRequestClose={closeLessonModal}
      >
        <SafeAreaView style={styles.lessonModalContainer}>
          <View style={styles.lessonHeader}>
            <TouchableOpacity onPress={closeLessonModal}>
              <Ionicons name="close" size={24} color="#6b7280" />
                 </TouchableOpacity>
            <Text style={styles.lessonHeaderTitle}>{currentLesson.title}</Text>
            <View style={{ width: 24 }} />
                   </View>
          
          <View style={styles.lessonProgressContainer}>
            <View style={styles.lessonProgressBar}>
              <View 
                       style={[
                  styles.lessonProgressFill, 
                  { width: `${lessonProgress}%` }
                ]} 
              />
               </View>
            <Text style={styles.lessonProgressText}>{lessonProgress}%</Text>
          </View>

          <ScrollView style={styles.lessonContentContainer}>
            <Text style={styles.lessonContentText}>{currentLesson.content}</Text>
            
            {!isLessonCompleted && lessonProgress < 100 && (
              <View style={styles.readingHint}>
                <Ionicons name="information-circle" size={20} color="#6366f1" />
                <Text style={styles.readingHintText}>
                  Читайте материал, прогресс обновляется автоматически
                </Text>
            </View>
            )}
            
            {!isLessonCompleted && lessonProgress > 50 && (
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  console.log('Нажата кнопка "Завершить чтение"');
                  console.log('Текущий прогресс:', lessonProgress);
                  setLessonProgress(100);
                  setIsLessonCompleted(true);
                  console.log('Урок помечен как завершенный');
                }}
              >
                <Ionicons name="play-forward" size={16} color="#6366f1" />
                <Text style={styles.skipButtonText}>Завершить чтение</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          
          <View style={styles.lessonFooter}>
            {isLessonCompleted ? (
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={() => {
                  console.log('Нажата кнопка "Завершить урок"');
                  completeLesson();
                }}
              >
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text style={styles.completeButtonText}>Завершить урок</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.progressInfo}>
                <Text style={styles.progressInfoText}>
                  Прогресс чтения: {lessonProgress}%
                </Text>
                <Text style={styles.progressSubtext}>
                  {lessonProgress < 50 
                    ? 'Продолжайте читать...' 
                    : 'Нажмите "Завершить чтение" выше'
                  }
                </Text>
                {lessonProgress >= 100 && !isLessonCompleted && (
                  <Text style={[styles.progressSubtext, { color: '#ef4444' }]}>
                    Ошибка: прогресс 100%, но урок не завершен
                  </Text>
                )}
            </View>
          )}
        </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Уроки программирования</Text>
        <Text style={styles.headerSubtitle}>Выберите курс для изучения</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.coursesContainer}>
          {displayCourses.map((course, index) => renderCourseCard(course, index))}
    </View>
      </ScrollView>
      
      {renderCourseModal()}
      {renderLessonModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
  },
  coursesContainer: {
    padding: 20,
    gap: 16,
  },
  courseCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  courseGradient: {
    padding: 20,
    minHeight: 200,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  courseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseDifficulty: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  courseContent: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  chapterContainer: {
    marginBottom: 24,
  },
  chapterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 8,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  lessonDuration: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  lessonType: {
    fontSize: 12,
    color: '#64748b',
  },
  lessonStatus: {
    marginLeft: 12,
  },
  lessonModalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  lessonHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  lessonProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  lessonProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
  },
  lessonProgressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  lessonProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  lessonContentContainer: {
    flex: 1,
    padding: 20,
  },
  lessonContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  lessonFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  completeButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  progressInfoText: {
    fontSize: 16,
    color: '#64748b',
  },
  readingHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  readingHintText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 6,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  progressSubtext: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default LessonsScreen; 