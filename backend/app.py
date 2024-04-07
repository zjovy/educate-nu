from fastapi import FastAPI, HTTPException, Request
from gradingChecker import process_pdfs_and_generate_feedback, extract_score, extract_feedback, extract_review_areas, clean_feedback, findRecs
from pydantic import BaseModel

class GradingData(BaseModel):
    assistant_id: str
    pdf_paths: list[str]

app = FastAPI()

@app.post("/grade")
async def grade_pdfs(data: GradingData):
    if not data.assistant_id or not data.pdf_paths:
        raise HTTPException(status_code=400, detail="Missing assistant_id or pdf_paths")

    result = process_pdfs_and_generate_feedback(data.assistant_id, data.pdf_paths)
    
    if result:
        score = extract_score(result) or "100%"
        feedback = extract_feedback(result)
        cleaned_feedback = clean_feedback(feedback)
        topics = extract_review_areas(result)
        filtered_topics = [topic for topic in topics if topic not in ['Geometry', 'Algebra']]
        recommendations = {topic: findRecs(topic) for topic in filtered_topics}

        response = {
            "score": score,
            "feedback": cleaned_feedback,
            "recommendations": recommendations
        }
        return response
    else:
        raise HTTPException(status_code=500, detail="Error processing PDFs")

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI"}
