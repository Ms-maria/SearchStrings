# Этап сборки C++ модуля
FROM python:3.11 as builder

RUN apt-get update && \
    apt-get install -y build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY src/FindModule.cpp src/setup.py ./

RUN python setup.py build_ext --inplace

# Финальный образ
FROM python:3.11-slim
WORKDIR /app

# Копируем собранный модуль (имя файла может отличаться для 3.11)
COPY --from=builder /app/find_module.cpython-311-x86_64-linux-gnu.so ./src/
COPY src/requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]