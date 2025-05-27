import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { saveLessonProgress } from '../database/database';

interface RouteParams {
  lesson: {
    id: number;
    title: string;
    description: string;
    content: string;
    difficulty: string;
    category: string;
    completed: boolean;
    duration?: number;
    type?: 'theory' | 'practice' | 'test';
  };
  course?: {
    title: string;
    color: string[];
  };
}

export default function LessonDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson, course } = route.params as RouteParams;
  
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson?.completed || false);
  const [isReading, setIsReading] = useState(false);
  
  const progressAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    // Анимация появления
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const startReading = () => {
    setIsReading(true);
    setProgress(0);
    
    // Симуляция прогресса чтения
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  const handleComplete = async () => {
    if (!isCompleted) {
      Alert.alert(
        'Внимание',
        'Сначала прочитайте весь урок до конца',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await saveLessonProgress(
        1, // userId
        lesson.id,
        course?.title || 'Курс',
        lesson.title,
        (lesson.duration || 15) * 60, // время в секундах
        100 // score
      );
      
      Alert.alert(
        'Урок завершен!',
        `Вы успешно завершили урок "${lesson.title}"`,
        [
          {
            text: 'Продолжить',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      Alert.alert('Ошибка', 'Не удалось сохранить прогресс урока');
    }
  };

  const getLessonTypeIcon = () => {
    switch (lesson?.type) {
      case 'test':
        return 'help-circle';
      case 'practice':
        return 'code';
      default:
        return 'book';
    }
  };

  const getLessonTypeText = () => {
    switch (lesson?.type) {
      case 'test':
        return 'Тест';
      case 'practice':
        return 'Практика';
      default:
        return 'Теория';
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Урок</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      {/* Progress Bar */}
      {isReading && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Lesson Header */}
        <Animated.View style={[styles.lessonHeader, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={course?.color || ['#6366f1', '#8b5cf6']}
            style={styles.lessonHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.lessonHeaderContent}>
              <View style={styles.lessonIconContainer}>
                <Ionicons 
                  name={getLessonTypeIcon() as any} 
                  size={32} 
                  color="white" 
                />
              </View>
              
              <View style={styles.lessonHeaderText}>
                <Text style={styles.lessonTitle}>{lesson?.title || 'Название урока'}</Text>
                <Text style={styles.lessonDescription}>
                  {lesson?.description || 'Описание урока'}
                </Text>
              </View>
            </View>
            
            <View style={styles.lessonMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{lesson?.duration || 15} мин</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="layers-outline" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{getLessonTypeText()}</Text>
              </View>
              <View style={[styles.metaItem, styles.difficultyBadge, { backgroundColor: getDifficultyColor(lesson?.difficulty || 'Средний') }]}>
                <Text style={styles.difficultyText}>{lesson?.difficulty || 'Средний'}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Lesson Content */}
        <Animated.View style={[styles.contentSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Содержание урока</Text>
            {!isReading && (
              <TouchableOpacity 
                style={styles.startReadingButton}
                onPress={startReading}
              >
                <Ionicons name="play" size={16} color="#6366f1" />
                <Text style={styles.startReadingText}>Начать чтение</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.lessonContentContainer}>
            <ScrollView 
              style={styles.lessonContentScroll}
              nestedScrollEnabled={true}
            >
              <Text style={styles.lessonContent}>
                {lesson?.content || 'Содержание урока будет загружено...'}
              </Text>
            </ScrollView>
          </View>
        </Animated.View>

        {/* Additional Info */}
        {lesson?.type === 'theory' && (
          <Animated.View style={[styles.tipsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>💡 Полезные советы</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>
                Внимательно изучите все примеры кода
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>
                Попробуйте повторить примеры самостоятельно
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.tipText}>
                Не торопитесь, важно понять каждую концепцию
              </Text>
            </View>
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            isCompleted ? styles.completedButton : styles.disabledButton
          ]}
          onPress={handleComplete}
          disabled={!isCompleted}
        >
          <Ionicons
            name={isCompleted ? "checkmark-circle" : "lock-closed"}
            size={20}
            color="white"
          />
          <Text style={styles.completeButtonText}>
            {isCompleted ? 'Завершить урок' : 'Сначала прочитайте урок'}
          </Text>
        </TouchableOpacity>
        
        {isCompleted && (
          <View style={styles.completionBadge}>
            <Ionicons name="trophy" size={16} color="#f59e0b" />
            <Text style={styles.completionText}>Урок пройден!</Text>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

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
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  content: {
    flex: 1,
  },
  lessonHeader: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  lessonHeaderGradient: {
    padding: 20,
  },
  lessonHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  lessonHeaderText: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
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
  contentSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  startReadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
  },
  startReadingText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  lessonContentContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 300,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  lessonContentScroll: {
    flex: 1,
  },
  lessonContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tipsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    alignSelf: 'center',
  },
  completionText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
}); 