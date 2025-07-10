import sys
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict
from fastapi.middleware.cors import CORSMiddleware
sys.path.append("D:\\projects\\SearchStrings\\pythonBackend")
import find_module  # Наш C++ модуль

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    field1: Optional[str] = None
    field2: Optional[str] = None
    field3: Optional[str] = None

class PatternMatch(BaseModel):
    pattern: str
    count: int

class LineResult(BaseModel):
    id: int
    text: str
    matches: List[PatternMatch]

class SearchResponse(BaseModel):
    results: List[LineResult]
    patterns: List[str]


@app.post("/api/search", response_model=SearchResponse)
async def search_items(payload: SearchQuery):
    patterns = []
    if payload.field1:
        patterns.append(payload.field1.upper())
    if payload.field2:
        patterns.append(payload.field2.upper())
    if payload.field3:
        patterns.append(payload.field3.upper())
    if not patterns:
        return SearchResponse(results=[], patterns=[])

    filename = "database.txt"
    cpp_results = find_module.search_patterns(filename, patterns)

    formatted_results = []
    for result in cpp_results:
        matches = [
            {"pattern": f"Шаблон {i + 1}", "count": result.pattern_matches[pattern]}
            for i, pattern in enumerate(patterns)
            if result.pattern_matches[pattern] > 0
        ]

        if matches:
            formatted_results.append({
                "id": result.line_id,
                "text": result.text,
                "matches": matches
            })

    return SearchResponse(
        results=formatted_results,
        patterns=[f"Шаблон {i + 1}" for i in range(len(patterns))]
    )