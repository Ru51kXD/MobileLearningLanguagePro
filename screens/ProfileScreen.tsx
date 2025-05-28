import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserStats, getUser, getLessonProgress, getQuizResults } from '../database/database';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  // Анимированные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const achievementsAnim = useRef(new Animated.Value(0)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;

  // Анимация появления
  useEffect(() => {
    if (!isLoading) {
      Animated.sequence([
        Animated.parallel([
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
        ]),
        Animated.timing(statsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(achievementsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(menuAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await getUser(1);
      const userStats = await getUserStats(1);
      
      setUser(userData);
      setStats(userStats);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    } else if (minutes > 0) {
      return `${minutes}м`;
    } else {
      return `${seconds}с`;
    }
  };

  const getLevel = (points: number) => {
    if (points >= 1000) return { level: 5, title: 'Эксперт', color: '#ef4444', icon: 'trophy' };
    if (points >= 500) return { level: 4, title: 'Продвинутый', color: '#8b5cf6', icon: 'star' };
    if (points >= 200) return { level: 3, title: 'Опытный', color: '#3b82f6', icon: 'thumbs-up' };
    if (points >= 50) return { level: 2, title: 'Начинающий+', color: '#10b981', icon: 'leaf' };
    return { level: 1, title: 'Новичок', color: '#f59e0b', icon: 'sparkles' };
  };

  const userLevel = getLevel(stats.total_points || 0);

  const achievementsList = [
    {
      id: 1,
      title: 'Первые шаги',
      description: 'Завершен первый урок',
      icon: 'footsteps-outline',
      color: '#10b981',
      unlocked: (stats.lessons_completed || 0) >= 1,
      progress: Math.min((stats.lessons_completed || 0), 1)
    },
    {
      id: 2,
      title: 'Знаток языков',
      description: 'Изучено 3 языка программирования',
      icon: 'library-outline',
      color: '#3b82f6',
      unlocked: (stats.languages_studied || 0) >= 3,
      progress: Math.min((stats.languages_studied || 0) / 3, 1)
    },
    {
      id: 3,
      title: 'Тестировщик',
      description: 'Пройдено 5 викторин',
      icon: 'checkmark-circle-outline',
      color: '#8b5cf6',
      unlocked: (stats.quizzes_completed || 0) >= 5,
      progress: Math.min((stats.quizzes_completed || 0) / 5, 1)
    },
    {
      id: 4,
      title: 'Перфекционист',
      description: 'Получено 3 идеальных результата',
      icon: 'diamond-outline',
      color: '#ef4444',
      unlocked: (stats.perfect_scores || 0) >= 3,
      progress: Math.min((stats.perfect_scores || 0) / 3, 1)
    },
    {
      id: 5,
      title: 'Постоянство',
      description: 'Streak 7 дней',
      icon: 'flame-outline',
      color: '#f59e0b',
      unlocked: (stats.longest_streak || 0) >= 7,
      progress: Math.min((stats.longest_streak || 0) / 7, 1)
    },
    {
      id: 6,
      title: 'Студент года',
      description: 'Изучение более 10 часов',
      icon: 'school-outline',
      color: '#06b6d4',
      unlocked: (stats.total_study_time || 0) >= 36000,
      progress: Math.min((stats.total_study_time || 0) / 36000, 1)
    }
  ];

  // Компонент анимированной статистики
  const AnimatedStatCard = ({ icon, value, label, color, index }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const countValue = useRef(new Animated.Value(0)).current;
    
    // Анимация счетчика
    useEffect(() => {
      if (!isLoading && value) {
        Animated.timing(countValue, {
          toValue: typeof value === 'number' ? value : 0,
          duration: 1000 + index * 200,
          useNativeDriver: false,
        }).start();
      }
    }, [isLoading, value]);

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
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

    return (
      <Animated.View
        style={{
          opacity: statsAnim,
          transform: [
            {
              translateY: statsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30 + index * 10, 0],
              })
            },
            {
              scale: statsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity 
          style={styles.statCard}
          onPress={animatePress}
          activeOpacity={0.8}
        >
          <View style={[styles.statIconContainer, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <View style={styles.statContent}>
            <Animated.Text style={styles.statValue}>
              {typeof value === 'number' ? 
                countValue.interpolate({
                  inputRange: [0, value],
                  outputRange: [0, value],
                  extrapolate: 'clamp',
                }) 
                : value}
            </Animated.Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Компонент анимированного достижения
  const AnimatedAchievement = ({ achievement, index }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const progressValue = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      if (!isLoading) {
        Animated.timing(progressValue, {
          toValue: achievement.progress,
          duration: 1000 + index * 100,
          useNativeDriver: false,
        }).start();
      }
    }, [isLoading, achievement.progress]);

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

    return (
      <Animated.View
        style={{
          opacity: achievementsAnim,
          transform: [
            {
              translateX: achievementsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [index % 2 === 0 ? -50 : 50, 0],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity 
          style={[styles.achievementCard, achievement.unlocked && styles.achievementUnlocked]}
          onPress={animatePress}
          activeOpacity={0.8}
        >
          <View style={[styles.achievementIcon, { backgroundColor: achievement.color }]}>
            <Ionicons 
              name={achievement.icon as any} 
              size={24} 
              color={achievement.unlocked ? "white" : "#9ca3af"} 
            />
          </View>
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, achievement.unlocked && styles.achievementTitleUnlocked]}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementDescription}>
              {achievement.description}
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: achievement.color,
                      width: progressValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(achievement.progress * 100)}%
              </Text>
            </View>
          </View>
          {achievement.unlocked && (
            <Animated.View style={{
              transform: [{
                scale: progressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }]
            }}>
              <Ionicons name="checkmark-circle" size={20} color={achievement.color} />
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Компонент анимированного пункта меню
  const AnimatedMenuItem = ({ icon, title, subtitle, onPress, index }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    
    const animatePress = () => {
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.95,
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

    return (
      <Animated.View
        style={{
          opacity: menuAnim,
          transform: [
            {
              translateX: menuAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            animatePress();
            setTimeout(onPress, 150);
          }}
          activeOpacity={0.8}
        >
          <View style={styles.menuIcon}>
            <Ionicons name={icon} size={20} color="#6366f1" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const lessons = await getLessonProgress(1);
      const quizzes = await getQuizResults(1);
      
      const totalTime = lessons.reduce((sum: number, lesson: any) => sum + lesson.time_spent, 0) +
                       quizzes.reduce((sum: number, quiz: any) => sum + quiz.time_spent, 0);
      
      const averageScore = quizzes.length > 0 
        ? Math.round(quizzes.reduce((sum: number, quiz: any) => 
            sum + (quiz.correct_answers / quiz.total_questions) * 100, 0) / quizzes.length)
        : 0;

      setStats({
        lessonsCompleted: lessons.length,
        testsCompleted: quizzes.length,
        totalTime,
        averageScore,
        currentStreak: 3,
        achievements: 1
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const menuItems = [
    {
      id: 'achievements',
      title: 'Достижения',
      subtitle: `${stats.achievements} получено`,
      icon: 'trophy',
      color: ['#f59e0b', '#d97706'],
      onPress: () => navigation.navigate('Achievements')
    },
    {
      id: 'statistics',
      title: 'Статистика',
      subtitle: 'Подробная статистика обучения',
      icon: 'bar-chart',
      color: ['#6366f1', '#4f46e5'],
      onPress: () => navigation.navigate('Statistics')
    },
    {
      id: 'settings',
      title: 'Настройки',
      subtitle: 'Уведомления и предпочтения',
      icon: 'settings',
      color: ['#8b5cf6', '#7c3aed'],
      onPress: () => navigation.navigate('Settings')
    },
    {
      id: 'help',
      title: 'Помощь',
      subtitle: 'FAQ и поддержка',
      icon: 'help-circle',
      color: ['#10b981', '#059669'],
      onPress: () => navigation.navigate('Help')
    }
  ];

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Animated.View style={{
          transform: [{
            rotate: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            })
          }]
        }}>
          <Ionicons name="refresh" size={40} color="#6366f1" />
        </Animated.View>
        <Text style={styles.loadingText}>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="white" />
            </View>
            <Text style={styles.name}>{user?.name || 'Студент'}</Text>
            <Text style={styles.email}>{user?.email || 'student@programming.app'}</Text>
          </View>
        </LinearGradient>

        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Уроков</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.testsCompleted}</Text>
            <Text style={styles.statLabel}>Тестов</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatTime(stats.totalTime)}</Text>
            <Text style={styles.statLabel}>Времени</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={item.color}
                style={styles.menuIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name={item.icon as any} size={24} color="white" />
              </LinearGradient>
              
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.additionalStats}>
          <Text style={styles.sectionTitle}>Дополнительная статистика</Text>
          
          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Ionicons name="flame" size={20} color="#f97316" />
              <Text style={styles.statCardTitle}>Текущая серия</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.currentStreak} дней</Text>
            <Text style={styles.statCardSubtitle}>Продолжайте в том же духе!</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardHeader}>
              <Ionicons name="star" size={20} color="#f59e0b" />
              <Text style={styles.statCardTitle}>Средний балл</Text>
            </View>
            <Text style={styles.statCardValue}>{stats.averageScore}%</Text>
            <Text style={styles.statCardSubtitle}>По всем тестам</Text>
          </View>
        </View>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Версия приложения: 1.0.0</Text>
          <TouchableOpacity onPress={() => Alert.alert('О приложении', 'Приложение для изучения программирования')}>
            <Text style={styles.aboutLink}>О приложении</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  menuContainer: {
    marginTop: 32,
    marginHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  additionalStats: {
    marginTop: 32,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  appInfo: {
    marginTop: 32,
    marginHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  aboutLink: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refreshText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default ProfileScreen; 