import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserStats, getUserAchievements, unlockAchievement } from '../database/database';

const { width, height } = Dimensions.get('window');

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string[];
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: 'learning' | 'streak' | 'quiz' | 'special';
  unlockedDate?: string;
  points: number;
}

const AchievementsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userStats, setUserStats] = useState<any>({});
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
  // Анимации
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
      
      // Последовательная анимация появления
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(headerAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(cardsAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const stats = await getUserStats(1); // userId = 1
      const unlockedList = await getUserAchievements(1);
      setUserStats(stats);
      setUnlockedAchievements(unlockedList);
      loadAchievements(stats, unlockedList);
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      loadAchievements({}, []);
    }
  };

  const loadAchievements = (stats: any = {}, unlockedList: string[] = []) => {
    const achievementsData: Achievement[] = [
      {
        id: 1,
        title: 'Первые шаги',
        description: 'Завершите свой первый урок',
        icon: 'footsteps',
        color: ['#10b981', '#059669'],
        unlocked: unlockedList.includes('first_lesson') || (stats.lessons_completed || 0) >= 1,
        progress: Math.min(stats.lessons_completed || 0, 1),
        maxProgress: 1,
        category: 'learning',
        unlockedDate: '15 янв 2024',
        points: 50
      },
      {
        id: 2,
        title: 'Знаток JavaScript',
        description: 'Завершите 10 уроков по JavaScript',
        icon: 'logo-javascript',
        color: ['#f7df1e', '#f0d000'],
        unlocked: unlockedList.includes('javascript_expert') || (stats.lessons_completed || 0) >= 10,
        progress: Math.min(stats.lessons_completed || 0, 10),
        maxProgress: 10,
        category: 'learning',
        points: 200
      },
      {
        id: 3,
        title: 'Мастер тестов',
        description: 'Пройдите 5 тестов с результатом 90%+',
        icon: 'trophy',
        color: ['#f59e0b', '#d97706'],
        unlocked: unlockedList.includes('quiz_master') || (stats.quizzes_completed || 0) >= 5,
        progress: Math.min(stats.quizzes_completed || 0, 5),
        maxProgress: 5,
        category: 'quiz',
        points: 300
      },
      {
        id: 4,
        title: 'Неделя обучения',
        description: 'Учитесь 7 дней подряд',
        icon: 'calendar',
        color: ['#8b5cf6', '#7c3aed'],
        unlocked: unlockedList.includes('week_streak') || (stats.longest_streak || 0) >= 7,
        progress: Math.min(stats.longest_streak || 0, 7),
        maxProgress: 7,
        category: 'streak',
        points: 150
      },
      {
        id: 5,
        title: 'Python энтузиаст',
        description: 'Завершите курс Python для начинающих',
        icon: 'logo-python',
        color: ['#3776ab', '#4b8bbe'],
        unlocked: unlockedList.includes('python_enthusiast'),
        progress: 0,
        maxProgress: 20,
        category: 'learning',
        points: 400
      },
      {
        id: 6,
        title: 'React разработчик',
        description: 'Завершите курс React разработки',
        icon: 'logo-react',
        color: ['#61dafb', '#21232a'],
        unlocked: unlockedList.includes('react_developer'),
        progress: 0,
        maxProgress: 18,
        category: 'learning',
        points: 350
      },
      {
        id: 7,
        title: 'Марафонец',
        description: 'Учитесь 30 дней подряд',
        icon: 'flame',
        color: ['#ef4444', '#dc2626'],
        unlocked: unlockedList.includes('marathon_runner') || (stats.longest_streak || 0) >= 30,
        progress: Math.min(stats.longest_streak || 0, 30),
        maxProgress: 30,
        category: 'streak',
        points: 500
      },
      {
        id: 8,
        title: 'Перфекционист',
        description: 'Получите 100% в 3 тестах подряд',
        icon: 'star',
        color: ['#fbbf24', '#f59e0b'],
        unlocked: unlockedList.includes('perfectionist') || (stats.perfect_scores || 0) >= 3,
        progress: Math.min(stats.perfect_scores || 0, 3),
        maxProgress: 3,
        category: 'quiz',
        points: 250
      },
      {
        id: 9,
        title: 'Полиглот',
        description: 'Изучите 3 языка программирования',
        icon: 'library',
        color: ['#6366f1', '#4f46e5'],
        unlocked: unlockedList.includes('polyglot') || (stats.languages_studied || 0) >= 3,
        progress: Math.min(stats.languages_studied || 0, 3),
        maxProgress: 3,
        category: 'special',
        points: 600
      },
      {
        id: 10,
        title: 'Легенда',
        description: 'Завершите все доступные курсы',
        icon: 'medal',
        color: ['#a855f7', '#9333ea'],
        unlocked: unlockedList.includes('legend') || (stats.languages_studied || 0) >= 5,
        progress: Math.min(stats.languages_studied || 0, 5),
        maxProgress: 5,
        category: 'special',
        points: 1000
      }
    ];
    
    // Проверяем и разблокируем новые достижения
    checkAndUnlockAchievements(achievementsData, stats, unlockedList);
    
    setAchievements(achievementsData);
  };

  const checkAndUnlockAchievements = async (achievementsData: Achievement[], stats: any, unlockedList: string[]) => {
    const achievementTypes = [
      { type: 'first_lesson', condition: (stats.lessons_completed || 0) >= 1, title: 'Первые шаги' },
      { type: 'javascript_expert', condition: (stats.lessons_completed || 0) >= 10, title: 'Знаток JavaScript' },
      { type: 'quiz_master', condition: (stats.quizzes_completed || 0) >= 5, title: 'Мастер тестов' },
      { type: 'week_streak', condition: (stats.longest_streak || 0) >= 7, title: 'Неделя обучения' },
      { type: 'marathon_runner', condition: (stats.longest_streak || 0) >= 30, title: 'Марафонец' },
      { type: 'perfectionist', condition: (stats.perfect_scores || 0) >= 3, title: 'Перфекционист' },
      { type: 'polyglot', condition: (stats.languages_studied || 0) >= 3, title: 'Полиглот' },
      { type: 'legend', condition: (stats.languages_studied || 0) >= 5, title: 'Легенда' },
    ];

    for (const achievement of achievementTypes) {
      if (achievement.condition && !unlockedList.includes(achievement.type)) {
        try {
          await unlockAchievement(1, achievement.type, achievement.title);
          console.log(`Достижение разблокировано: ${achievement.title}`);
        } catch (error) {
          console.error('Ошибка разблокировки достижения:', error);
        }
      }
    }
  };

  const categories = [
    { id: 'all', title: 'Все', icon: 'grid' },
    { id: 'learning', title: 'Обучение', icon: 'book' },
    { id: 'streak', title: 'Постоянство', icon: 'flame' },
    { id: 'quiz', title: 'Тесты', icon: 'help-circle' },
    { id: 'special', title: 'Особые', icon: 'star' },
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  const AnimatedAchievement = ({ achievement, index }: { achievement: Achievement, index: number }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      // Анимация прогресса
      Animated.timing(progressAnim, {
        toValue: achievement.progress / achievement.maxProgress,
        duration: 1000 + index * 100,
        useNativeDriver: false,
      }).start();

      // Анимация свечения для разблокированных достижений
      if (achievement.unlocked) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }, [achievement.progress, achievement.unlocked]);

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <Animated.View
        style={[
          styles.achievementWrapper,
          {
            opacity: cardsAnim,
            transform: [
              {
                translateY: cardsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.achievementCard,
            achievement.unlocked && styles.achievementUnlocked,
          ]}
          onPress={handlePress}
          activeOpacity={0.9}
        >
          {achievement.unlocked && (
            <Animated.View
              style={[
                styles.glowEffect,
                {
                  opacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 0.8],
                  }),
                },
              ]}
            />
          )}
          
          <LinearGradient
            colors={achievement.unlocked ? achievement.color : ['#f8fafc', '#f1f5f9']}
            style={styles.achievementGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.achievementContent}>
              {/* Иконка достижения */}
              <View style={[
                styles.achievementIconContainer,
                { backgroundColor: achievement.unlocked ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.05)' }
              ]}>
                <Ionicons
                  name={achievement.icon as any}
                  size={32}
                  color={achievement.unlocked ? 'white' : '#9ca3af'}
                />
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}
              </View>

              {/* Информация о достижении */}
              <View style={styles.achievementInfo}>
                <Text style={[
                  styles.achievementTitle,
                  { color: achievement.unlocked ? 'white' : '#374151' }
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  { color: achievement.unlocked ? 'rgba(255,255,255,0.9)' : '#6b7280' }
                ]}>
                  {achievement.description}
                </Text>

                {/* Прогресс или дата разблокировки */}
                {achievement.unlocked ? (
                  <View style={styles.unlockedInfo}>
                    <Ionicons name="calendar" size={12} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.unlockedDate}>{achievement.unlockedDate}</Text>
                    <View style={styles.pointsBadge}>
                      <Text style={styles.pointsText}>+{achievement.points}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            }),
                            backgroundColor: achievement.color[0],
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/{achievement.maxProgress} ({Math.round(progressPercentage)}%)
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <View style={[styles.safeArea, { paddingTop: insets.top }]}>
        {/* Заголовок */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </TouchableOpacity>
                  <Text style={styles.headerTitle}>Достижения</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#6366f1" />
        </TouchableOpacity>
        </Animated.View>

      {/* Статистика */}
      <Animated.View style={[styles.statsContainer, { opacity: headerAnim, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.statsGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color="white" />
              <Text style={styles.statNumber}>{unlockedCount}</Text>
              <Text style={styles.statLabel}>Получено</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="star" size={24} color="white" />
              <Text style={styles.statNumber}>{totalPoints}</Text>
              <Text style={styles.statLabel}>Очков</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={24} color="white" />
              <Text style={styles.statNumber}>{Math.round((unlockedCount / totalCount) * 100)}%</Text>
              <Text style={styles.statLabel}>Прогресс</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Фильтры категорий */}
      <Animated.View style={[styles.categoriesContainer, { opacity: headerAnim }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon as any}
                size={16}
                color={selectedCategory === category.id ? 'white' : '#6366f1'}
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive,
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

        {/* Список достижений */}
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <View style={styles.achievementsList}>
            {filteredAchievements.map((achievement, index) => (
              <AnimatedAchievement
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
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
  statsContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  statsGradient: {
    padding: width < 380 ? 20 : 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: width < 380 ? 24 : 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  statLabel: {
    fontSize: width < 380 ? 12 : 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  categoriesContainer: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  achievementsList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 16,
  },
  achievementWrapper: {
    position: 'relative',
  },
  achievementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  achievementUnlocked: {
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    zIndex: -1,
  },
  achievementGradient: {
    padding: width < 380 ? 16 : 20,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIconContainer: {
    width: width < 380 ? 56 : 64,
    height: width < 380 ? 56 : 64,
    borderRadius: width < 380 ? 28 : 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width < 380 ? 12 : 16,
    position: 'relative',
  },
  unlockedBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: width < 380 ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: width < 380 ? 13 : 14,
    marginBottom: 12,
    lineHeight: width < 380 ? 18 : 20,
  },
  unlockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unlockedDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  pointsBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  progressSection: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default AchievementsScreen; 