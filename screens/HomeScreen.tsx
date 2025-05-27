import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  
  // Анимированные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  const techAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const startModalAnim = useRef(new Animated.Value(0)).current;
  const guideModalAnim = useRef(new Animated.Value(0)).current;
  const practiceModalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Последовательная анимация появления элементов
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
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(techAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Анимация нажатия
  const createPressAnimation = () => {
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

    return { scaleValue, animatePress };
  };

  const features = [
    {
      id: 1,
      title: 'Интерактивные уроки',
      description: 'Изучайте программирование с практическими примерами',
      icon: 'book-outline',
      color: '#4f46e5',
      action: () => navigation.navigate('Lessons' as never)
    },
    {
      id: 2,
      title: 'Викторины',
      description: 'Проверьте свои знания с помощью тестов',
      icon: 'help-circle-outline',
      color: '#059669',
      action: () => navigation.navigate('Quiz' as never)
    },
    {
      id: 3,
      title: 'Отслеживание прогресса',
      description: 'Следите за своим развитием в программировании',
      icon: 'trending-up-outline',
      color: '#dc2626',
      action: () => navigation.navigate('Profile' as never)
    },
    {
      id: 4,
      title: 'Практические задания',
      description: 'Решайте реальные задачи программирования',
      icon: 'code-slash-outline',
      color: '#7c3aed',
      action: () => {
        setShowPracticeModal(true);
        practiceModalAnim.setValue(0);
        Animated.spring(practiceModalAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }
  ];

  const stats = [
    { label: 'Языков программирования', value: '12+', icon: 'code-working-outline', color: '#6366f1' },
    { label: 'Викторин', value: '8+', icon: 'help-circle-outline', color: '#8b5cf6' },
    { label: 'Уроков', value: '300+', icon: 'book-outline', color: '#10b981' },
    { label: 'Студентов', value: '1000+', icon: 'people-outline', color: '#f59e0b' }
  ];

  const quickActions = [
    {
      title: 'Начать с JavaScript',
      subtitle: 'Самый популярный язык',
      icon: 'logo-javascript',
      color: ['#f7df1e', '#f0d000'],
      action: () => navigation.navigate('Lessons' as never)
    },
    {
      title: 'Пройти тест Python',
      subtitle: 'Проверьте базовые знания',
      icon: 'logo-python',
      color: ['#3776ab', '#4b8bbe'],
      action: () => navigation.navigate('Quiz' as never)
    }
  ];

  const handleStartLearning = () => {
    setShowStartModal(true);
    startModalAnim.setValue(0);
    Animated.spring(startModalAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeStartModal = () => {
    Animated.timing(startModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowStartModal(false);
    });
  };

  const showUserGuide = () => {
    closeStartModal();
    setTimeout(() => {
      setShowGuideModal(true);
      guideModalAnim.setValue(0);
      Animated.spring(guideModalAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 300);
  };

  const closeGuideModal = () => {
    Animated.timing(guideModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowGuideModal(false);
    });
  };

  const closePracticeModal = () => {
    Animated.timing(practiceModalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowPracticeModal(false);
    });
  };

  // Компонент анимированной карточки
  const AnimatedFeatureCard = ({ feature, index }: { feature: any, index: number }) => {
    const { scaleValue, animatePress } = createPressAnimation();
    
    return (
      <Animated.View
        style={{
          opacity: featuresAnim,
          transform: [
            { 
              translateY: featuresAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => {
            animatePress();
            setTimeout(() => feature.action(), 150);
          }}
          activeOpacity={0.9}
        >
          <Animated.View style={[styles.iconContainer, { 
            backgroundColor: feature.color,
            transform: [{ 
              scale: scaleValue.interpolate({
                inputRange: [0.95, 1],
                outputRange: [0.9, 1],
              })
            }]
          }]}>
            <Ionicons name={feature.icon as any} size={24} color="white" />
          </Animated.View>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>
          <View style={styles.featureAction}>
            <Ionicons name="chevron-forward" size={16} color={feature.color} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Компонент анимированного быстрого действия
  const AnimatedQuickAction = ({ action, index }: { action: any, index: number }) => {
    const { scaleValue, animatePress } = createPressAnimation();
    
    return (
      <Animated.View
        style={{
          opacity: statsAnim,
          transform: [
            { 
              translateX: statsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [index % 2 === 0 ? -50 : 50, 0],
              })
            },
            { scale: scaleValue }
          ],
        }}
      >
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => {
            animatePress();
            setTimeout(() => action.action(), 150);
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={action.color}
            style={styles.quickActionGradient}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Ionicons name={action.icon as any} size={32} color="white" />
            </Animated.View>
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </View>
            <Animated.View style={{ 
              transform: [{ 
                translateX: scaleValue.interpolate({
                  inputRange: [0.95, 1],
                  outputRange: [-5, 0],
                })
              }]
            }}>
              <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.8)" />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Компонент модального окна начала обучения
  const renderStartModal = () => (
    <Modal visible={showStartModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, {
        opacity: startModalAnim,
      }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={closeStartModal}
        />
        
        <Animated.View style={[styles.startModalContainer, {
          opacity: startModalAnim,
          transform: [{
            translateY: startModalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            })
          }, {
            scale: startModalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }]
        }]}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={styles.startModalGradient}
          >
            <TouchableOpacity onPress={closeStartModal} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Animated.View style={[styles.startModalHeader, {
              transform: [{
                scale: startModalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              }]
            }]}>
              <Text style={styles.startModalEmoji}>🎯</Text>
              <Text style={styles.startModalTitle}>Начать обучение</Text>
              <Text style={styles.startModalSubtitle}>Выберите, что вас интересует больше всего:</Text>
            </Animated.View>

            <View style={styles.startModalActions}>
              {[
                { title: 'Изучать языки', icon: 'book-outline', color: ['#10b981', '#059669'], action: () => { closeStartModal(); setTimeout(() => navigation.navigate('Lessons' as never), 300); } },
                { title: 'Проходить тесты', icon: 'help-circle-outline', color: ['#3b82f6', '#2563eb'], action: () => { closeStartModal(); setTimeout(() => navigation.navigate('Quiz' as never), 300); } },
                { title: 'Как пользоваться?', icon: 'information-circle-outline', color: ['#f59e0b', '#d97706'], action: showUserGuide },
              ].map((action, index) => (
                <Animated.View
                  key={index}
                  style={{
                    opacity: startModalAnim,
                    transform: [{
                      translateY: startModalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50 + index * 20, 0],
                      })
                    }]
                  }}
                >
                  <TouchableOpacity
                    style={styles.startModalActionButton}
                    onPress={action.action}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={action.color}
                      style={styles.startModalActionGradient}
                    >
                      <View style={styles.startModalActionIcon}>
                        <Ionicons name={action.icon as any} size={24} color="white" />
                      </View>
                      <Text style={styles.startModalActionText}>{action.title}</Text>
                      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
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

  // Компонент модального окна руководства
  const renderGuideModal = () => (
    <Modal visible={showGuideModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, {
        opacity: guideModalAnim,
      }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={closeGuideModal}
        />
        
        <Animated.View style={[styles.guideModalContainer, {
          opacity: guideModalAnim,
          transform: [{
            translateY: guideModalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            })
          }]
        }]}>
          <LinearGradient
            colors={['#3b82f6', '#1e40af']}
            style={styles.guideModalGradient}
          >
            <TouchableOpacity onPress={closeGuideModal} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Animated.View style={[styles.guideModalHeader, {
              transform: [{
                scale: guideModalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              }]
            }]}>
              <Text style={styles.guideModalEmoji}>📖</Text>
              <Text style={styles.guideModalTitle}>Как пользоваться приложением</Text>
            </Animated.View>

            <View style={styles.guideModalContent}>
              {[
                { icon: 'home-outline', title: 'Главная', description: 'Обзор приложения и быстрые действия' },
                { icon: 'book-outline', title: 'Уроки', description: 'Выберите язык программирования и начните изучение. Можете пройти один урок или весь курс!' },
                { icon: 'help-circle-outline', title: 'Викторины', description: 'Проверьте знания с помощью интерактивных тестов. Результаты сохраняются в профиле.' },
                { icon: 'person-outline', title: 'Профиль', description: 'Отслеживайте прогресс, достижения и статистику обучения.' },
              ].map((item, index) => (
                <Animated.View
                  key={index}
                  style={[styles.guideItem, {
                    opacity: guideModalAnim,
                    transform: [{
                      translateX: guideModalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [index % 2 === 0 ? -50 : 50, 0],
                      })
                    }]
                  }]}
                >
                  <View style={styles.guideItemIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#3b82f6" />
                  </View>
                  <View style={styles.guideItemText}>
                    <Text style={styles.guideItemTitle}>{item.title}</Text>
                    <Text style={styles.guideItemDescription}>{item.description}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>

            <View style={styles.guideModalActions}>
              <TouchableOpacity
                style={styles.guideModalButton}
                onPress={closeGuideModal}
                activeOpacity={0.8}
              >
                <Text style={styles.guideModalButtonText}>Понятно!</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.guideModalButton, styles.primaryButton]}
                onPress={() => {
                  closeGuideModal();
                  setTimeout(() => navigation.navigate('Lessons' as never), 300);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.guideModalButtonText, styles.primaryButtonText]}>Начать изучение</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  // Компонент модального окна практики
  const renderPracticeModal = () => (
    <Modal visible={showPracticeModal} transparent animationType="none">
      <Animated.View style={[styles.modalOverlay, {
        opacity: practiceModalAnim,
      }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={closePracticeModal}
        />
        
        <Animated.View style={[styles.practiceModalContainer, {
          opacity: practiceModalAnim,
          transform: [{
            translateY: practiceModalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            })
          }, {
            scale: practiceModalAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            })
          }]
        }]}>
          <LinearGradient
            colors={['#7c3aed', '#5b21b6']}
            style={styles.practiceModalGradient}
          >
            <TouchableOpacity onPress={closePracticeModal} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <Animated.View style={[styles.practiceModalHeader, {
              transform: [{
                scale: practiceModalAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              }]
            }]}>
              <Text style={styles.practiceModalEmoji}>💻</Text>
              <Text style={styles.practiceModalTitle}>Практика</Text>
              <Text style={styles.practiceModalSubtitle}>Практические задания будут доступны в следующей версии!</Text>
              
              <View style={styles.practiceModalFeatures}>
                <Text style={styles.practiceFeatureText}>🚀 Реальные проекты</Text>
                <Text style={styles.practiceFeatureText}>⚡ Мгновенная обратная связь</Text>
                <Text style={styles.practiceFeatureText}>🏆 Система достижений</Text>
              </View>
            </Animated.View>

            <TouchableOpacity
              style={styles.practiceModalButton}
              onPress={closePracticeModal}
              activeOpacity={0.8}
            >
              <Text style={styles.practiceModalButtonText}>Понятно</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6', '#a855f7']}
        style={styles.header}
      >
        <Animated.View style={{
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }}>
          <Text style={styles.title}>Programming Learning</Text>
          <Text style={styles.subtitle}>Изучайте программирование легко и эффективно</Text>
        </Animated.View>
        
        <Animated.View style={[styles.headerStats, {
          opacity: statsAnim,
          transform: [{
            translateY: statsAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }]}>
          {stats.map((stat, index) => (
            <Animated.View 
              key={index} 
              style={[styles.statItem, {
                transform: [{
                  scale: statsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  })
                }]
              }]}
            >
              <Ionicons name={stat.icon as any} size={20} color="white" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Animated.Text style={[styles.sectionTitle, {
            opacity: statsAnim,
            transform: [{
              translateX: statsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })
            }]
          }]}>
            Быстрые действия
          </Animated.Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <AnimatedQuickAction key={index} action={action} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Animated.Text style={[styles.sectionTitle, {
            opacity: featuresAnim,
            transform: [{
              translateX: featuresAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            }]
          }]}>
            Возможности приложения
          </Animated.Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <AnimatedFeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Animated.Text style={[styles.sectionTitle, {
            opacity: techAnim,
            transform: [{
              translateY: techAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              })
            }]
          }]}>
            Популярные технологии
          </Animated.Text>
          <Animated.View style={{
            opacity: techAnim,
            transform: [{
              scale: techAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }]
          }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.techScroll}>
              {[
                { name: 'React', icon: 'logo-react', color: '#61dafb' },
                { name: 'Node.js', icon: 'logo-nodejs', color: '#68a063' },
                { name: 'Python', icon: 'logo-python', color: '#3776ab' },
                { name: 'JavaScript', icon: 'logo-javascript', color: '#f7df1e' },
                { name: 'TypeScript', icon: 'code-outline', color: '#3178c6' },
                { name: 'Swift', icon: 'logo-apple', color: '#fa7343' }
              ].map((tech, index) => {
                const { scaleValue, animatePress } = createPressAnimation();
                
                return (
                  <Animated.View
                    key={index}
                    style={{
                      transform: [
                        { 
                          translateY: techAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          })
                        },
                        { scale: scaleValue }
                      ],
                    }}
                  >
                    <TouchableOpacity
                      style={[styles.techItem, { borderColor: tech.color }]}
                      onPress={() => {
                        animatePress();
                        setTimeout(() => navigation.navigate('Lessons' as never), 150);
                      }}
                    >
                      <Ionicons name={tech.icon as any} size={24} color={tech.color} />
                      <Text style={[styles.techName, { color: tech.color }]}>{tech.name}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>

        <Animated.View style={{
          opacity: buttonAnim,
          transform: [
            {
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            },
            {
              scale: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              })
            }
          ],
        }}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartLearning}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.buttonGradient}
            >
              <Ionicons name="rocket-outline" size={24} color="white" />
              <Text style={styles.startButtonText}>Начать обучение</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.footer, {
          opacity: buttonAnim,
          transform: [{
            translateY: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            })
          }]
        }]}>
          <Text style={styles.footerText}>
            Присоединяйтесь к тысячам разработчиков, которые уже изучают программирование с нами! 🚀
          </Text>
        </Animated.View>
      </View>
      
      {renderStartModal()}
      {renderGuideModal()}
      {renderPracticeModal()}
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
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  headerStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  quickActionText: {
    flex: 1,
    marginLeft: 16,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 12,
  },
  featureAction: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  techScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  techItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginRight: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  techName: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Стили модальных окон
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  // Стили модального окна начала обучения
  startModalContainer: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
    maxHeight: '80%',
  },
  startModalGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  startModalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  startModalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  startModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  startModalSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  startModalActions: {
    gap: 16,
  },
  startModalActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  startModalActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  startModalActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  startModalActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  // Стили модального окна руководства
  guideModalContainer: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
    maxHeight: '85%',
  },
  guideModalGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
  },
  guideModalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  guideModalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  guideModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  guideModalContent: {
    marginBottom: 30,
  },
  guideItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  guideItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  guideItemText: {
    flex: 1,
  },
  guideItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  guideItemDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  guideModalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  guideModalButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  primaryButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  guideModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.8)',
  },
  primaryButtonText: {
    color: 'white',
  },
  // Стили модального окна практики
  practiceModalContainer: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
  },
  practiceModalGradient: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  practiceModalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  practiceModalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  practiceModalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  practiceModalSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  practiceModalFeatures: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 16,
    width: '100%',
  },
  practiceFeatureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  practiceModalButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  practiceModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen; 