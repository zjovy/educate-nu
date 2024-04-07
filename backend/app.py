from http.client import HTTPException
from fastapi import FastAPI, HTTPException, File, UploadFile, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from gradingChecker import gradingChecker,process_pdfs_and_generate_feedback, extract_score, extract_feedback, extract_review_areas, clean_feedback, findRecs

import requests
import os

from pydantic import BaseModel
from httpx import AsyncClient

app = FastAPI()

# Add this middleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=env_path)

# Kintone API endpoint and credentials

KINTONE_DOMAIN = "education-nu.kintone.com"
ASSIGNMENTS_TOKEN = os.environ.get("ASSIGNMENTS_TOKEN")
COURSES_TOKEN = os.environ.get("COURSES_TOKEN")
ENROLLMENTS_TOKEN = os.environ.get("ENROLLMENTS_TOKEN")
PEOPLE_TOKEN = os.environ.get("PEOPLE_TOKEN")
SUBMISSIONS_TOKEN = os.environ.get("SUBMISSIONS_TOKEN")
ASSIGNMENTS_ID = os.environ.get("ASSIGNMENTS_ID")
COURSES_ID = os.environ.get("COURSES_ID")
SUBMISSIONS_ID = os.environ.get("SUBMISSIONS_ID")
PEOPLE_ID = os.environ.get("PEOPLE_ID")
ENROLLMENTS_ID = os.environ.get("ENROLLMENTS_ID")

class GradingData(BaseModel):
    ASSIGNMENT_NAME: str

async def fetch_data(client, url):
    response = await client.get(url)
    response.raise_for_status()  # Will raise an exception for HTTP errors
    return response.json()

async def download_submission_file(client, file_key, file_name):
    download_url = f"/submissionFiles/?fileKey={file_key}&fileName={file_name}"
    response = await client.get(download_url)
    response.raise_for_status()
    return response.content, file_name

async def download_assignment_file(client, file_key, file_name):
    download_url = f"/assignmentFiles/?fileKey={file_key}&fileName={file_name}"
    response = await client.get(download_url)
    response.raise_for_status()
    return response.content, file_name

@app.post("/grade")
async def grade_pdfs(data: GradingData):
    if not data.ASSIGNMENT_NAME:
        raise HTTPException(status_code=400, detail="Missing ASSIGNMENT_NAME")

    base_url = "http://127.0.0.1:8000"  # Replace with the actual base URL if different
    all_files = []  # This should be used to collect all file contents

    async with AsyncClient(base_url=base_url) as client:
        assignments_data = await fetch_data(client, "/assignments/")
        matching_submission = next((item for item in assignments_data['records'] if item.get('title', {}).get('value') == data.ASSIGNMENT_NAME), None)
        
        if matching_submission:
            assignment_id = matching_submission['assignment_id']['value']
        else:
            raise HTTPException(status_code=404, detail="Assignment not found")
        print("Assignment ID:", assignment_id)
        # Fetch assignment files
        for record in assignments_data['records']:
            if record['assignment_id']['value'] == assignment_id:
                for file_info in record['problems']['value']:
                    file_key = file_info['fileKey']
                    file_name = file_info['name']
                    content, _ = await download_assignment_file(client, file_key, file_name)
                    all_files.append((content,file_name))
                for file_info in record['solutions']['value']:
                        file_key = file_info['fileKey']
                        file_name = file_info['name']
                        content, _ = await download_assignment_file(client, file_key, file_name)
                        all_files.append((content,file_name))
        # Fetch submission files
        print("length of all_files", len(all_files))
        submissions_data = await fetch_data(client, "/submissions/")
        for submission in submissions_data['records']:
            if submission['assignment_id']['value'] == assignment_id:
                for file_info in submission['attempt']['value']:
                    file_key = file_info['fileKey']
                    file_name = file_info['name']
                    content, _ = await download_submission_file(client, file_key, file_name)
                    all_files.append((content,file_name))
        print("second length of all_files", len(all_files))
    
        # Assuming gradingChecker is a function that can process all_files
        [score, feedback, review_areas] = gradingChecker(all_files)
        print(score)
        print(feedback)
        print(review_areas)
        
        # Construct and return a response
        return {
            "score": score,
            "feedback": feedback,
            "review_areas": review_areas
        }

@app.get("/")
async def read_root():
    return {"message": "Hello from FastAPI"}

@app.get("/assignments/")
async def assignments():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={ASSIGNMENTS_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": ASSIGNMENTS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)
    
@app.get("/submissions/")
async def assignments():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={SUBMISSIONS_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": SUBMISSIONS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)
    
    
@app.get("/assignmentFiles/")
async def assignmentFiles(fileKey: str, fileName: str):
    url = f"http://{KINTONE_DOMAIN}/k/v1/file.json?fileKey={fileKey}"
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": ASSIGNMENTS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print(response)
        return Response(content=response.content, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={fileName}.pdf"})
    else:       
        error_message = response.json().get("message")
        raise HTTPException(status_code=response.status_code, detail=error_message)

@app.get("/submissionFiles/")
async def assignmentFiles(fileKey: str, fileName: str):
    url = f"http://{KINTONE_DOMAIN}/k/v1/file.json?fileKey={fileKey}"
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": SUBMISSIONS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        print(response)
        return Response(content=response.content, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={fileName}.pdf"})
    else:       
        error_message = response.json().get("message")
        raise HTTPException(status_code=response.status_code, detail=error_message)


@app.get("/courses/")
async def courses():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={COURSES_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": COURSES_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)

@app.get("/enrollments/")
async def enrollments():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={ENROLLMENTS_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": ENROLLMENTS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)
    
@app.get("/people/")
async def people():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={PEOPLE_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": PEOPLE_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)
    
@app.get("/submissions/")
async def submissions():
    url = f"http://{KINTONE_DOMAIN}/k/v1/records.json?app={SUBMISSIONS_ID}"
    
    headers = {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": SUBMISSIONS_TOKEN,
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
                
        error_message = response.json().get("message")
        
        raise HTTPException(status_code=response.status_code, detail=error_message)
