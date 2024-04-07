import sys
from duckduckgo_search import DDGS
from duckduckgo_search import exceptions as ddgs_exceptions
import json

def search_duckduckgo(prompt):
    try: 
        # Search for video results
        video_results = DDGS().videos(f"Tutorials on {prompt}", max_results=5)

        # Filter out only YouTube video URLs
        youtube_videos = [(result['title'], result['content']) for result in video_results if 'youtube.com' in result['content']]

        # Convert the list to JSON format
        json_data = json.dumps(youtube_videos, indent=2)
        return json_data
    except ddgs_exceptions.DuckDuckGoSearchException as e: 
        print(f"An error occurred: {e}")
        return None


def findRecs(prompt):
    print("entered findRecs")
    result = search_duckduckgo(prompt)
    return result

