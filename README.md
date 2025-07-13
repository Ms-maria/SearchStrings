# DNA Pattern Search Backend

FastAPI сервер для поиска шаблонов в DNA последовательностях с C++ модулем

## Установка и запуск

1. Клонировать репозиторий:
```bash
git clone https://github.com/Ms-maria/SearchStrings.git
```

2. Установить зависимости:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

3. Собрать C++ модуль:
```bash
python setup.py build_ext --inplace
```

## Запуск

```bash
uvicorn src.main:app --reload
```

## 🚀 Запуск через Docker

```bash
# Сборка и запуск
docker-compose up --build

# Остановка
docker-compose down
```

## API Endpoints

- `POST /api/search` - поиск шаблонов
