import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('programming_learning.db');
    
    // Создаем таблицы
    await createTables();
    
    // Создаем пользователя по умолчанию
    await createDefaultUser();
    
    console.log('База данных инициализирована успешно');
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
  }
};

const createTables = async () => {
  try {
    // Таблица пользователей
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT 'Студент',
        email TEXT DEFAULT 'student@programming.app',
        total_study_time INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Таблица прогресса уроков с детальной информацией
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        lesson_id INTEGER,
        language TEXT,
        lesson_title TEXT,
        time_spent INTEGER DEFAULT 0,
        completion_percentage INTEGER DEFAULT 100,
        score INTEGER DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // Таблица результатов викторин с временем
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        quiz_id INTEGER,
        quiz_title TEXT,
        score INTEGER,
        total_questions INTEGER,
        percentage REAL,
        time_spent INTEGER DEFAULT 0,
        perfect_score BOOLEAN DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // Таблица достижений
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        achievement_type TEXT,
        achievement_title TEXT,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // Таблица активности пользователя с детальной статистикой
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        activity_date DATE,
        lessons_completed INTEGER DEFAULT 0,
        quizzes_completed INTEGER DEFAULT 0,
        total_study_time INTEGER DEFAULT 0,
        points_earned INTEGER DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    // Таблица streak данных
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_activity_date DATE,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `);

    console.log('Таблицы созданы успешно');
  } catch (error) {
    console.error('Ошибка создания таблиц:', error);
    throw error;
  }
};

const createDefaultUser = async () => {
  try {
    // Проверяем, есть ли уже пользователи
    const result = await db.getFirstAsync('SELECT COUNT(*) as count FROM users');
    const count = (result as any)?.count || 0;
    
    if (count === 0) {
      // Создаем пользователя по умолчанию
      const userResult = await db.runAsync('INSERT INTO users (name, email) VALUES (?, ?)', ['Студент', 'student@programming.app']);
      
      // Создаем запись для streak
      await db.runAsync(
        'INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date) VALUES (?, ?, ?, ?)',
        [userResult.lastInsertRowId, 0, 0, new Date().toISOString().split('T')[0]]
      );
      
      console.log('Пользователь по умолчанию создан');
    }
  } catch (error) {
    console.error('Ошибка создания пользователя по умолчанию:', error);
    throw error;
  }
};

// Функция для получения пользователя
export const getUser = async (userId: number): Promise<any> => {
  try {
    const user = await db.getFirstAsync('SELECT * FROM users WHERE id = ?', [userId]);
    return user || null;
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    throw error;
  }
};

// Расширенная функция для получения статистики пользователя
export const getUserStats = async (userId: number): Promise<any> => {
  try {
    const stats = await db.getFirstAsync(`
      SELECT 
        (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ?) as lessons_completed,
        (SELECT COUNT(*) FROM quiz_results WHERE user_id = ?) as quizzes_completed,
        (SELECT COUNT(DISTINCT language) FROM lesson_progress WHERE user_id = ?) as languages_studied,
        (SELECT MAX(percentage) FROM quiz_results WHERE user_id = ?) as best_quiz_score,
        (SELECT SUM(score) FROM quiz_results WHERE user_id = ?) as total_points,
        (SELECT AVG(time_spent) FROM quiz_results WHERE user_id = ? AND time_spent > 0) as avg_quiz_time,
        (SELECT SUM(time_spent) FROM lesson_progress WHERE user_id = ?) as total_lesson_time,
        (SELECT SUM(time_spent) FROM quiz_results WHERE user_id = ?) as total_quiz_time,
        (SELECT COUNT(*) FROM quiz_results WHERE user_id = ? AND perfect_score = 1) as perfect_scores,
        (SELECT current_streak FROM user_streaks WHERE user_id = ?) as current_streak,
        (SELECT longest_streak FROM user_streaks WHERE user_id = ?) as longest_streak,
        (SELECT COUNT(DISTINCT activity_date) FROM user_activity WHERE user_id = ? AND activity_date >= date('now', '-30 days')) as days_active
    `, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId]);

    if (stats) {
      return {
        lessons_completed: (stats as any).lessons_completed || 0,
        quizzes_completed: (stats as any).quizzes_completed || 0,
        languages_studied: (stats as any).languages_studied || 0,
        best_quiz_score: (stats as any).best_quiz_score || 0,
        total_points: (stats as any).total_points || 0,
        avg_quiz_time: Math.round((stats as any).avg_quiz_time) || 0,
        total_lesson_time: (stats as any).total_lesson_time || 0,
        total_quiz_time: (stats as any).total_quiz_time || 0,
        total_study_time: ((stats as any).total_lesson_time || 0) + ((stats as any).total_quiz_time || 0),
        perfect_scores: (stats as any).perfect_scores || 0,
        current_streak: (stats as any).current_streak || 0,
        longest_streak: (stats as any).longest_streak || 0,
        days_active: (stats as any).days_active || 0
      };
    } else {
      return {
        lessons_completed: 0,
        quizzes_completed: 0,
        languages_studied: 0,
        best_quiz_score: 0,
        total_points: 0,
        avg_quiz_time: 0,
        total_lesson_time: 0,
        total_quiz_time: 0,
        total_study_time: 0,
        perfect_scores: 0,
        current_streak: 0,
        longest_streak: 0,
        days_active: 0
      };
    }
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    throw error;
  }
};

// Улучшенная функция для сохранения результата викторины с временем
export const saveQuizResult = async (userId: number, quizId: number, quizTitle: string, score: number, totalQuestions: number, timeSpent: number): Promise<void> => {
  try {
    const percentage = Math.round((score / totalQuestions) * 100);
    const isPerfect = percentage === 100;
    
    // Сохраняем результат викторины
    await db.runAsync(
      'INSERT INTO quiz_results (user_id, quiz_id, quiz_title, score, total_questions, percentage, time_spent, perfect_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, quizId, quizTitle, score, totalQuestions, percentage, timeSpent, isPerfect ? 1 : 0]
    );

    // Обновляем активность за сегодня
    const today = new Date().toISOString().split('T')[0];
    const existingActivity = await db.getFirstAsync(
      'SELECT * FROM user_activity WHERE user_id = ? AND activity_date = ?',
      [userId, today]
    );

    if (existingActivity) {
      await db.runAsync(
        'UPDATE user_activity SET quizzes_completed = quizzes_completed + 1, total_study_time = total_study_time + ?, points_earned = points_earned + ? WHERE user_id = ? AND activity_date = ?',
        [timeSpent, score * 10, userId, today]
      );
    } else {
      await db.runAsync(
        'INSERT INTO user_activity (user_id, activity_date, quizzes_completed, total_study_time, points_earned) VALUES (?, ?, 1, ?, ?)',
        [userId, today, timeSpent, score * 10]
      );
    }

    // Обновляем streak
    await updateUserStreak(userId);
    console.log('Результат викторины сохранен');
  } catch (error) {
    console.error('Ошибка сохранения результата викторины:', error);
    throw error;
  }
};

// Улучшенная функция для сохранения прогресса урока с временем
export const saveLessonProgress = async (userId: number, lessonId: number, language: string, lessonTitle: string, timeSpent: number, score: number = 100): Promise<void> => {
  try {
    // Проверяем, не завершен ли уже этот урок
    const existingLesson = await db.getFirstAsync(
      'SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ? AND language = ?',
      [userId, lessonId, language]
    );

    if (!existingLesson) {
      // Урок еще не завершен, сохраняем прогресс
      await db.runAsync(
        'INSERT INTO lesson_progress (user_id, lesson_id, language, lesson_title, time_spent, score) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, lessonId, language, lessonTitle, timeSpent, score]
      );

      // Обновляем активность за сегодня
      const today = new Date().toISOString().split('T')[0];
      const existingActivity = await db.getFirstAsync(
        'SELECT * FROM user_activity WHERE user_id = ? AND activity_date = ?',
        [userId, today]
      );

      if (existingActivity) {
        await db.runAsync(
          'UPDATE user_activity SET lessons_completed = lessons_completed + 1, total_study_time = total_study_time + ?, points_earned = points_earned + ? WHERE user_id = ? AND activity_date = ?',
          [timeSpent, score, userId, today]
        );
      } else {
        await db.runAsync(
          'INSERT INTO user_activity (user_id, activity_date, lessons_completed, total_study_time, points_earned) VALUES (?, ?, 1, ?, ?)',
          [userId, today, timeSpent, score]
        );
      }

      // Обновляем streak
      await updateUserStreak(userId);
      console.log('Прогресс урока сохранен');
    } else {
      console.log('Урок уже завершен');
    }
  } catch (error) {
    console.error('Ошибка сохранения прогресса урока:', error);
    throw error;
  }
};

// Функция для обновления streak пользователя
const updateUserStreak = async (userId: number) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const streak = await db.getFirstAsync('SELECT * FROM user_streaks WHERE user_id = ?', [userId]);
    
    if (streak) {
      const lastDate = (streak as any).last_activity_date;
      let newStreak = (streak as any).current_streak;
      
      if (lastDate === yesterday) {
        // Продолжаем streak
        newStreak = (streak as any).current_streak + 1;
      } else if (lastDate !== today) {
        // Начинаем новый streak
        newStreak = 1;
      }
      
      const newLongest = Math.max((streak as any).longest_streak, newStreak);
      
      await db.runAsync(
        'UPDATE user_streaks SET current_streak = ?, longest_streak = ?, last_activity_date = ? WHERE user_id = ?',
        [newStreak, newLongest, today, userId]
      );
    }
  } catch (error) {
    console.error('Ошибка обновления streak:', error);
  }
};

// Остальные функции...
export const getUserQuizResults = async (userId: number): Promise<any[]> => {
  try {
    const results = await db.getAllAsync('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY completed_at DESC', [userId]);
    return results || [];
  } catch (error) {
    console.error('Ошибка получения результатов викторин:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: number, name: string, email: string): Promise<void> => {
  try {
    await db.runAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    console.log('Профиль пользователя обновлен');
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    throw error;
  }
};

export const getUserAchievements = async (userId: number): Promise<string[]> => {
  try {
    const achievements = await db.getAllAsync('SELECT achievement_type FROM achievements WHERE user_id = ?', [userId]);
    return (achievements || []).map((a: any) => a.achievement_type);
  } catch (error) {
    console.error('Ошибка получения достижений:', error);
    throw error;
  }
};

export const unlockAchievement = async (userId: number, achievementType: string, achievementTitle: string): Promise<void> => {
  try {
    const existing = await db.getFirstAsync(
      'SELECT id FROM achievements WHERE user_id = ? AND achievement_type = ?',
      [userId, achievementType]
    );

    if (!existing) {
      await db.runAsync(
        'INSERT INTO achievements (user_id, achievement_type, achievement_title) VALUES (?, ?, ?)',
        [userId, achievementType, achievementTitle]
      );
      console.log('Достижение разблокировано:', achievementType);
    }
  } catch (error) {
    console.error('Ошибка разблокировки достижения:', error);
    throw error;
  }
}; 