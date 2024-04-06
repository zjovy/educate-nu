import sys
from duckduckgo_search import DDGS
import json

def search_duckduckgo(prompt):
    # Search for text results
    text_results = DDGS().text(f"Tutorials on {prompt}", max_results=5)

    # Search for video results
    video_results = DDGS().videos(f"Tutorials on {prompt}", max_results=5)

    # Extract URLs from text results
    text_urls = [result['href'] for result in text_results]

    # Extract URLs from video results
    video_urls = [result['content'] for result in video_results]

    # Combine URLs from both text and video results
    all_urls = text_urls + video_urls

    # Remove duplicates
    unique_urls = list(set(all_urls))

    # Convert the list to JSON format
    json_data = json.dumps(unique_urls, indent=2)
    return json_data

def main(prompt):
    result = search_duckduckgo(prompt)
    return result

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py prompt")
        sys.exit(1)
    
    prompt = sys.argv[1]
    main(prompt)