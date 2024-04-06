from openai import OpenAI
import os
import pdfplumber
import json
from pathlib import Path
from dotenv import load_dotenv
import time
# Load the environment variables from .env file where your OpenAI API key is stored
load_dotenv()

#We need to upload the file so that our model is able to analyze on these pdfs 
def upload_file_to_openai(file_path):
    file_list = []
    try:
        with open(file_path, 'rb') as file:
            response = client.files.create(file=file, purpose='assistants')  # The purpose might need to be changed based on the specific API endpoint you're using
            # Consider cleaning up the .jsonl file after uploading if you don't need it locally=
            return response.id
    except client.error.OpenAIError as e:
        print(f"An error occurred: {e}")
        return None, None

# Function to call OpenAI Assistant and get the response
def get_assistant_response(assistant_id, file_ids):
    prompt = '''Please use the answer key provided to grade the students homework which should be the file that is just numbered problems. 
            In addition, the PracticeProblems provides all of the problems. In addition, please note down the areas where the student 
            might not be understanding the material and provide constructive feedback to areas of improvement for the student. 
            At the end, please return just a score, areas where the student is struggling and why, and then a list of topics that the student should look into. 
            The format should be Score: and then Areas of Improvement: and then List of Areas to Review: '''
    try:
        my_assistant = client.beta.assistants.update(
            assistant_id=assistant_id,
            file_ids=file_ids
        )
        my_assistant = client.beta.assistants.retrieve(assistant_id)
        thread = client.beta.threads.create()
        message = client.beta.threads.messages.create(
              thread_id=thread.id, # thread id from the above instance
              role="user",
              content=prompt)
        run = create_assistant_run(client,my_assistant,thread,"")
        run_status = client.beta.threads.runs.retrieve(
            thread_id = thread.id,
            run_id = run.id)
        loop_until_completed(client, thread, run_status)
        return print_thread_messages(client, thread)
    except client.error.OpenAIError as e:
        print(f"An error occurred: {e}")
        return None

def loop_until_completed(clnt: object, thrd: object, run_obj: object) -> None:
    """
    Poll the Assistant runtime until the run is completed or failed
    """
    while run_obj.status not in ["completed", "failed", "requires_action"]:
        run_obj = clnt.beta.threads.runs.retrieve(
            thread_id = thrd.id,
            run_id = run_obj.id)
        time.sleep(10)
        print(run_obj.status)

def create_assistant_run(clnt: object, asst: object, thrd: object,
                         message:str) -> object:
    """
    Creates an Assistant run.
    """
    run = clnt.beta.threads.runs.create(
    thread_id=thrd.id,
    assistant_id=asst.id,
    instructions= message
)
    return run

def print_thread_messages(clnt: object, thrd: object, content_value: bool=True) -> None:
    """
    Prints OpenAI thread messages to the console.
    """
    messages = clnt.beta.threads.messages.list(
        thread_id = thrd.id)
    response_string = ""
    for msg in messages:
        if content_value:
            response_string += msg.role + ":" + msg.content[0].text.value +"\n"
            print(msg.role + ":" + msg.content[0].text.value)
        else: 
            response_string += msg + "\n"
            print(msg)
    return response_string

# Function to save the API response to a file
def save_response_to_file(response, file_name='response.txt'):
    if response:
        with open(file_name, 'w') as file:
            file.write(response)
    else:
        print("No response received to save.")

# Main function to tie everything together
def process_pdfs_and_generate_feedback(assistant_id, pdf_paths):
    file_ids = [upload_file_to_openai(pdf_path) for pdf_path in pdf_paths if upload_file_to_openai(pdf_path) is not None]
    print(file_ids)
    if file_ids:
        response = get_assistant_response(assistant_id, file_ids)
        save_response_to_file(response)
    else:
        print("Failed to upload files, no IDs to proceed with.")

# Example usage
if __name__ == "__main__":
    # Initialize your OpenAI API key
    load_dotenv()
    SECRET_KEY = os.getenv("OPEN_AI_KEY")
    client = OpenAI(api_key = SECRET_KEY)
    # You need to replace 'your-assistant-id' with the actual ID of your assistant
    assistant_id = 'asst_yxuSKnyE945ffRG2EeiNiFHc'
    
    pdf_paths = ['/Users/Isaac/Desktop/StudentHomework.pdf', '/Users/Isaac/Desktop/PracticeProblems.pdf', '/Users/Isaac/Desktop/AnswerKey.pdf']  # Replace with your actual PDF file paths
    process_pdfs_and_generate_feedback(assistant_id, pdf_paths)
