from openai import OpenAI
import os
from dotenv import load_dotenv
import time
from findRecs import findRecs
import re
from io import BytesIO

# Load the environment variables from .env file where your OpenAI API key is stored
load_dotenv()

#We need to upload the file so that our model is able to analyze on these pdfs 
def upload_file_to_openai(file_content, file_name):
    if not file_name.endswith('.pdf'):
        file_name += '.pdf'
    file_like_object = BytesIO(file_content)
    file_like_object.name = file_name
    try:
        response = client.files.create(file=file_like_object, purpose='assistants')
        file_like_object.close()
        return response.id
    except client.error.OpenAIError as e:
        print(f"An error occurred: {e}")
        return None

# Function to call OpenAI Assistant and get the response
def get_assistant_response(assistant_id, file_ids):
    prompt = '''Please use the answer key provided to grade the students homework which should be the file that is just numbered problems. 
            In addition, the PracticeProblems provides all of the problems. In addition, please note down the areas where the student 
            might not be understanding the material and provide constructive feedback to areas of improvement for the student. 
            At the end, please return just a score, areas where the student is struggling and why, and then a list of topics that the student should look into. 
            The format of the headers of the response should follow the following format word for word. Score: and then Feedback: and then List of Areas to Review. 
            Can we have the List of Areas to Review just be a list of numbered topics that the student should look into. It should only be the topic in quotes. For example it could look like this:
            List of Areas to Review: 1. "Geometry" 2. "Algebra" etc etc. 
            The score should just be a percentage between 0 and 100 symbolizing their accuracy. 
            Feedback should provide a detailed analysis on every problem that appears to be incorrect. Please write it in the perspective of a teacher instructing a student on areas to improve. Be warm!
            In addition, make sure that it's directly just Feedback: and then a numbered list of the feedback per question.
            Make sure the areas to review are very specific and can be used to find video resources to supplement learning.'''
    try:
        my_assistant = client.beta.assistants.update(
            assistant_id=assistant_id,
            file_ids=file_ids
        )
        print("Assistant updated with file IDs")
        my_assistant = client.beta.assistants.retrieve(assistant_id)
        print("Assistant retrieved")
        thread = client.beta.threads.create()
        print("Thread created")
        message = client.beta.threads.messages.create(
              thread_id=thread.id, # thread id from the above instance
              role="user",
              content=prompt)
        print("Message created")
        run = create_assistant_run(client,my_assistant,thread,"")
        print("Run created")
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

# Main function to tie everything together
def process_pdfs_and_generate_feedback(assistant_id, pdf_objects):
    # This function will receive a list of binary PDF data and filenames
    file_ids = []
    for pdf_object, filename in pdf_objects:
        file_id = upload_file_to_openai(pdf_object, filename)
        if file_id:
            file_ids.append(file_id)
    
    if file_ids:
        response = get_assistant_response(assistant_id, file_ids)
        return response
    else:
        print("Failed to upload files, no IDs to proceed with.")
        return None

def extract_score(text):
    # Pattern to capture a percentage number (including decimals) following the "Score:" label
    # Handles multiple variations of the label
    pattern = (
        r'(?:\*\*Score:\*\*|assistant:Score:|Score:|score:|\bScore\b)\s*(\d+\.?\d*%)'
    )
    match = re.search(pattern, text)

    # Return the captured score percentage if a match is found
    return match.group(1) if match else None

def extract_feedback(text):
    # Define the pattern to find the feedback section, capturing all content after "Feedback:" until "List of Areas to Review:" or the end of the text
    pattern = r'\*\*Feedback:\*\*(.*?)(?:\n\*\*List of Areas to Review:\*\*|$)'
    feedback_section_match = re.search(pattern, text, re.DOTALL)

    if feedback_section_match:
        feedback_section = feedback_section_match.group(1)
        # Split the feedback section into individual items, starting with a number followed by a period
        feedback_items = re.split(r'\n(?=\d+\.\s)', feedback_section)
        # Clean up each feedback item, removing leading and trailing whitespace
        feedback_items = [item.strip() for item in feedback_items if item.strip()]
        return feedback_items

    return []

def clean_feedback(feedback_list):
    # Removing source references like   from each feedback string
    cleaned_feedback = [re.sub(r'【\d+†source】', '', feedback).strip() for feedback in feedback_list]
    return cleaned_feedback

def extract_review_areas(text):
    # Pattern to find quoted topic names in the "List of Areas to Review" section
    pattern = r'\d+\.\s*"([^"]+)"'
    topics = re.findall(pattern, text)

    return topics

# Example usage
def gradingChecker(pdf_objects):
    # Initialize your OpenAI API key
    load_dotenv()
    SECRET_KEY = os.getenv("OPEN_AI_KEY")
    global client
    client = OpenAI(api_key = SECRET_KEY)
    assistant_id = 'asst_yxuSKnyE945ffRG2EeiNiFHc'
    print("got here")
    print("number of objects", len(pdf_objects))
    result = process_pdfs_and_generate_feedback(assistant_id, pdf_objects)
    topics = extract_review_areas(result)
    print("HERE ARE THE TOPICS")
    print(topics)
    filtered_topics = [topic for topic in topics if topic not in ['Geometry', 'Algebra']]
    print("Here are the filtered topics")
    print(filtered_topics)
    recommendations = []
    for topic in filtered_topics: #this might be the worst way to do this hahaha
        recommendations_string = findRecs(topic)
        print(f"Recommendations for {topic}: {recommendations_string}")
        recommendations.append(recommendations_string)
    score = extract_score(result)
    feedback = extract_feedback(result) 
    print("here's the feedback",feedback)
    cleaned_feedback = clean_feedback(feedback)
    print(f"Score: {score}")
    print(f"Feedback: {cleaned_feedback}")
    return score, cleaned_feedback, recommendations

    
