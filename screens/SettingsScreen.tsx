import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'switch' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  color?: string[];
}

const SettingsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Состояния настроек
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('userSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotifications(parsedSettings.notifications ?? true);
        setDailyReminder(parsedSettings.dailyReminder ?? true);
        setSoundEffects(parsedSettings.soundEffects ?? true);
        setDarkMode(parsedSettings.darkMode ?? false);
        setAutoSync(parsedSettings.autoSync ?? true);
        setOfflineMode(parsedSettings.offlineMode ?? false);
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  const saveSettings = async (newSettings: any) => {
    try {
      const currentSettings = {
        notifications,
        dailyReminder,
        soundEffects,
        darkMode,
        autoSync,
        offlineMode,
        ...newSettings
      };
      await AsyncStorage.setItem('userSettings', JSON.stringify(currentSettings));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  };

  const handleNotificationsChange = (value: boolean) => {
    setNotifications(value);
    saveSettings({ notifications: value });
    if (value) {
      Alert.alert(
        'Уведомления включены',
        'Вы будете получать уведомления о новых уроках и достижениях'
      );
    }
  };

  const handleDailyReminderChange = (value: boolean) => {
    setDailyReminder(value);
    saveSettings({ dailyReminder: value });
  };

  const handleSoundEffectsChange = (value: boolean) => {
    setSoundEffects(value);
    saveSettings({ soundEffects: value });
  };

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
    saveSettings({ darkMode: value });
    Alert.alert(
      'Тема изменена',
      `${value ? 'Темная' : 'Светлая'} тема будет применена при следующем запуске приложения`
    );
  };

  const handleAutoSyncChange = (value: boolean) => {
    setAutoSync(value);
    saveSettings({ autoSync: value });
  };

  const handleOfflineModeChange = (value: boolean) => {
    setOfflineMode(value);
    saveSettings({ offlineMode: value });
  };

  const clearCache = () => {
    Alert.alert(
      'Очистить кэш',
      'Это действие удалит временные файлы и может освободить место на устройстве. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              // Здесь можно добавить логику очистки кэша
              Alert.alert('Успешно', 'Кэш очищен');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить кэш');
            }
          }
        }
      ]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      'Сбросить настройки',
      'Это действие вернет все настройки к значениям по умолчанию. Продолжить?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userSettings');
              setNotifications(true);
              setDailyReminder(true);
              setSoundEffects(true);
              setDarkMode(false);
              setAutoSync(true);
              setOfflineMode(false);
              Alert.alert('Успешно', 'Настройки сброшены');
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось сбросить настройки');
            }
          }
        }
      ]
    );
  };

  const exportData = () => {
    Alert.alert(
      'Экспорт данных',
      'Ваши данные будут экспортированы в файл для резервного копирования',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Экспортировать',
          onPress: () => {
            // Здесь можно добавить логику экспорта данных
            Alert.alert('Успешно', 'Данные экспортированы');
          }
        }
      ]
    );
  };

  const settingSections = [
    {
      title: 'Уведомления',
      icon: 'notifications',
      items: [
        {
          id: 'notifications',
          title: 'Уведомления',
          subtitle: 'Получать уведомления от приложения',
          icon: 'notifications-outline',
          type: 'switch' as const,
          value: notifications,
          onValueChange: handleNotificationsChange,
          color: ['#10b981', '#059669']
        },
        {
          id: 'dailyReminder',
          title: 'Ежедневные напоминания',
          subtitle: 'Напоминания о ежедневном обучении',
          icon: 'alarm-outline',
          type: 'switch' as const,
          value: dailyReminder,
          onValueChange: handleDailyReminderChange,
          color: ['#f59e0b', '#d97706']
        }
      ]
    },
    {
      title: 'Интерфейс',
      icon: 'color-palette',
      items: [
        {
          id: 'darkMode',
          title: 'Темная тема',
          subtitle: 'Использовать темную тему интерфейса',
          icon: 'moon-outline',
          type: 'switch' as const,
          value: darkMode,
          onValueChange: handleDarkModeChange,
          color: ['#6366f1', '#4f46e5']
        },
        {
          id: 'soundEffects',
          title: 'Звуковые эффекты',
          subtitle: 'Воспроизводить звуки в приложении',
          icon: 'volume-high-outline',
          type: 'switch' as const,
          value: soundEffects,
          onValueChange: handleSoundEffectsChange,
          color: ['#8b5cf6', '#7c3aed']
        }
      ]
    },
    {
      title: 'Синхронизация',
      icon: 'sync',
      items: [
        {
          id: 'autoSync',
          title: 'Автосинхронизация',
          subtitle: 'Автоматически синхронизировать данные',
          icon: 'sync-outline',
          type: 'switch' as const,
          value: autoSync,
          onValueChange: handleAutoSyncChange,
          color: ['#06b6d4', '#0891b2']
        },
        {
          id: 'offlineMode',
          title: 'Офлайн режим',
          subtitle: 'Работать без подключения к интернету',
          icon: 'cloud-offline-outline',
          type: 'switch' as const,
          value: offlineMode,
          onValueChange: handleOfflineModeChange,
          color: ['#64748b', '#475569']
        }
      ]
    },
    {
      title: 'Данные',
      icon: 'server',
      items: [
        {
          id: 'clearCache',
          title: 'Очистить кэш',
          subtitle: 'Удалить временные файлы',
          icon: 'trash-outline',
          type: 'action' as const,
          onPress: clearCache,
          color: ['#f97316', '#ea580c']
        },
        {
          id: 'exportData',
          title: 'Экспорт данных',
          subtitle: 'Создать резервную копию',
          icon: 'download-outline',
          type: 'action' as const,
          onPress: exportData,
          color: ['#10b981', '#059669']
        },
        {
          id: 'resetSettings',
          title: 'Сбросить настройки',
          subtitle: 'Вернуть к значениям по умолчанию',
          icon: 'refresh-outline',
          type: 'action' as const,
          onPress: resetSettings,
          color: ['#ef4444', '#dc2626']
        }
      ]
    }
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === 'switch'}
        activeOpacity={item.type === 'switch' ? 1 : 0.7}
      >
        <View style={styles.settingContent}>
          <View style={[styles.settingIcon, { backgroundColor: item.color?.[0] || '#6366f1' }]}>
            <Ionicons name={item.icon as any} size={20} color="white" />
          </View>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
          {item.type === 'switch' && (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#e5e7eb', true: item.color?.[0] || '#6366f1' }}
              thumbColor={item.value ? 'white' : '#f3f4f6'}
            />
          )}
          {item.type === 'action' && (
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <Text style={styles.headerTitle}>Настройки</Text>
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
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name={section.icon as any} size={20} color="#6366f1" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.sectionContent}>
                {section.items.map(renderSettingItem)}
              </View>
            </View>
          ))}

          {/* Информация о приложении */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={20} color="#6366f1" />
              <Text style={styles.sectionTitle}>О приложении</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>Programming Learning</Text>
              <Text style={styles.appVersion}>Версия 1.0.0</Text>
              <Text style={styles.appDescription}>
                Изучайте программирование легко и эффективно
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
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  appInfo: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SettingsScreen; 