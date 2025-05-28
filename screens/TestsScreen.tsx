import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { quizzes } from '../data/quizzes';

const { width } = Dimensions.get('window');

const TestsScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
  }, []);

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

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'logo-javascript';
      case 'python':
        return 'logo-python';
      case 'react':
        return 'logo-react';
      case 'java':
        return 'cafe';
      case 'c++':
        return 'code-slash';
      case 'c#':
        return 'logo-microsoft';
      case 'php':
        return 'code-working';
      case 'swift':
        return 'logo-apple';
      case 'kotlin':
        return 'logo-android';
      case 'go':
        return 'logo-google';
      case 'rust':
        return 'hardware-chip';
      case 'react native':
        return 'phone-portrait';
      default:
        return 'code-outline';
    }
  };

  const getLanguageColors = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return ['#f7df1e', '#f0d000'];
      case 'python':
        return ['#3776ab', '#ffd43b'];
      case 'react':
        return ['#61dafb', '#21232a'];
      case 'java':
        return ['#f89820', '#ed8b00'];
      case 'c++':
        return ['#00599c', '#004482'];
      case 'c#':
        return ['#239120', '#68217a'];
      case 'php':
        return ['#777bb4', '#4f5b93'];
      case 'swift':
        return ['#fa7343', '#ff8c00'];
      case 'kotlin':
        return ['#0f9d58', '#0d8043'];
      case 'go':
        return ['#00add8', '#007d9c'];
      case 'rust':
        return ['#ce422b', '#a33319'];
      case 'react native':
        return ['#61dafb', '#282c34'];
      default:
        return ['#6366f1', '#8b5cf6'];
    }
  };

  const startTest = (quiz: any) => {
    navigation.navigate('QuizDetail', {
      quiz: quiz,
      lesson: {
        id: quiz.id,
        title: quiz.title,
        type: 'test'
      },
      course: {
        title: quiz.language,
        color: getLanguageColors(quiz.language)
      }
    });
  };

  const renderTestCard = (quiz: any, index: number) => {
    return (
      <Animated.View
        key={quiz.id}
        style={[
          styles.testCard,
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
          onPress={() => startTest(quiz)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getLanguageColors(quiz.language)}
            style={styles.testGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.testHeader}>
              <View style={styles.testIconContainer}>
                <Ionicons name={getLanguageIcon(quiz.language) as any} size={28} color="white" />
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
                <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
              </View>
            </View>
            
            <View style={styles.testContent}>
              <Text style={styles.testTitle}>{quiz.title}</Text>
              <Text style={styles.testDescription}>{quiz.description}</Text>
              
              <View style={styles.testStats}>
                <View style={styles.statItem}>
                  <Ionicons name="help-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{quiz.questions.length} вопросов</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{Math.floor((quiz.timeLimit || 300) / 60)} мин</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="code-outline" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.statText}>{quiz.language}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Тесты по программированию</Text>
        <Text style={styles.headerSubtitle}>Проверьте свои знания в {quizzes.length} языках</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.testsContainer}>
          {quizzes.map((quiz, index) => renderTestCard(quiz, index))}
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
  scrollContent: {
    paddingBottom: 20,
  },
  testsContainer: {
    padding: 20,
    gap: 16,
  },
  testCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  testGradient: {
    padding: 20,
    minHeight: 160,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  testIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  testContent: {
    flex: 1,
  },
  testTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  testDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  testStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TestsScreen; 