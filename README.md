Полнофункциональная система на основе Remult framework с email-верификацией.

## 🚀 Возможности

- ✅ Аутентификация по email с кодом верификации (6-значный код)
- ✅ Безопасное хранение паролей (bcrypt с 12 раундами)
- ✅ JWT токены для авторизации
- ✅ Ограничение количества попыток (3 кода в час, 3 попытки ввода)
- ✅ Отправка email уведомлений через SMTP
- ✅ Логирование и мониторинг
- ✅ Docker поддержка
- ✅ PostgreSQL с отдельной схемой
- ✅ Admin панель Remult

## 📋 Системные требования

- Node.js 18+
- PostgreSQL 13+
- SMTP сервер (Gmail/Yandex/Mail.ru)

## ⚡ Быстрый старт

### 1. Установка зависимостей
```bash
git clone <your-repo>
cd remult-auth-system
npm install
```

### 2. Настройка окружения
Создайте файл `.env` на основе примера:
```bash
cp .env.example .env
```

**Обязательно настройте:**
- `DATABASE_URL` - строка подключения к PostgreSQL
- `SMTP_USER` и `SMTP_PASS` - данные SMTP сервера
- `JWT_SECRET` - секретный ключ (32+ символов)

### 3. Настройка PostgreSQL

**Вариант A: Docker (рекомендуется)**
```bash
# Запуск PostgreSQL в контейнере
docker-compose up -d db

# Создание схемы
docker exec -it <container-id> psql -U user -d auth -c "CREATE SCHEMA IF NOT EXISTS auth;"
```

**Вариант B: Локальная установка**
```bash
# Подключение к PostgreSQL
psql -U postgres

# Выполните в psql:
CREATE DATABASE auth;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE auth TO user;
\c auth;
CREATE SCHEMA IF NOT EXISTS auth;
GRANT ALL ON SCHEMA auth TO user;
```

### 4. Тестирование и запуск
```bash
# Проверка подключений
npm run test-connections

# Миграция БД (создание таблиц)
npm run migrate

# Запуск в режиме разработки
npm run dev
```

### Admin панель
```
GET /api/admin
```
Доступна только в режиме разработки для просмотра данных.

## 🗂️ Необходимые файлы

**Основные файлы:**
- `src/` - весь исходный код
- `package.json` - зависимости и скрипты
- `tsconfig.json` - конфигурация TypeScript
- `Dockerfile` - для продакшн сборки
- `docker-compose.yml` - для локальной разработки
- `.env` - переменные окружения

## 🚀 Команды разработки

```bash
# Разработка
npm run dev                # Запуск с hot-reload
npm run test-connections   # Проверка подключений БД и SMTP
npm run migrate           # Создание/обновление таблиц БД

# Продакшн
npm run build             # Компиляция TypeScript
npm start                 # Запуск скомпилированного кода

# Тестирование
npm test                  # Запуск тестов
```

## 🐳 Docker

```bash
# Только БД для разработки
docker-compose up -d db

# Полный стек для продакшн
docker-compose up -d
```

## 🔐 Безопасность

- Пароли хешируются с помощью bcrypt (12 раундов)
- JWT токены с истечением срока действия
- Ограничение количества попыток
- Валидация email и сложности паролей
- Защита от CSRF через токены
- Логирование всех операций

## 🐛 Отладка

Проверьте логи при проблемах:
- Подключение к БД: `npm run test-connections`
- Уровень логирования: установите `LOG_LEVEL=3` в `.env`
- SMTP: проверьте настройки и App Password для Gmail

## 📚 Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `DATABASE_URL` | Строка подключения PostgreSQL | - |
| `SMTP_HOST` | SMTP сервер | smtp.gmail.com |
| `SMTP_PORT` | Порт SMTP | 587 |
| `SMTP_USER` | Логин SMTP | - |
| `SMTP_PASS` | Пароль SMTP (App Password) | - |
| `JWT_SECRET` | Секрет для JWT | - |
| `PORT` | Порт приложения | 3000 |
| `NODE_ENV` | Окружение | development |
| `LOG_LEVEL` | Уровень логов (0-3) | 2 |