from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = "data"


class QueryRequest(BaseModel):
    question: str


# Mock responses for demonstration
MOCK_RESPONSES = {
    "what is mern": "MERN is a full-stack JavaScript framework consisting of MongoDB, Express.js, React.js, and Node.js. It's used for building modern web applications with a unified JavaScript codebase.",
    "how to install node": "To install Node.js, visit nodejs.org and download the LTS version for your operating system. Follow the installation wizard to set it up on your machine.",
    "what is react": "React is a JavaScript library for building user interfaces, particularly web applications. It allows developers to create reusable UI components and manage application state efficiently.",
    "mongodb connection": "To connect to MongoDB, use the connection string from your MongoDB Atlas dashboard or local MongoDB instance. In Node.js, use mongoose with: mongoose.connect('your-connection-string')",
    "express setup": "To set up Express.js, install it with 'npm install express', then create an app.js file and initialize with: const app = express(); app.listen(3000);",
    "what is express": "Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
    "how to use mongoose": "Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It provides schema-based solutions and makes working with MongoDB easier.",
    "react components": "React components are the building blocks of React applications. They can be functional or class-based and encapsulate UI logic and rendering.",
    "node modules": "Node modules are reusable pieces of code that can be imported into your Node.js applications. They are installed via npm and stored in node_modules folder.",
    "database connection": "Database connections in MERN stack typically use MongoDB with Mongoose ODM. Always handle connection errors and use environment variables for sensitive data."
}


@app.get("/")
def root():
    pdf_count = len(list(Path(DATA_PATH).glob("**/*.pdf"))
                    ) if os.path.exists(DATA_PATH) else 0
    return {
        "status": "running",
        "message": "Mock RAG Chatbot API is running (no API keys required)",
        "pdfs_loaded": pdf_count,
        "available_topics": list(MOCK_RESPONSES.keys())
    }


@app.post("/query")
def query(req: QueryRequest):
    if not req.question.strip():
        return {"answer": "Please ask a question about MERN stack development.", "sources": []}

    question_lower = req.question.lower()

    # Check for mock responses
    for key, response in MOCK_RESPONSES.items():
        if key in question_lower:
            return {
                "answer": response,
                "sources": [{"page": 1, "source": "mern-stack-guide.pdf"}]
            }

    # Default helpful response
    return {
        "answer": "I'm a MERN stack assistant! I can help with questions about MongoDB, Express.js, React.js, and Node.js. Try asking about installation, setup, or specific features of these technologies.",
        "sources": []
    }


@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    return {"message": "File upload not implemented in mock version", "filename": file.filename}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
