import uvicorn
from app.main import app

def main():
    print("Starting ai-service on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001)

if __name__ == "__main__":
    main()
