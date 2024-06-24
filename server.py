import http.server
import socketserver
import cgi
import json

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        # Parse the form data posted
        ctype, pdict = cgi.parse_header(self.headers['Content-Type'])
        
        if ctype == 'multipart/form-data':
            pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
            content_length = int(self.headers['Content-Length'])
            pdict['CONTENT-LENGTH'] = content_length
            fields = cgi.parse_multipart(self.rfile, pdict)
            
            # Extract the fields
            esn = fields.get('esn')
            imsi = fields.get('imsi')
            model = fields.get('model')
            wifi_req_zip = fields.get('WIFI_Req_Zip')
            wifi_file = fields.get('WIFI_Nexus_5X_111.zip')
            
            # Print the extracted fields
            print(f"esn: {esn}")
            print(f"imsi: {imsi}")
            print(f"model: {model}")
            print(f"WIFI_Req_Zip: {wifi_req_zip}")
            print(f"WIFI_Nexus_5X_111.zip: {wifi_file}")
            
            # Here you can handle the uploaded file (wifi_file)
            if wifi_file:
                with open("uploaded_wifi.zip", "wb") as f:
                    f.write(wifi_file[0])
            
            # Create a JSON response indicating success
            response = {
                "status": "200"
            }
            self.send_response(200)  # Return HTTP status code 200
        else:
            response = {
                "status": "error",
                "message": "Unsupported content type"
            }
            self.send_response(400)  # Return HTTP status code 400 for bad request
        
        # Send response back to the client
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

# Specify the interface (IP address) and port
interface = '192.168.x.x'  # Replace with your specific IP address
port = 8000

# Create the server with the custom handler
with socketserver.TCPServer((interface, port), CustomHTTPRequestHandler) as httpd:
    print(f"Serving on {interface}:{port}")
    httpd.serve_forever()
