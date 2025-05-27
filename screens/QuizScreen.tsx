import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { saveQuizResult } from '../database/database';

const { width } = Dimensions.get('window');

const QuizScreen = () => {
  const navigation = useNavigation();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStartTime, setQuizStartTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Анимированные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;

  // Анимация появления карточек
  useEffect(() => {
    Animated.stagger(100, [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Анимация смены вопроса
  useEffect(() => {
    if (selectedQuiz && !showResult) {
      questionAnim.setValue(0);
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestion, selectedQuiz]);

  // Анимация результата
  useEffect(() => {
    if (showResult) {
      resultAnim.setValue(0);
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [showResult]);

  // Анимация пульсации таймера
  useEffect(() => {
    if (timeLeft <= 10 && selectedQuiz && !showResult) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(timerPulse, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(timerPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      timerPulse.setValue(1);
    }
  }, [timeLeft, selectedQuiz, showResult]);

  const quizzes = [
    {
      id: 1,
      title: 'JavaScript Основы',
      description: 'Проверьте знания основ JavaScript',
      questions: 5,
      difficulty: 'Начинающий',
      color: ['#f7df1e', '#f0d000'],
      icon: 'logo-javascript',
      questions_data: [
        {
          question: 'Какой из этих типов данных НЕ является примитивным в JavaScript?',
          options: ['string', 'number', 'object', 'boolean'],
          correct: 2
        },
        {
          question: 'Что вернет typeof null?',
          options: ['null', 'undefined', 'object', 'string'],
          correct: 2
        },
        {
          question: 'Как объявить переменную в JavaScript?',
          options: ['variable x', 'var x', 'v x', 'declare x'],
          correct: 1
        },
        {
          question: 'Что такое замыкание (closure)?',
          options: ['Способ закрыть файл', 'Функция внутри функции', 'Тип данных', 'Оператор'],
          correct: 1
        },
        {
          question: 'Какой метод используется для добавления элемента в конец массива?',
          options: ['add()', 'append()', 'push()', 'insert()'],
          correct: 2
        }
      ]
    },
    {
      id: 2,
      title: 'Python Синтаксис',
      description: 'Тест на знание синтаксиса Python',
      questions: 4,
      difficulty: 'Начинающий',
      color: ['#3776ab', '#4b8bbe'],
      icon: 'logo-python',
      questions_data: [
        {
          question: 'Какой символ используется для комментариев в Python?',
          options: ['//', '/* */', '#', '<!-- -->'],
          correct: 2
        },
        {
          question: 'Как создать список в Python?',
          options: ['list = []', 'list = {}', 'list = ()', 'list = ""'],
          correct: 0
        },
        {
          question: 'Что выведет print(3 ** 2)?',
          options: ['6', '9', '5', '8'],
          correct: 1
        },
        {
          question: 'Какой метод используется для получения длины списка?',
          options: ['size()', 'length()', 'len()', 'count()'],
          correct: 2
        }
      ]
    },
    {
      id: 3,
      title: 'React Компоненты',
      description: 'Проверьте знания React компонентов',
      questions: 4,
      difficulty: 'Средний',
      color: ['#61dafb', '#21232a'],
      icon: 'logo-react',
      questions_data: [
        {
          question: 'Что такое JSX?',
          options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Execution'],
          correct: 0
        },
        {
          question: 'Какой хук используется для управления состоянием?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correct: 1
        },
        {
          question: 'Как передать данные от родительского к дочернему компоненту?',
          options: ['Через state', 'Через props', 'Через context', 'Через refs'],
          correct: 1
        },
        {
          question: 'Что возвращает компонент React?',
          options: ['Строку', 'Объект', 'JSX элемент', 'Функцию'],
          correct: 2
        }
      ]
    },
    {
      id: 4,
      title: 'Java ООП',
      description: 'Объектно-ориентированное программирование в Java',
      questions: 5,
      difficulty: 'Средний',
      color: ['#ed8b00', '#5382a1'],
      icon: 'cafe-outline',
      questions_data: [
        {
          question: 'Что такое инкапсуляция?',
          options: ['Наследование классов', 'Сокрытие данных', 'Полиморфизм', 'Абстракция'],
          correct: 1
        },
        {
          question: 'Какой модификатор доступа самый строгий?',
          options: ['public', 'protected', 'private', 'default'],
          correct: 2
        },
        {
          question: 'Что такое конструктор?',
          options: ['Метод для создания объектов', 'Тип данных', 'Переменная', 'Интерфейс'],
          correct: 0
        },
        {
          question: 'Можно ли наследовать от нескольких классов в Java?',
          options: ['Да, всегда', 'Нет, никогда', 'Только с интерфейсами', 'Только абстрактные классы'],
          correct: 1
        },
        {
          question: 'Что означает ключевое слово static?',
          options: ['Переменная не может изменяться', 'Принадлежит классу, а не объекту', 'Приватная переменная', 'Публичная переменная'],
          correct: 1
        }
      ]
    },
    {
      id: 5,
      title: 'C++ Основы',
      description: 'Базовые концепции C++',
      questions: 4,
      difficulty: 'Сложный',
      color: ['#00599c', '#004482'],
      icon: 'terminal-outline',
      questions_data: [
        {
          question: 'Что такое указатель?',
          options: ['Тип данных', 'Переменная, хранящая адрес', 'Функция', 'Класс'],
          correct: 1
        },
        {
          question: 'Какой оператор используется для выделения памяти?',
          options: ['malloc', 'new', 'alloc', 'create'],
          correct: 1
        },
        {
          question: 'Что означает const?',
          options: ['Переменная может изменяться', 'Переменная не может изменяться', 'Публичная переменная', 'Приватная переменная'],
          correct: 1
        },
        {
          question: 'Какой заголовочный файл нужен для cout?',
          options: ['<stdio.h>', '<iostream>', '<conio.h>', '<string>'],
          correct: 1
        }
      ]
    },
    {
      id: 6,
      title: 'Swift для iOS',
      description: 'Разработка приложений для iOS',
      questions: 4,
      difficulty: 'Средний',
      color: ['#fa7343', '#ff8c00'],
      icon: 'logo-apple',
      questions_data: [
        {
          question: 'Что такое Optional в Swift?',
          options: ['Тип данных', 'Значение может быть nil', 'Функция', 'Класс'],
          correct: 1
        },
        {
          question: 'Как объявить константу в Swift?',
          options: ['var', 'let', 'const', 'final'],
          correct: 1
        },
        {
          question: 'Что такое ARC?',
          options: ['Автоматический подсчет ссылок', 'Тип данных', 'Фреймворк', 'Библиотека'],
          correct: 0
        },
        {
          question: 'Какой символ используется для безопасного извлечения Optional?',
          options: ['!', '?', '&', '*'],
          correct: 1
        }
      ]
    },
    {
      id: 7,
      title: 'Алгоритмы и структуры данных',
      description: 'Основы алгоритмов и структур данных',
      questions: 5,
      difficulty: 'Сложный',
      color: ['#8b5cf6', '#7c3aed'],
      icon: 'git-branch-outline',
      questions_data: [
        {
          question: 'Какая временная сложность у бинарного поиска?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct: 1
        },
        {
          question: 'Что такое стек?',
          options: ['FIFO структура', 'LIFO структура', 'Дерево', 'Граф'],
          correct: 1
        },
        {
          question: 'Какая сложность сортировки пузырьком в худшем случае?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
          correct: 2
        },
        {
          question: 'Что такое хеш-таблица?',
          options: ['Массив', 'Связанный список', 'Структура данных для быстрого поиска', 'Дерево'],
          correct: 2
        },
        {
          question: 'Какой алгоритм сортировки самый быстрый в среднем случае?',
          options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
          correct: 1
        }
      ]
    },
    {
      id: 8,
      title: 'TypeScript',
      description: 'JavaScript с типизацией',
      questions: 4,
      difficulty: 'Средний',
      color: ['#3178c6', '#235a97'],
      icon: 'code-outline',
      questions_data: [
        {
          question: 'Что такое TypeScript?',
          options: ['Новый язык программирования', 'Надстройка над JavaScript', 'Фреймворк', 'Библиотека'],
          correct: 1
        },
        {
          question: 'Как объявить тип переменной?',
          options: ['let x: number', 'let x as number', 'let number x', 'number let x'],
          correct: 0
        },
        {
          question: 'Что такое interface?',
          options: ['Класс', 'Функция', 'Контракт для объектов', 'Переменная'],
          correct: 2
        },
        {
          question: 'Какой файл конфигурации используется для TypeScript?',
          options: ['package.json', 'tsconfig.json', 'config.ts', 'typescript.json'],
          correct: 1
        }
      ]
    },
    {
      id: 7,
      title: 'Алгоритмы и структуры данных',
      description: 'Основы алгоритмов и структур данных',
      questions: 5,
      difficulty: 'Сложный',
      color: ['#8b5cf6', '#7c3aed'],
      icon: 'git-branch-outline',
      questions_data: [
        {
          question: 'Какая временная сложность у бинарного поиска?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct: 1
        },
        {
          question: 'Что такое стек?',
          options: ['FIFO структура', 'LIFO структура', 'Дерево', 'Граф'],
          correct: 1
        },
        {
          question: 'Какая сложность сортировки пузырьком в худшем случае?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
          correct: 2
        },
        {
          question: 'Что такое хеш-таблица?',
          options: ['Массив', 'Связанный список', 'Структура данных для быстрого поиска', 'Дерево'],
          correct: 2
        },
        {
          question: 'Какой алгоритм сортировки самый быстрый в среднем случае?',
          options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
          correct: 1
        }
      ]
    },
    {
      id: 8,
      title: 'TypeScript',
      description: 'JavaScript с типизацией',
      questions: 4,
      difficulty: 'Средний',
      color: ['#3178c6', '#235a97'],
      icon: 'code-outline',
      questions_data: [
        {
          question: 'Что такое TypeScript?',
          options: ['Новый язык программирования', 'Надстройка над JavaScript', 'Фреймворк', 'Библиотека'],
          correct: 1
        },
        {
          question: 'Как объявить тип переменной?',
          options: ['let x: number', 'let x as number', 'let number x', 'number let x'],
          correct: 0
        },
        {
          question: 'Что такое interface?',
          options: ['Класс', 'Функция', 'Контракт для объектов', 'Переменная'],
          correct: 2
        },
        {
          question: 'Какой файл конфигурации используется для TypeScript?',
          options: ['package.json', 'tsconfig.json', 'config.ts', 'typescript.json'],
          correct: 1
        }
      ]
    }
  ];

  // Создание анимации нажатия для карточки
  const createCardAnimation = () => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    
    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { scaleValue, animatePress };
  };

  // Анимация выбора ответа
  const createAnswerAnimation = () => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const flashValue = useRef(new Animated.Value(0)).current;
    
    const animateAnswer = (isCorrect: boolean) => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(flashValue, {
          toValue: isCorrect ? 1 : 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { scaleValue, flashValue, animateAnswer };
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const startQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setTimeLeft(30);
    setQuizStartTime(Date.now());
    setTotalTime(0);
    
    // Сброс анимации прогресса
    progressAnim.setValue(0);
  };

  // Эффект для таймера
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (selectedQuiz && !showResult && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Время вышло, автоматически отвечаем неправильно
            answerQuestion(-1);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedQuiz, showResult, timeLeft, currentQuestion]);

  const answerQuestion = (selectedAnswer: number) => {
    const quiz = selectedQuiz as any;
    const currentQ = quiz.questions_data[currentQuestion];
    
    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);
    
    let newScore = score;
    if (selectedAnswer === currentQ.correct) {
      newScore = score + 1;
      setScore(newScore);
    }

    // Анимация прогресса
    const newProgress = ((currentQuestion + 1) / quiz.questions_data.length);
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (currentQuestion + 1 < quiz.questions_data.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30); // Сбрасываем таймер для следующего вопроса
    } else {
      // Подсчитываем общее время
      const finalTime = Math.round((Date.now() - quizStartTime) / 1000);
      setTotalTime(finalTime);
      
      // Сохраняем результат в базу данных с временем
      saveQuizResult(1, quiz.id, quiz.title, newScore, quiz.questions_data.length, finalTime);
      setShowResult(true);
    }
  };

  const closeQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setTimeLeft(30);
    setTotalTime(0);
    progressAnim.setValue(0);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setUserAnswers([]);
    setTimeLeft(30);
    setQuizStartTime(Date.now());
    setTotalTime(0);
    progressAnim.setValue(0);
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 90) return { msg: 'Превосходно! 🎉', color: '#10b981' };
    if (percentage >= 70) return { msg: 'Отлично! 👏', color: '#3b82f6' };
    if (percentage >= 50) return { msg: 'Хорошо! 👍', color: '#f59e0b' };
    if (percentage >= 30) return { msg: 'Неплохо! 💪', color: '#f97316' };
    return { msg: 'Попробуйте еще раз! 📚', color: '#ef4444' };
  };

  // Компонент анимированной карточки викторины
  const AnimatedQuizCard = ({ quiz, index }: { quiz: any, index: number }) => {
    const { scaleValue, animatePress } = createCardAnimation();
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            },
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity
          style={styles.quizCard}
          onPress={() => {
            animatePress();
            setTimeout(() => startQuiz(quiz), 150);
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={quiz.color}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Animated.View style={[styles.iconContainer, {
                  transform: [{
                    rotate: scaleValue.interpolate({
                      inputRange: [0.98, 1],
                      outputRange: ['-5deg', '0deg'],
                    })
                  }]
                }]}>
                  <Ionicons name={quiz.icon as any} size={28} color="white" />
                </Animated.View>
                <View style={styles.cardInfo}>
                  <Text style={styles.quizTitle}>{quiz.title}</Text>
                  <Text style={styles.quizDescription}>{quiz.description}</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.quizStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="help-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>{quiz.questions} вопросов</Text>
                  </View>
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
                    <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
                  </View>
                </View>
                <Animated.View style={[styles.playButton, {
                  transform: [{
                    scale: scaleValue.interpolate({
                      inputRange: [0.98, 1],
                      outputRange: [0.9, 1],
                    })
                  }]
                }]}>
                  <Ionicons name="play" size={16} color="rgba(255,255,255,0.9)" />
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderQuizModal = () => {
    if (!selectedQuiz) return null;
    
    const quiz = selectedQuiz as any;
    
    if (showResult) {
      const percentage = Math.round((score / quiz.questions_data.length) * 100);
      const result = getResultMessage(percentage);
      
      return (
        <Modal visible={true} animationType="slide">
          <LinearGradient colors={quiz.color} style={styles.modalContainer}>
            <Animated.View style={[styles.resultContainer, {
              opacity: resultAnim,
              transform: [{
                scale: resultAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              }]
            }]}>
              <Animated.View style={{
                transform: [{
                  rotate: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                }]
              }}>
                <Ionicons name="trophy-outline" size={80} color="white" />
              </Animated.View>
              <Text style={styles.resultTitle}>Викторина завершена!</Text>
              <Text style={[styles.resultMessage, { color: result.color }]}>
                {result.msg}
              </Text>
              <Text style={styles.resultScore}>
                {score} из {quiz.questions_data.length} правильных ответов
              </Text>
              <Text style={styles.resultTime}>
                ⏱️ Время: {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
              </Text>
              <Animated.Text style={[styles.resultPercentage, {
                transform: [{
                  scale: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  })
                }]
              }]}>
                {percentage}%
              </Animated.Text>
              
              <Animated.View style={[styles.resultButtons, {
                opacity: resultAnim,
                transform: [{
                  translateY: resultAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }]
              }]}>
                <TouchableOpacity style={styles.actionButton} onPress={restartQuiz}>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Повторить</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.closeButton} onPress={closeQuiz}>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.closeButtonText}>Завершить</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.3)' }]} 
                  onPress={() => {
                    closeQuiz();
                    navigation.navigate('Profile' as never);
                  }}
                >
                  <Ionicons name="person" size={20} color="white" />
                  <Text style={styles.actionButtonText}>Профиль</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Modal>
      );
    }

    const currentQ = quiz.questions_data[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions_data.length) * 100;
    
    return (
      <Modal visible={true} animationType="slide">
        <LinearGradient colors={quiz.color} style={styles.modalContainer}>
          <View style={styles.quizHeader}>
            <TouchableOpacity onPress={closeQuiz} style={styles.backButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <View style={styles.headerRight}>
              <Animated.View style={[styles.timerContainer, { 
                backgroundColor: timeLeft <= 10 ? '#ef4444' : 'rgba(255,255,255,0.2)',
                transform: [{ scale: timerPulse }]
              }]}>
                <Ionicons name="time-outline" size={16} color="white" />
                <Text style={styles.timerText}>{timeLeft}s</Text>
              </Animated.View>
              <Text style={styles.questionCounter}>
                {currentQuestion + 1} / {quiz.questions_data.length}
              </Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[styles.progressFill, { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% завершено</Text>
          </View>

          <Animated.View style={[styles.questionContainer, {
            opacity: questionAnim,
            transform: [{
              translateY: questionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }]
          }]}>
            <Text style={styles.questionText}>{currentQ.question}</Text>
            
            <View style={styles.optionsContainer}>
              {currentQ.options.map((option: string, index: number) => {
                const { scaleValue, flashValue, animateAnswer } = createAnswerAnimation();
                
                return (
                  <Animated.View
                    key={index}
                    style={{
                      opacity: questionAnim,
                      transform: [
                        {
                          translateX: questionAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [index % 2 === 0 ? -50 : 50, 0],
                          })
                        },
                        { scale: scaleValue }
                      ],
                    }}
                  >
                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        animateAnswer(index === currentQ.correct);
                        setTimeout(() => answerQuestion(index), 300);
                      }}
                      activeOpacity={0.8}
                    >
                      <Animated.View style={[styles.optionContent, {
                        backgroundColor: flashValue.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: ['rgba(255,255,255,0.2)', 'rgba(239,68,68,0.3)', 'rgba(16,185,129,0.3)'],
                        })
                      }]}>
                        <View style={styles.optionNumber}>
                          <Text style={styles.optionNumberText}>{String.fromCharCode(65 + index)}</Text>
                        </View>
                        <Text style={styles.optionText}>{option}</Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        </LinearGradient>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim
          }]
        }}>
          <Text style={styles.title}>Викторины</Text>
          <Text style={styles.subtitle}>Проверьте свои знания</Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{quizzes.length} викторин доступно</Text>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {quizzes.map((quiz, index) => (
          <AnimatedQuizCard key={quiz.id} quiz={quiz} index={index} />
        ))}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderQuizModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statsText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  quizCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    padding: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quizStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionCounter: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  questionText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionNumberText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  resultTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  resultMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultScore: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultTime: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultPercentage: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
  },
  resultButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default QuizScreen; 