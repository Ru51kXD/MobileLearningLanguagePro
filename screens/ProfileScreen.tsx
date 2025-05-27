import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getUserStats, getUser } from '../database/database';

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        style={styles.header}
      >
        <Animated.View style={[styles.profileSection, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Animated.View style={[styles.avatarContainer, {
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1],
              })
            }]
          }]}>
            <LinearGradient
              colors={[userLevel.color, `${userLevel.color}CC`]}
              style={styles.avatarGradient}
            >
              <Ionicons name="person" size={40} color="white" />
            </LinearGradient>
          </Animated.View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Студент'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'student@programming.app'}</Text>
          </View>
          
          <Animated.View style={[styles.levelBadge, {
            backgroundColor: userLevel.color,
            transform: [{
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }]
          }]}>
            <Ionicons name={userLevel.icon as any} size={16} color="white" />
            <Text style={styles.levelText}>Уровень {userLevel.level} - {userLevel.title}</Text>
          </Animated.View>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsGrid}>
            <AnimatedStatCard
              icon="book-outline"
              value={stats.lessons_completed || 0}
              label="Завершено уроков"
              color="#10b981"
              index={0}
            />
            <AnimatedStatCard
              icon="help-circle-outline"
              value={stats.quizzes_completed || 0}
              label="Пройдено викторин"
              color="#3b82f6"
              index={1}
            />
            <AnimatedStatCard
              icon="time-outline"
              value={formatTime(stats.total_study_time || 0)}
              label="Время обучения"
              color="#8b5cf6"
              index={2}
            />
            <AnimatedStatCard
              icon="trophy-outline"
              value={`${stats.best_quiz_score || 0}%`}
              label="Лучший результат"
              color="#ef4444"
              index={3}
            />
            <AnimatedStatCard
              icon="star-outline"
              value={stats.perfect_scores || 0}
              label="Идеальные тесты"
              color="#f59e0b"
              index={4}
            />
            <AnimatedStatCard
              icon="code-outline"
              value={stats.languages_studied || 0}
              label="Изучено языков"
              color="#06b6d4"
              index={5}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Достижения</Text>
          <View style={styles.achievementsContainer}>
            {achievementsList.map((achievement, index) => (
              <AnimatedAchievement
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Настройки</Text>
          <View style={styles.menuContainer}>
            <AnimatedMenuItem
              icon="person-outline"
              title="Редактировать профиль"
              subtitle="Изменить имя и email"
              onPress={() => Alert.alert('👤 Профиль', 'Функция редактирования профиля будет доступна в следующей версии!')}
              index={0}
            />
            <AnimatedMenuItem
              icon="notifications-outline"
              title="Уведомления"
              subtitle="Настройки push-уведомлений"
              onPress={() => Alert.alert('🔔 Уведомления', 'Настройка уведомлений будет доступна в следующей версии!')}
              index={1}
            />
            <AnimatedMenuItem
              icon="shield-outline"
              title="Приватность"
              subtitle="Настройки конфиденциальности"
              onPress={() => Alert.alert('🔒 Приватность', 'Настройки приватности будут доступны в следующей версии!')}
              index={2}
            />
            <AnimatedMenuItem
              icon="help-circle-outline"
              title="Справка"
              subtitle="FAQ и поддержка"
              onPress={() => Alert.alert('❓ Справка', 'Раздел справки будет доступен в следующей версии!')}
              index={3}
            />
            <AnimatedMenuItem
              icon="information-circle-outline"
              title="О приложении"
              subtitle="Версия 1.0.0"
              onPress={() => Alert.alert('ℹ️ О приложении', 'Programming Learning App\nВерсия 1.0.0\n\nСоздано для изучения программирования')}
              index={4}
            />
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },

  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  achievementsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementTitleUnlocked: {
    color: '#10b981',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  achievementUnlocked: {
    borderColor: '#10b981',
    borderWidth: 1,
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