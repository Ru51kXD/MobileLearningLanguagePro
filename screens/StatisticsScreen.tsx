import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLessonProgress, getQuizResults } from '../database/database';

interface LessonProgress {
  id: number;
  lesson_id: number;
  course_name: string;
  lesson_name: string;
  time_spent: number;
  score: number;
  completed_at: string;
}

interface QuizResult {
  id: number;
  quiz_id: number;
  quiz_name: string;
  correct_answers: number;
  total_questions: number;
  time_spent: number;
  completed_at: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string[];
  subtitle?: string;
}

const StatisticsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useFocusEffect(
    React.useCallback(() => {
      loadStatistics();
    }, [])
  );

  const loadStatistics = async () => {
    try {
      const lessons = await getLessonProgress(1); // userId = 1
      const quizzes = await getQuizResults(1); // userId = 1
      setLessonProgress(lessons);
      setQuizResults(quizzes);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTotalTimeSpent = () => {
    const lessonTime = lessonProgress.reduce((total, lesson) => total + lesson.time_spent, 0);
    const quizTime = quizResults.reduce((total, quiz) => total + quiz.time_spent, 0);
    return lessonTime + quizTime;
  };

  const getAverageQuizScore = () => {
    if (quizResults.length === 0) return 0;
    const totalScore = quizResults.reduce((total, quiz) => 
      total + (quiz.correct_answers / quiz.total_questions) * 100, 0
    );
    return Math.round(totalScore / quizResults.length);
  };

  const getCompletedCourses = () => {
    const courses = [...new Set(lessonProgress.map(lesson => lesson.course_name))];
    return courses.length;
  };

  const statCards: StatCard[] = [
    {
      title: 'Уроки пройдено',
      value: lessonProgress.length.toString(),
      icon: 'book',
      color: ['#10b981', '#059669'],
      subtitle: 'всего уроков'
    },
    {
      title: 'Тесты пройдено',
      value: quizResults.length.toString(),
      icon: 'help-circle',
      color: ['#f59e0b', '#d97706'],
      subtitle: 'всего тестов'
    },
    {
      title: 'Время обучения',
      value: formatTime(getTotalTimeSpent()),
      icon: 'time',
      color: ['#8b5cf6', '#7c3aed'],
      subtitle: 'общее время'
    },
    {
      title: 'Средний балл',
      value: `${getAverageQuizScore()}%`,
      icon: 'star',
      color: ['#ef4444', '#dc2626'],
      subtitle: 'по тестам'
    },
    {
      title: 'Курсы изучены',
      value: getCompletedCourses().toString(),
      icon: 'library',
      color: ['#6366f1', '#4f46e5'],
      subtitle: 'разных курсов'
    },
    {
      title: 'Дней подряд',
      value: '3',
      icon: 'flame',
      color: ['#f97316', '#ea580c'],
      subtitle: 'текущая серия'
    }
  ];

  const renderStatCard = (stat: StatCard, index: number) => (
    <View key={index} style={styles.statCard}>
      <LinearGradient
        colors={stat.color}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statContent}>
          <View style={styles.statIcon}>
            <Ionicons name={stat.icon as any} size={24} color="white" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
            {stat.subtitle && (
              <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderLessonItem = (lesson: LessonProgress) => (
    <View key={lesson.id} style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons name="book" size={20} color="#10b981" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{lesson.lesson_name}</Text>
        <Text style={styles.activitySubtitle}>{lesson.course_name}</Text>
        <View style={styles.activityMeta}>
          <Text style={styles.activityTime}>{formatTime(lesson.time_spent)}</Text>
          <Text style={styles.activityDate}>{formatDate(lesson.completed_at)}</Text>
        </View>
      </View>
      <View style={styles.activityBadge}>
        <Text style={styles.activityScore}>{lesson.score}%</Text>
      </View>
    </View>
  );

  const renderQuizItem = (quiz: QuizResult) => (
    <View key={quiz.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: '#fef3c7' }]}>
        <Ionicons name="help-circle" size={20} color="#f59e0b" />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{quiz.quiz_name}</Text>
        <Text style={styles.activitySubtitle}>
          {quiz.correct_answers}/{quiz.total_questions} правильных ответов
        </Text>
        <View style={styles.activityMeta}>
          <Text style={styles.activityTime}>{formatTime(quiz.time_spent)}</Text>
          <Text style={styles.activityDate}>{formatDate(quiz.completed_at)}</Text>
        </View>
      </View>
      <View style={[
        styles.activityBadge,
        { backgroundColor: (quiz.correct_answers / quiz.total_questions) >= 0.8 ? '#10b981' : '#f59e0b' }
      ]}>
        <Text style={styles.activityScore}>
          {Math.round((quiz.correct_answers / quiz.total_questions) * 100)}%
        </Text>
      </View>
    </View>
  );

  const allActivities = [
    ...lessonProgress.map(lesson => ({ ...lesson, type: 'lesson' })),
    ...quizResults.map(quiz => ({ ...quiz, type: 'quiz' }))
  ].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Статистика</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="home" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
        {/* Статистические карточки */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => renderStatCard(stat, index))}
        </View>

        {/* Последняя активность */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Последняя активность</Text>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Загрузка...</Text>
            </View>
          ) : allActivities.length > 0 ? (
            <View style={styles.activityList}>
              {allActivities.slice(0, 10).map((activity: any) => 
                activity.type === 'lesson' 
                  ? renderLessonItem(activity)
                  : renderQuizItem(activity)
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Нет данных</Text>
              <Text style={styles.emptySubtitle}>
                Начните изучать уроки, чтобы увидеть статистику
              </Text>
            </View>
          )}
        </View>

        {/* Прогресс по курсам */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart" size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Прогресс по курсам</Text>
          </View>
          
          {getCompletedCourses() > 0 ? (
            <View style={styles.coursesList}>
              {[...new Set(lessonProgress.map(lesson => lesson.course_name))].map((courseName, index) => {
                const courseLessons = lessonProgress.filter(lesson => lesson.course_name === courseName);
                return (
                  <View key={index} style={styles.courseItem}>
                    <Text style={styles.courseName}>{courseName}</Text>
                    <Text style={styles.courseStats}>
                      {courseLessons.length} уроков • {formatTime(
                        courseLessons.reduce((total, lesson) => total + lesson.time_spent, 0)
                      )}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="school-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Курсы не начаты</Text>
              <Text style={styles.emptySubtitle}>
                Начните изучать курсы, чтобы увидеть прогресс
              </Text>
            </View>
          )}
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: 60,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  homeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    backgroundColor: 'white',
  },
  statGradient: {
    padding: 16,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  statSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  activityMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  activityDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  activityBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityScore: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
  },
  coursesList: {
    gap: 12,
  },
  courseItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  courseStats: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default StatisticsScreen; 