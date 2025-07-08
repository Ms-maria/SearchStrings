from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re  # Для более сложного поиска

# Пример "базы данных" (только id и text)
database = [
    {"id": 1, "text": "Красная машина стоит на дороге"},
    {"id": 2, "text": "Синий грузовик едет по шоссе"},
    {"id": 3, "text": "Велосипед припаркован у дома"},
    {"id": 4, "text": "Дорога закрыта для машин и грузовиков"}
]

class SearchQuery(BaseModel):
    field1: Optional[str] = None
    field2: Optional[str] = None
    field3: Optional[str] = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Разрешаем все методы, включая OPTIONS
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

class SearchResult(BaseModel):
    id: int
    text: str
    matches: List[int]  # Количество совпадений для каждого запроса


@app.post("/api/search", response_model=List[SearchResult])
async def search_items(payload: SearchQuery):
    queries = []
    if payload.field1 and payload.field1.strip():
        queries.append(payload.field1.strip().lower())
    if payload.field2 and payload.field2.strip():
        queries.append(payload.field2.strip().lower())
    if payload.field3 and payload.field3.strip():
        queries.append(payload.field3.strip().lower())

    if not queries:
        return []

    results = []
    for item in database:
        text_lower = item["text"].lower()
        matches = []
        total_matches = 0

        for query in queries:
            count = len(re.findall(re.escape(query), text_lower))
            matches.append(count)
            total_matches += count

        if total_matches > 0:
            results.append({
                "id": item["id"],
                "text": item["text"],
                "matches": matches
            })

    return sorted(results, key=lambda x: sum(x["matches"]), reverse=True)