import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, SafeAreaView, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { saveLessonProgress } from '../database/database';

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
      lessons: 24,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
                  <Text style={styles.statText}>{course.lessons} уроков</Text>
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