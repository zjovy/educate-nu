from http.client import HTTPException
from fastapi import FastAPI, HTTPException, File, UploadFile, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from gradingChecker import gradingChecker,process_pdfs_and_generate_feedback, extract_score, extract_feedback, extract_review_areas, clean_feedback, findRecs
from pydantic import BaseModel
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

class GradingData(BaseModel):
    assistant_id: str
    pdf_paths: list[str]
    ASSIGNMENT_NAME: str

app = FastAPI()

@app.post("/grade")
async def grade_pdfs(data: GradingData):
    if not data.assistant_id or not data.ASSIGNMENT_NAME:
        raise HTTPException(status_code=400, detail="Missing assistant_id or ASSIGNMENT_NAME")

    assignments_data = await assignments()  # Assuming this function returns a JSON with assignments data
    matching_assignment = next((item for item in assignments_data['records'] if item['title']['value'] == data.ASSIGNMENT_NAME), None)

    if not matching_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    assignment_id = matching_assignment['assignment_id']['value']
    all_files = []  # This should be used to collect all file contents

    # We want to iterate over the fetched assignments data to find the specific assignment and its files
    for record in assignments_data['records']:
        if record['assignment_id']['value'] == assignment_id:
            # Assume 'problems' contains the files related to the assignment, adjust as needed
            for file_info in record['problems']['value']:
                file_key = file_info['fileKey']
                file_name = file_info['name']  # Use the original file name from the record
                file_response = await assignmentFiles(file_key, file_name)
                all_files.append(file_response.content)  # Append the file content to the all_files list

    # Richard I need you to get out the submissions file and append it to all_files here. I have no idea how to do it. 

    
    # We need to get the submission files for the students too 
    [score, feedback, review_areas] = gradingChecker(all_files)


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
    
