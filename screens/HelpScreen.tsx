import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

interface HelpSection {
  title: string;
  icon: string;
  items: any[];
}

const HelpScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'Как начать изучение программирования?',
      answer: 'Выберите курс на главном экране или перейдите в раздел "Уроки". Рекомендуем начать с курса "JavaScript Основы" для новичков.',
      expanded: false
    },
    {
      id: '2',
      question: 'Как отслеживать свой прогресс?',
      answer: 'Ваш прогресс автоматически сохраняется. Посмотреть статистику можно в разделе "Профиль" → "Статистика".',
      expanded: false
    },
    {
      id: '3',
      question: 'Что делать, если урок не загружается?',
      answer: 'Проверьте подключение к интернету. Если проблема сохраняется, попробуйте перезапустить приложение или обратитесь в поддержку.',
      expanded: false
    },
    {
      id: '4',
      question: 'Как получить достижения?',
      answer: 'Достижения разблокируются автоматически при выполнении определенных условий: завершение уроков, прохождение тестов, поддержание серии обучения.',
      expanded: false
    },
    {
      id: '5',
      question: 'Можно ли учиться офлайн?',
      answer: 'Некоторые материалы доступны офлайн после первого просмотра. Включите офлайн-режим в настройках для лучшего опыта.',
      expanded: false
    },
    {
      id: '6',
      question: 'Как сбросить прогресс?',
      answer: 'Перейдите в Настройки → Данные → Сбросить настройки. Внимание: это действие нельзя отменить!',
      expanded: false
    }
  ]);

  const toggleFAQ = (id: string) => {
    setFaqItems(items =>
      items.map(item =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const openEmail = () => {
    const email = 'support@programminglearning.app';
    const subject = 'Вопрос по приложению Programming Learning';
    const body = 'Здравствуйте! У меня есть вопрос по приложению...';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert(
            'Ошибка',
            'Не удалось открыть почтовое приложение. Напишите нам на: ' + email
          );
        }
      })
      .catch(() => {
        Alert.alert(
          'Ошибка',
          'Не удалось открыть почтовое приложение. Напишите нам на: ' + email
        );
      });
  };

  const openWebsite = () => {
    const url = 'https://programminglearning.app';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть веб-сайт');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть веб-сайт');
      });
  };

  const openTelegram = () => {
    const url = 'https://t.me/programminglearning_support';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Ошибка', 'Не удалось открыть Telegram');
        }
      })
      .catch(() => {
        Alert.alert('Ошибка', 'Не удалось открыть Telegram');
      });
  };

  const reportBug = () => {
    Alert.alert(
      'Сообщить об ошибке',
      'Опишите проблему, которую вы обнаружили, и мы постараемся её исправить в следующем обновлении.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Написать',
          onPress: () => {
            const email = 'bugs@programminglearning.app';
            const subject = 'Сообщение об ошибке';
            const body = 'Описание ошибки:\n\nШаги для воспроизведения:\n1. \n2. \n3. \n\nОжидаемый результат:\n\nФактический результат:\n\nДополнительная информация:';
            
            const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Ошибка', 'Не удалось открыть почтовое приложение');
            });
          }
        }
      ]
    );
  };

  const helpSections: HelpSection[] = [
    {
      title: 'Быстрый старт',
      icon: 'rocket',
      items: [
        {
          title: 'Создание аккаунта',
          description: 'Ваш прогресс сохраняется автоматически',
          icon: 'person-add',
          color: '#10b981'
        },
        {
          title: 'Выбор курса',
          description: 'Начните с основ или выберите свой уровень',
          icon: 'library',
          color: '#6366f1'
        },
        {
          title: 'Изучение уроков',
          description: 'Читайте материалы и выполняйте практические задания',
          icon: 'book',
          color: '#f59e0b'
        },
        {
          title: 'Прохождение тестов',
          description: 'Проверьте свои знания с помощью тестов',
          icon: 'help-circle',
          color: '#ef4444'
        }
      ]
    },
    {
      title: 'Контакты',
      icon: 'mail',
      items: [
        {
          title: 'Электронная почта',
          description: 'support@programminglearning.app',
          icon: 'mail',
          color: '#06b6d4',
          onPress: openEmail
        },
        {
          title: 'Веб-сайт',
          description: 'programminglearning.app',
          icon: 'globe',
          color: '#8b5cf6',
          onPress: openWebsite
        },
        {
          title: 'Telegram поддержка',
          description: '@programminglearning_support',
          icon: 'send',
          color: '#0088cc',
          onPress: openTelegram
        },
        {
          title: 'Сообщить об ошибке',
          description: 'Помогите нам улучшить приложение',
          icon: 'bug',
          color: '#ef4444',
          onPress: reportBug
        }
      ]
    }
  ];

  const renderFAQItem = (item: FAQItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.faqItem}
      onPress={() => toggleFAQ(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Ionicons
          name={item.expanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6b7280"
        />
      </View>
      {item.expanded && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHelpItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.helpItem}
      onPress={item.onPress}
      activeOpacity={item.onPress ? 0.7 : 1}
    >
      <View style={[styles.helpIcon, { backgroundColor: item.color }]}>
        <Ionicons name={item.icon as any} size={20} color="white" />
      </View>
      <View style={styles.helpContent}>
        <Text style={styles.helpTitle}>{item.title}</Text>
        <Text style={styles.helpDescription}>{item.description}</Text>
      </View>
      {item.onPress && (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Помощь</Text>
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
          {/* Приветственная карточка */}
          <View style={styles.welcomeCard}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.welcomeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.welcomeContent}>
                <Ionicons name="help-circle" size={48} color="white" />
                <Text style={styles.welcomeTitle}>Нужна помощь?</Text>
                <Text style={styles.welcomeSubtitle}>
                  Мы здесь, чтобы помочь вам в изучении программирования
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* Разделы помощи */}
          {helpSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name={section.icon as any} size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.sectionContent}>
                {section.items.map(renderHelpItem)}
              </View>
            </View>
          ))}

          {/* FAQ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-buoy" size={20} color="#6366f1" />
              <Text style={styles.sectionTitle}>Часто задаваемые вопросы</Text>
            </View>
            <View style={styles.faqContainer}>
              {faqItems.map(renderFAQItem)}
            </View>
          </View>

          {/* Дополнительные ресурсы */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="library" size={20} color="#6366f1" />
              <Text style={styles.sectionTitle}>Дополнительные ресурсы</Text>
            </View>
            <View style={styles.resourcesContainer}>
              <Text style={styles.resourcesText}>
                📚 Документация по языкам программирования{'\n'}
                🎥 Видеоуроки и туториалы{'\n'}
                💬 Сообщество разработчиков{'\n'}
                🔧 Инструменты для разработки{'\n'}
                📝 Практические задания
              </Text>
            </View>
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
  welcomeCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  welcomeGradient: {
    padding: 24,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  helpDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  faqContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  resourcesContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resourcesText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 24,
  },
});

export default HelpScreen; 