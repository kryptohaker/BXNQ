import re
import sys

def extract_file_from_request(request_file):
    # Read the request file in binary mode
    with open(request_file, 'rb') as file:
        request_data = file.read()
    
    # Decode the request data to a string for regex processing
    request_text = request_data.decode('latin1')
    
    # Use regex to find the filename
    filename_match = re.search(r'filename="([^"]+)"', request_text)
    if not filename_match:
        print("Filename not found in the request.")
        return
    
    filename = filename_match.group(1)
    print(f"Extracted filename: {filename}")

    # Determine the type of the file by its signature and extract content
    if filename.endswith('.zip'):
        # ZIP files start with PK\x03\x04
        file_content_match = re.search(rb'(PK\x03\x04.*?)(?=-------------------------)', request_data, re.DOTALL)
        if not file_content_match:
            print("ZIP content not found in the request.")
            return
        
        file_content = file_content_match.group(1)
    elif filename.endswith('.tar.gz') or filename.endswith('.tgz'):
        # GZIP files start with \x1f\x8b\x08
        file_content_match = re.search(rb'(\x1f\x8b\x08.*?)($|(?=-------------------------))', request_data, re.DOTALL)
        if not file_content_match:
            print("TAR.GZ content not found in the request.")
            return
        
        file_content = file_content_match.group(1)
    else:
        print("Unsupported file format.")
        return
    
    # Save the extracted content to the file
    with open(filename, 'wb') as file:
        file.write(file_content)
    
    print(f"File saved as {filename}")

if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] != '-r':
        print("Usage: python recover.py -r request.rq")
        sys.exit(1)
    
    request_file = sys.argv[2]
    extract_file_from_request(request_file)
