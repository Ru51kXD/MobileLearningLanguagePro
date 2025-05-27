import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

interface RouteParams {
  lesson: {
    id: number;
    title: string;
    description: string;
    content: string;
    difficulty: string;
    category: string;
    completed: boolean;
  };
}

export default function LessonDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lesson } = route.params as RouteParams;

  const handleComplete = () => {
    // Логика для отметки урока как выполненного
    console.log('Урок отмечен как выполненный');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#6366f1" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Урок</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>{lesson?.title || 'Название урока'}</Text>
          <View style={styles.lessonMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="bar-chart" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{lesson?.difficulty || 'Средний'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="folder" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{lesson?.category || 'Основы'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.description}>
            {lesson?.description || 'Описание урока будет здесь...'}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Содержание урока</Text>
          <Text style={styles.lessonContent}>
            {lesson?.content || 'Содержание урока будет загружено...'}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            lesson?.completed && styles.completedButton
          ]}
          onPress={handleComplete}
        >
          <Ionicons
            name={lesson?.completed ? "checkmark-circle" : "checkmark"}
            size={20}
            color="white"
          />
          <Text style={styles.completeButtonText}>
            {lesson?.completed ? 'Завершено' : 'Завершить урок'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lessonHeader: {
    paddingVertical: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  contentSection: {
    marginBottom: 25,
  },
  lessonContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  completedButton: {
    backgroundColor: '#10b981',
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 