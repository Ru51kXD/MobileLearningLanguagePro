import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { saveLessonProgress } from '../database/database';

const { width } = Dimensions.get('window');

const LessonsScreen = () => {
  console.log('=== LessonsScreen RENDERING ===');
  
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Все');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);

  // Анимированные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(300)).current;
  const resultModalAnim = useRef(new Animated.Value(0)).current;
  const resultSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Упрощенная анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardsAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const languages = [
    {
      id: 1,
      name: 'JavaScript',
      description: 'Язык веб-разработки',
      lessons: 25,
      difficulty: 'Начинающий',
      color: ['#f7df1e', '#f0d000'],
      icon: 'logo-javascript',
      category: 'Веб-разработка'
    },
    {
      id: 2,
      name: 'Python',
      description: 'Простой и мощный язык',
      lessons: 30,
      difficulty: 'Начинающий',
      color: ['#3776ab', '#4b8bbe'],
      icon: 'logo-python',
      category: 'Data Science'
    },
    {
      id: 3,
      name: 'React',
      description: 'Библиотека для UI',
      lessons: 20,
      difficulty: 'Средний',
      color: ['#61dafb', '#21232a'],
      icon: 'logo-react',
      category: 'Веб-разработка'
    },
    {
      id: 4,
      name: 'Java',
      description: 'Объектно-ориентированный язык',
      lessons: 35,
      difficulty: 'Средний',
      color: ['#ed8b00', '#5382a1'],
      icon: 'cafe-outline',
      category: 'Системное программирование'
    },
    {
      id: 5,
      name: 'C++',
      description: 'Системное программирование',
      lessons: 40,
      difficulty: 'Сложный',
      color: ['#00599c', '#004482'],
      icon: 'terminal-outline',
      category: 'Системное программирование'
    },
    {
      id: 6,
      name: 'Swift',
      description: 'Разработка для iOS',
      lessons: 22,
      difficulty: 'Средний',
      color: ['#fa7343', '#ff8c00'],
      icon: 'logo-apple',
      category: 'Мобильная разработка'
    },
    {
      id: 7,
      name: 'Kotlin',
      description: 'Современный язык для Android',
      lessons: 28,
      difficulty: 'Средний',
      color: ['#7f52ff', '#b936ee'],
      icon: 'logo-android',
      category: 'Мобильная разработка'
    },
    {
      id: 8,
      name: 'TypeScript',
      description: 'JavaScript с типизацией',
      lessons: 18,
      difficulty: 'Средний',
      color: ['#3178c6', '#235a97'],
      icon: 'code-outline',
      category: 'Веб-разработка'
    },
    {
      id: 9,
      name: 'Go',
      description: 'Язык от Google',
      lessons: 24,
      difficulty: 'Средний',
      color: ['#00add8', '#007d9c'],
      icon: 'planet-outline',
      category: 'Системное программирование'
    },
    {
      id: 10,
      name: 'Rust',
      description: 'Безопасное системное программирование',
      lessons: 32,
      difficulty: 'Сложный',
      color: ['#ce422b', '#a33d2a'],
      icon: 'construct-outline',
      category: 'Системное программирование'
    },
    {
      id: 11,
      name: 'Node.js',
      description: 'JavaScript на сервере',
      lessons: 26,
      difficulty: 'Средний',
      color: ['#68a063', '#5d8f57'],
      icon: 'server-outline',
      category: 'Веб-разработка'
    },
    {
      id: 12,
      name: 'Flutter',
      description: 'Кроссплатформенная разработка',
      lessons: 30,
      difficulty: 'Средний',
      color: ['#02569b', '#0553a4'],
      icon: 'phone-portrait-outline',
      category: 'Мобильная разработка'
    }
  ];

  const categories = ['Все', 'Веб-разработка', 'Мобильная разработка', 'Системное программирование', 'Data Science'];
  const difficulties = ['Все', 'Начинающий', 'Средний', 'Сложный'];

  const filteredLanguages = languages.filter(lang => {
    const categoryMatch = selectedCategory === 'Все' || lang.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'Все' || lang.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // Отладка
  console.log('Total languages:', languages.length);
  console.log('Filtered languages:', filteredLanguages.length);
  console.log('Selected category:', selectedCategory);
  console.log('Selected difficulty:', selectedDifficulty);

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

  const handleLanguagePress = (language: any) => {
    setSelectedLanguage(language);
    setShowModal(true);
    
    // Анимация появления модального окна
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(modalSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowModal(false);
      setSelectedLanguage(null);
    });
  };

  const showResultModalWithAnimation = (data: any) => {
    setResultData(data);
    setShowResultModal(true);
    
    Animated.parallel([
      Animated.timing(resultModalAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(resultSlideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeResultModal = () => {
    Animated.parallel([
      Animated.timing(resultModalAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(resultSlideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowResultModal(false);
      setResultData(null);
    });
  };

  const startLessonSimulation = async (language: any) => {
    closeModal();
    
    // Навигация к экрану детального урока
    navigation.navigate('LessonDetail', {
      lesson: {
        id: language.id,
        title: `Урок ${language.name}`,
        description: language.description,
        content: `Добро пожаловать в изучение ${language.name}!\n\nВ этом уроке вы изучите основы ${language.name} и научитесь создавать свои первые программы.\n\nОсновные темы:\n• Синтаксис языка\n• Переменные и типы данных\n• Функции и методы\n• Практические примеры`,
        difficulty: language.difficulty,
        category: language.category,
        completed: false
      }
    });
  };

  const completeAllLessons = async (language: any) => {
    closeModal();
    
    try {
      // Сохраняем прогресс в базу данных
      await saveLessonProgress(language.id, language.lessons, language.lessons);
      
      showResultModalWithAnimation({
        title: '🎉 Поздравляем!',
        message: `Вы успешно завершили все уроки по ${language.name}!`,
        details: [
          `✅ Изучено уроков: ${language.lessons}`,
          `📈 Уровень: ${language.difficulty}`,
          `🏆 Категория: ${language.category}`,
          '🎯 Прогресс: 100%'
        ],
        actions: [
          {
            title: 'Продолжить изучение',
            action: closeResultModal
          },
          {
            title: 'Выбрать новый язык',
            action: () => {
              closeResultModal();
              // Можно добавить логику для сброса фильтров или перехода к другому языку
            }
          }
        ]
      });
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить прогресс');
    }
  };

  const AnimatedLanguageCard = ({ language, index }: { language: any, index: number }) => {
    console.log('Rendering card for:', language.name);
    
    return (
      <View style={styles.languageCard}>
        <TouchableOpacity
          onPress={() => handleLanguagePress(language)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={language.color || ['#6366f1', '#8b5cf6']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={language.icon as any || 'code-outline'} 
                    size={32} 
                    color="white" 
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageDescription}>{language.description}</Text>
                  <Text style={styles.categoryText}>{language.category}</Text>
                </View>
              </View>
              
              <View style={styles.cardFooter}>
                <View style={styles.statItem}>
                  <Ionicons name="book-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{language.lessons} уроков</Text>
                </View>
                
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(language.difficulty) }]}>
                  <Text style={styles.difficultyText}>{language.difficulty}</Text>
                </View>
                
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const AnimatedFilterButton = ({ title, isSelected, onPress, index }: { 
    title: string, 
    isSelected: boolean, 
    onPress: () => void,
    index: number 
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          isSelected && styles.filterButtonSelected
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.filterButtonText,
          isSelected && styles.filterButtonTextSelected
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Компонент анимированной кнопки действия
  const AnimatedActionButton = ({ 
    icon, 
    title, 
    description, 
    color, 
    onPress, 
    index 
  }: { 
    icon: string, 
    title: string, 
    description: string, 
    color: string[], 
    onPress: () => void,
    index: number 
  }) => {
    const buttonScale = useRef(new Animated.Value(1)).current;
    const buttonGlow = useRef(new Animated.Value(0)).current;
    
    const animatePress = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(buttonGlow, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        buttonGlow.setValue(0);
      });
    };

    return (
      <Animated.View
        style={{
          opacity: modalAnim,
          transform: [
            {
              translateY: modalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50 + index * 20, 0],
              })
            },
            {
              scale: modalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            },
            { scale: buttonScale }
          ],
        }}
      >
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={() => {
            animatePress();
            setTimeout(onPress, 150);
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={color}
            style={styles.actionButtonGradient}
          >
            <Animated.View style={[styles.actionButtonGlow, {
              opacity: buttonGlow,
              backgroundColor: 'rgba(255,255,255,0.3)'
            }]} />
            
            <View style={styles.actionButtonContent}>
              <View style={styles.actionButtonIcon}>
                <Ionicons name={icon as any} size={24} color="white" />
              </View>
              <View style={styles.actionButtonText}>
                <Text style={styles.actionButtonTitle}>{title}</Text>
                <Text style={styles.actionButtonDescription}>{description}</Text>
              </View>
              <View style={styles.actionButtonArrow}>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Компонент модального окна
  const renderLanguageModal = () => {
    if (!selectedLanguage || !showModal) return null;

    const language = selectedLanguage as any;

    return (
      <Modal visible={showModal} transparent animationType="none">
        <Animated.View style={[styles.modalOverlay, {
          opacity: modalAnim,
        }]}>
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={closeModal}
          />
          
          <Animated.View style={[styles.modalContainer, {
            opacity: modalAnim,
            transform: [{ translateY: modalSlideAnim }]
          }]}>
            <LinearGradient
              colors={language.color}
              style={styles.modalGradient}
            >
              {/* Заголовок модального окна */}
              <Animated.View style={[styles.modalHeader, {
                opacity: modalAnim,
                transform: [{
                  scale: modalAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  })
                }]
              }]}>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
                
                <View style={styles.modalIconContainer}>
                  <Animated.View style={{
                    transform: [{
                      rotate: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }]
                  }}>
                    <Ionicons name={language.icon as any} size={48} color="white" />
                  </Animated.View>
                </View>
                
                <Text style={styles.modalTitle}>{language.name}</Text>
                <Text style={styles.modalSubtitle}>{language.description}</Text>
                
                <View style={styles.modalStats}>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="book-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.modalStatText}>{language.lessons} уроков</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="trending-up-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.modalStatText}>{language.difficulty}</Text>
                  </View>
                  <View style={styles.modalStatItem}>
                    <Ionicons name="folder-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.modalStatText}>{language.category}</Text>
                  </View>
                </View>
              </Animated.View>

              {/* Кнопки действий */}
              <View style={styles.modalActions}>
                <AnimatedActionButton
                  icon="rocket-outline"
                  title="Интерактивный урок"
                  description="Пошаговое изучение с практикой"
                  color={['rgba(16,185,129,0.9)', 'rgba(5,150,105,0.9)']}
                  onPress={() => startLessonSimulation(language)}
                  index={0}
                />
                
                <AnimatedActionButton
                  icon="flash-outline"
                  title="Быстрое изучение"
                  description="Изучить основы за несколько минут"
                  color={['rgba(59,130,246,0.9)', 'rgba(37,99,235,0.9)']}
                  onPress={() => startLessonSimulation(language)}
                  index={1}
                />
                
                <AnimatedActionButton
                  icon="trophy-outline"
                  title="Пройти все уроки"
                  description="Полное изучение курса (турбо режим)"
                  color={['rgba(245,158,11,0.9)', 'rgba(217,119,6,0.9)']}
                  onPress={() => completeAllLessons(language)}
                  index={2}
                />
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
         );
   };

   // Компонент модального окна результатов
   const renderResultModal = () => {
     if (!resultData || !showResultModal) return null;

     const data = resultData as any;
     const isConfirm = data.type === 'confirm_turbo';
     const isCompleted = data.type === 'course_completed';

     return (
       <Modal visible={showResultModal} transparent animationType="none">
         <Animated.View style={[styles.modalOverlay, {
           opacity: resultModalAnim,
           backgroundColor: 'rgba(0,0,0,0.6)',
         }]}>
           <TouchableOpacity 
             style={styles.modalBackdrop} 
             activeOpacity={1} 
             onPress={closeResultModal}
           />
           
           <Animated.View style={[styles.resultModalContainer, {
             opacity: resultModalAnim,
             transform: [{ translateY: resultSlideAnim }]
           }]}>
             <LinearGradient
               colors={data.language.color}
               style={styles.resultModalGradient}
             >
               {/* Конфетти или эффекты */}
               <Animated.View style={[styles.resultEffect, {
                 opacity: resultModalAnim,
                 transform: [{
                   scale: resultModalAnim.interpolate({
                     inputRange: [0, 1],
                     outputRange: [0, 1],
                   })
                 }]
               }]}>
                 <Text style={styles.resultEmoji}>
                   {isCompleted ? '🎉✨🏆✨🎉' : isConfirm ? '⚡💨⚡💨⚡' : '🎯📚🎯📚🎯'}
                 </Text>
               </Animated.View>

               {/* Заголовок */}
               <Animated.View style={[styles.resultHeader, {
                 opacity: resultModalAnim,
                 transform: [{
                   scale: resultModalAnim.interpolate({
                     inputRange: [0, 1],
                     outputRange: [0.5, 1],
                   })
                 }]
               }]}>
                 <TouchableOpacity onPress={closeResultModal} style={styles.modalCloseButton}>
                   <Ionicons name="close" size={20} color="white" />
                 </TouchableOpacity>
                 
                 <Text style={styles.resultTitle}>{data.title}</Text>
                 <Text style={styles.resultMessage}>{data.message}</Text>
                 
                 {data.details.length > 0 && (
                   <View style={styles.resultDetails}>
                     {data.details.map((detail: string, index: number) => (
                       <Animated.View
                         key={index}
                         style={{
                           opacity: resultModalAnim,
                           transform: [{
                             translateY: resultModalAnim.interpolate({
                               inputRange: [0, 1],
                               outputRange: [20, 0],
                             })
                           }]
                         }}
                       >
                         <Text style={styles.resultDetailText}>{detail}</Text>
                       </Animated.View>
                     ))}
                   </View>
                 )}
               </Animated.View>

               {/* Кнопки действий */}
               <View style={styles.resultActions}>
                 {data.actions.map((action: any, index: number) => (
                   <Animated.View
                     key={index}
                     style={{
                       opacity: resultModalAnim,
                       transform: [
                         {
                           translateY: resultModalAnim.interpolate({
                             inputRange: [0, 1],
                             outputRange: [30 + index * 10, 0],
                           })
                         },
                         {
                           scale: resultModalAnim.interpolate({
                             inputRange: [0, 1],
                             outputRange: [0.8, 1],
                           })
                         }
                       ],
                     }}
                   >
                     <TouchableOpacity
                       style={[
                         styles.resultActionButton,
                         index === 0 && data.actions.length > 1 ? styles.secondaryButton : styles.primaryButton
                       ]}
                       onPress={action.action}
                       activeOpacity={0.8}
                     >
                       <LinearGradient
                         colors={
                           index === 0 && data.actions.length > 1 
                             ? ['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']
                             : ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.2)']
                         }
                         style={styles.resultButtonGradient}
                       >
                         <Text style={[
                           styles.resultButtonText,
                           index === 0 && data.actions.length > 1 && styles.secondaryButtonText
                         ]}>
                           {action.title}
                         </Text>
                       </LinearGradient>
                     </TouchableOpacity>
                   </Animated.View>
                 ))}
               </View>
             </LinearGradient>
           </Animated.View>
         </Animated.View>
       </Modal>
     );
   };

  console.log('=== ABOUT TO RENDER COMPONENT ===');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']}
        style={styles.header}
      >
        <View>
          <Text style={styles.title}>Уроки программирования</Text>
          <Text style={styles.subtitle}>Выберите язык для изучения</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{filteredLanguages.length}</Text>
              <Text style={styles.statLabel}>языков</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>300+</Text>
              <Text style={styles.statLabel}>уроков</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Простые кнопки фильтров для тестирования */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterTitle}>Категория: {selectedCategory}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20 }}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.simpleFilterButton,
                  selectedCategory === category && styles.simpleFilterButtonSelected
                ]}
                onPress={() => {
                  console.log('Selecting category:', category);
                  setSelectedCategory(category);
                }}
              >
                <Text style={[
                  styles.simpleFilterText,
                  selectedCategory === category && styles.simpleFilterTextSelected
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Простые карточки для тестирования */}
        <View style={styles.languagesList}>
          <Text style={styles.debugText}>
            Всего языков: {languages.length}, Отфильтровано: {filteredLanguages.length}
          </Text>
          
          {filteredLanguages.map((language, index) => (
            <View key={language.id} style={styles.simpleCard}>
              <Text style={styles.simpleCardTitle}>{language.name}</Text>
              <Text style={styles.simpleCardText}>{language.description}</Text>
              <Text style={styles.simpleCardText}>Уроков: {language.lessons}</Text>
              <Text style={styles.simpleCardText}>Сложность: {language.difficulty}</Text>
              <Text style={styles.simpleCardText}>Категория: {language.category}</Text>
              <TouchableOpacity 
                style={styles.simpleButton}
                onPress={() => {
                  console.log('Pressed:', language.name);
                  handleLanguagePress(language);
                }}
              >
                <Text style={styles.simpleButtonText}>Изучать</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          {filteredLanguages.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Нет языков для отображения</Text>
              <Text style={styles.noResultsSubtext}>Выбрана категория: {selectedCategory}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      {renderLanguageModal()}
      {renderResultModal()}
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  languageCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
    minHeight: 140,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  languageDescription: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
    lineHeight: 20,
  },
  categoryText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomPadding: {
    height: 100,
  },
  filtersSection: {
    marginBottom: 20,
    paddingTop: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  languagesList: {
    paddingHorizontal: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterButtonTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  // Простые стили для отладки
  debugText: {
    fontSize: 14,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: 8,
    marginBottom: 8,
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  simpleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simpleCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  simpleCardText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  simpleButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  simpleButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  simpleFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  simpleFilterButtonSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  simpleFilterText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  simpleFilterTextSelected: {
    color: 'white',
    fontWeight: '600',
  },

    
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // Стили модального окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    maxHeight: '80%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    padding: 30,
    paddingBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  modalStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  modalStatText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  modalActions: {
    padding: 20,
    paddingTop: 10,
    gap: 12,
  },
  actionButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  actionButtonGradient: {
    position: 'relative',
  },
  actionButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  actionButtonArrow: {
    marginLeft: 8,
  },
  actionButtonArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Стили модального окна результатов
  resultModalContainer: {
    marginHorizontal: 20,
    marginVertical: 60,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
  },
  resultModalGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  resultEffect: {
    marginBottom: 20,
  },
  resultEmoji: {
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 4,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
    width: '100%',
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  resultDetails: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 16,
    width: '100%',
  },
  resultDetailText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: '500',
  },
  resultActions: {
    width: '100%',
    gap: 12,
  },
  resultActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryButton: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  secondaryButton: {
    opacity: 0.8,
  },
  resultButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButtonText: {
    opacity: 0.8,
  },
});

export default LessonsScreen; 