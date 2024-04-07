import sys
from duckduckgo_search import DDGS
from duckduckgo_search import exceptions as ddgs_exceptions
import json

def search_duckduckgo(prompt):
    try: 
        # Search for video results
        video_results = DDGS().videos(f"Tutorials on {prompt}", max_results=5)

        # Get just the prompt
        youtube_prompt = f"Tutorials on {prompt}"

        # Construct a list of tuples containing title and URL
        youtube_videos = [
            (result['title'], result['content'])
            for result in video_results if 'youtube.com' in result['content']
        ]

        # Construct dictionary with prompt and list of tuples
        data = {
            "prompt": youtube_prompt,
            "videos": youtube_videos
        }

        # Convert dictionary to JSON format
        json_data = json.dumps(data, indent=2)
        return json_data
    except ddgs_exceptions.DuckDuckGoSearchException as e: 
        print(f"An error occurred: {e}")
        return None


def findRecs(prompt):
    print("entered findRecs")
    result = search_duckduckgo(prompt)
    return result

def main():
    # Check if the prompt is provided as a command-line argument
    if len(sys.argv) != 2:
        print("Usage: python script.py <prompt>")
        sys.exit(1)

    prompt = sys.argv[1]

    print(f"Searching for tutorials on {prompt}...")
    result = findRecs(prompt)
    if result:
        print("Search successful!")
        print("Data returned:")
        print(result)
    else:
        print("Search failed. Please try again.")

if __name__ == "__main__":
    main()
