import sys
from duckduckgo_search import DDGS
import json

# results = DDGS().text("python programming", max_results=5)
# print(results)

def search_duckduckgo(prompt):
    results = DDGS().text(f"Tutorials on {prompt}", max_results=5)
    href_values = [result['href'] for result in results]
    json_data = json.dumps(href_values, indent=2)
    print(json_data)
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