from http.client import HTTPException
from fastapi import FastAPI, HTTPException, File, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import requests
import os

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


@app.post("/people/")
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
    
    
    