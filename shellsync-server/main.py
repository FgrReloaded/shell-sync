from app import start_server

app = start_server()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
