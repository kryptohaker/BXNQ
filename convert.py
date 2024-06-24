import sys

def hex_to_ascii(hex_str):
    bytes_obj = bytes.fromhex(hex_str)
    ascii_str = bytes_obj.decode("utf-8", errors="replace")
    return ascii_str

def process_file(input_file_path, output_file_path):
    with open(input_file_path, 'r') as infile, open(output_file_path, 'w') as outfile:
        for line in infile:
            if line.startswith('Decrypted Data:'):
                hex_str = line.split('Decrypted Data: ')[1].strip()
                ascii_str = hex_to_ascii(hex_str)
                outfile.write(ascii_str + '\n')
    
    print(f"Processed data has been written to {output_file_path}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert.py input_file_path output_file_path")
        sys.exit(1)

    input_file_path = sys.argv[1]
    output_file_path = sys.argv[2]

    process_file(input_file_path, output_file_path)
