import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveQuizResult } from '../database/database';

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
}

interface RouteParams {
  quiz?: Quiz;
  lesson?: {
    id: number;
    title: string;
    type: string;
  };
  course?: {
    title: string;
    color: string[];
  };
}

const QuizScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams || {};
  const { quiz, lesson, course } = params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Создаем тестовые вопросы если их нет
  const defaultQuestions: Question[] = [
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
  ];

  const currentQuiz: Quiz = quiz || {
    id: lesson?.id || 1,
    title: lesson?.title || 'Тест по основам JavaScript',
    description: 'Проверьте свои знания основ JavaScript',
    questions: defaultQuestions,
    timeLimit: 300, // 5 минут
    difficulty: 'Начинающий'
  };

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz.questions.length;

  useEffect(() => {
      Animated.parallel([
      Animated.timing(fadeAnim, {
            toValue: 1,
        duration: 500,
            useNativeDriver: true,
          }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
  }, []);

  useEffect(() => {
    if (isQuizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isQuizStarted && timeLeft === 0) {
      finishQuiz();
    }
  }, [timeLeft, isQuizStarted]);

  useEffect(() => {
    // Анимация прогресса
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / totalQuestions,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setTimeLeft(currentQuiz.timeLimit || 300);
    setSelectedAnswers(new Array(totalQuestions).fill(-1));
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = async () => {
    // Подсчет результатов
    let correctAnswers = 0;
    currentQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Сохранение результатов в базу данных
    try {
      await saveQuizResult(
        1, // userId
        currentQuiz.id,
        currentQuiz.title,
        correctAnswers, // правильные ответы
        totalQuestions,
        (currentQuiz.timeLimit || 300) - timeLeft // время, потраченное на тест
      );
    } catch (error) {
      console.error('Ошибка сохранения результатов теста:', error);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(totalQuestions).fill(-1));
    setShowResults(false);
    setScore(0);
    setIsQuizStarted(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return 'Отлично! 🎉';
    if (score >= 80) return 'Хорошо! 👍';
    if (score >= 60) return 'Неплохо! 👌';
    return 'Нужно больше практики 📚';
  };

  if (!isQuizStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Тест</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContentWithButton}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.quizIntro, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient
              colors={course?.color || ['#6366f1', '#8b5cf6']}
              style={styles.introGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.introContent}>
                <View style={styles.quizIconContainer}>
                  <Ionicons name="help-circle" size={48} color="white" />
              </View>
              
                <Text style={styles.quizTitle}>{currentQuiz.title}</Text>
                <Text style={styles.quizDescription}>{currentQuiz.description}</Text>
                
                <View style={styles.quizStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="help-outline" size={20} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>{totalQuestions} вопросов</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>{formatTime(currentQuiz.timeLimit || 300)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="trending-up-outline" size={20} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.statText}>{currentQuiz.difficulty}</Text>
                </View>
                </View>
              </View>
            </LinearGradient>
                </Animated.View>

          <Animated.View style={[styles.instructions, { opacity: fadeAnim }]}>
            <Text style={styles.instructionsTitle}>📋 Инструкции</Text>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.instructionText}>
                Внимательно читайте каждый вопрос
              </Text>
              </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.instructionText}>
                Выберите один правильный ответ
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.instructionText}>
                Следите за временем
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.instructionText}>
                Можно вернуться к предыдущим вопросам
              </Text>
            </View>
          </Animated.View>

          <Animated.View style={[styles.footerInline, { opacity: fadeAnim }]}>
            <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.startButtonGradient}
              >
                <Ionicons name="play" size={20} color="white" />
                <Text style={styles.startButtonText}>Начать тест</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (showResults) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Результаты</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContentWithButton}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
            <LinearGradient
              colors={[getScoreColor(score), getScoreColor(score) + '80']}
              style={styles.resultsGradient}
            >
              <View style={styles.resultsContent}>
                <Text style={styles.resultsTitle}>{getScoreMessage(score)}</Text>
                <Text style={styles.scoreText}>{score}%</Text>
                <Text style={styles.scoreSubtext}>
                  {selectedAnswers.filter((answer, index) => answer === currentQuiz.questions[index].correctAnswer).length} из {totalQuestions} правильных ответов
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.detailedResults}>
            <Text style={styles.detailedTitle}>Подробные результаты</Text>
            {currentQuiz.questions.map((question, index) => {
              const isCorrect = selectedAnswers[index] === question.correctAnswer;
              const userAnswer = selectedAnswers[index];
      
      return (
                <View key={question.id} style={styles.questionResult}>
                  <View style={styles.questionHeader}>
                    <Text style={styles.questionNumber}>Вопрос {index + 1}</Text>
                    <Ionicons 
                      name={isCorrect ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={isCorrect ? "#10b981" : "#ef4444"} 
                    />
                  </View>
                  
                  <Text style={styles.questionText}>{question.question}</Text>
                  
                  <View style={styles.answersReview}>
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer = optionIndex === question.correctAnswer;
                      
                      return (
                        <View 
                          key={optionIndex}
                          style={[
                            styles.answerOption,
                            isCorrectAnswer && styles.correctAnswer,
                            isUserAnswer && !isCorrectAnswer && styles.wrongAnswer
                          ]}
                        >
                          <Text style={[
                            styles.answerText,
                            isCorrectAnswer && styles.correctAnswerText,
                            isUserAnswer && !isCorrectAnswer && styles.wrongAnswerText
                          ]}>
                            {option}
              </Text>
                          {isCorrectAnswer && (
                            <Ionicons name="checkmark" size={16} color="#10b981" />
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <Ionicons name="close" size={16} color="#ef4444" />
                          )}
                        </View>
                      );
                    })}
                  </View>
                  
                  {question.explanation && (
                    <View style={styles.explanation}>
                      <Text style={styles.explanationText}>{question.explanation}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <Animated.View style={[styles.footerInline, { opacity: fadeAnim }]}>
                  <TouchableOpacity style={styles.actionButton} onPress={restartQuiz}>
              <Ionicons name="refresh" size={20} color="#6366f1" />
              <Text style={styles.actionButtonText}>Пройти снова</Text>
                  </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={() => navigation.goBack()}
            >
                    <Ionicons name="checkmark" size={20} color="white" />
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Завершить</Text>
                  </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }
                
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                <TouchableOpacity 
          style={styles.backButton}
                  onPress={() => {
            Alert.alert(
              'Выйти из теста?',
              'Ваш прогресс будет потерян',
              [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Выйти', onPress: () => navigation.goBack() }
              ]
            );
          }}
        >
          <Ionicons name="close" size={24} color="#6366f1" />
                </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentQuestionIndex + 1} из {totalQuestions}
        </Text>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </Animated.View>

          <View style={styles.progressContainer}>
              <Animated.View 
          style={[
            styles.progressBar,
            {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                outputRange: ['0%', '100%']
                  })
            }
          ]} 
              />
          </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContentWithButton}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.questionTitle}>Вопрос {currentQuestionIndex + 1}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
            
            <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <TouchableOpacity
                    key={index}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestionIndex] === index && styles.selectedOption
                ]}
                onPress={() => selectAnswer(index)}
              >
                <View style={[
                  styles.optionIndicator,
                  selectedAnswers[currentQuestionIndex] === index && styles.selectedIndicator
                ]}>
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                        </View>
                <Text style={[
                  styles.optionText,
                  selectedAnswers[currentQuestionIndex] === index && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
                    </TouchableOpacity>
            ))}
            </View>
          </Animated.View>

        <Animated.View style={[styles.footerInline, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? "#9ca3af" : "#6366f1"} />
            <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledText]}>
              Назад
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.navButton, 
              styles.primaryButton,
              selectedAnswers[currentQuestionIndex] === -1 && styles.disabledButton
            ]}
            onPress={nextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            <Text style={[
              styles.navButtonText, 
              styles.primaryButtonText,
              selectedAnswers[currentQuestionIndex] === -1 && styles.disabledText
            ]}>
              {currentQuestionIndex === totalQuestions - 1 ? 'Завершить' : 'Далее'}
            </Text>
            <Ionicons 
              name={currentQuestionIndex === totalQuestions - 1 ? "checkmark" : "chevron-forward"} 
              size={20} 
              color={selectedAnswers[currentQuestionIndex] === -1 ? "#9ca3af" : "white"} 
            />
          </TouchableOpacity>
      </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 80, // Экстремально увеличиваем верхний отступ
    paddingBottom: 35, // Экстремально увеличиваем нижний отступ
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 40,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e5e7eb',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150, // Увеличиваем отступ снизу для кнопки
  },
  scrollContentWithButton: {
    paddingBottom: 30, // Уменьшаем отступ снизу для контента с кнопкой внутри
  },
  quizIntro: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  introGradient: {
    padding: 24,
  },
  introContent: {
    alignItems: 'center',
  },
  quizIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  quizStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  instructions: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 50, // Увеличиваем отступ для навигации
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    gap: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  footerInline: {
    padding: 20,
    paddingBottom: 10, // Уменьшаем отступ снизу
    backgroundColor: 'white',
    flexDirection: 'row',
    gap: 12,
  },
  startButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  questionContainer: {
    padding: 20,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  selectedOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f4ff',
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedOptionText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  primaryButtonText: {
    color: 'white',
  },
  disabledText: {
    color: '#9ca3af',
  },
  resultsContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resultsGradient: {
    padding: 32,
    alignItems: 'center',
  },
  resultsContent: {
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  detailedResults: {
    padding: 20,
  },
  detailedTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  questionResult: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  answersReview: {
    gap: 8,
    marginTop: 12,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  correctAnswer: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  wrongAnswer: {
    backgroundColor: '#fef2f2',
    borderColor: '#ef4444',
  },
  answerText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  correctAnswerText: {
    color: '#10b981',
    fontWeight: '600',
  },
  wrongAnswerText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  explanation: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  explanationText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6366f1',
    gap: 6,
    flex: 1,
  },
});

export default QuizScreen; 