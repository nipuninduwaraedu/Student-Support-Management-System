from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
import os
import shutil
import time
import random
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
# IMPORTANT: The GOOGLE_API_KEY is loaded from the .env file located at ai-service/.env
# If you need to change your API key, update the GOOGLE_API_KEY value in that file.
load_dotenv(BASE_DIR / ".env")

from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = "data"
CHROMA_PATH = "chroma"

os.makedirs(DATA_PATH, exist_ok=True)
os.makedirs(CHROMA_PATH, exist_ok=True)

PROMPT_TEMPLATE = """
You are a helpful Student Support AI assistant.
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""

class QueryRequest(BaseModel):
    question: str

def get_chat_response_with_retry(prompt, max_retries=3):
    """Helper to call Gemini with exponential backoff for 429 errors."""
    for i in range(max_retries):
        try:
            model = ChatGoogleGenerativeAI(model="gemini-2.0-flash")
            return model.invoke(prompt)
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                if i < max_retries - 1:
                    wait_time = (2 ** i) + (random.randint(0, 1000) / 1000)
                    print(f"Quota exceeded (429). Retrying in {wait_time:.2f} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise Exception("AI quota exceeded. Please try again in a few minutes.")
            raise e

def get_embeddings_with_retry(text_or_docs, is_query=True, max_retries=3):
    """Helper to get embeddings with exponential backoff for 429 errors."""
    for i in range(max_retries):
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
            if is_query:
                # For similarity search, we just need the embedding function
                return embeddings
            return embeddings
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                if i < max_retries - 1:
                    wait_time = (2 ** i) + (random.randint(0, 1000) / 1000)
                    print(f"Embedding quota exceeded (429). Retrying in {wait_time:.2f} seconds...")
                    time.sleep(wait_time)
                    continue
                else:
                    raise Exception("AI quota exceeded. Please try again in a few minutes.")
            raise e

@app.get("/")
def root():
    pdf_count = len(list(Path(DATA_PATH).glob("**/*.pdf"))) if os.path.exists(DATA_PATH) else 0
    return {
        "status": "running",
        "message": "RAG Chatbot API is running with Google AI Studio",
        "pdfs_loaded": pdf_count
    }

@app.post("/query")
def query(req: QueryRequest):
    if not req.question.strip():
        return {"answer": "Please ask a question.", "sources": []}

    if not os.environ.get("GOOGLE_API_KEY"):
        return {"answer": "Error: GOOGLE_API_KEY is not set.", "sources": []}

    try:
        # Get embeddings with retry
        embeddings = get_embeddings_with_retry(None, is_query=True)

        if not os.path.exists(CHROMA_PATH) or not os.listdir(CHROMA_PATH):
            return {
                "answer": "My knowledge base is currently empty. Please upload a PDF using the paperclip icon first so I can learn from your documents!",
                "sources": []
            }

        db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
        results = db.similarity_search_with_score(req.question, k=3)

        if len(results) == 0:
            return {
                "answer": "I could not find any relevant information in my knowledge base for that question.",
                "sources": []
            }

        context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=context_text, question=req.question)

        # Get chat response with retry
        response = get_chat_response_with_retry(prompt)

        sources = []
        for doc, _score in results:
            source = doc.metadata.get("source", "Unknown")
            source_name = os.path.basename(source)
            page = doc.metadata.get("page", 0) + 1
            sources.append({"source": source_name, "page": page})

        return {"answer": response.content, "sources": sources}

    except Exception as e:
        print(f"Error processing query: {e}")
        error_message = str(e)
        # Check if it's our custom quota error or a standard 429
        if "quota exceeded" in error_message.lower() or "429" in error_message:
            return {"answer": "AI quota exceeded. Please try again in a few minutes.", "sources": []}
        return {"answer": f"Sorry, an error occurred: {error_message}", "sources": []}


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    file_path = os.path.join(DATA_PATH, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
            length_function=len,
            add_start_index=True,
        )
        chunks = splitter.split_documents(documents)

        # Get embeddings with retry for upload
        embeddings = get_embeddings_with_retry(None, is_query=True)
        db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
        db.add_documents(chunks)

        return {
            "message": f"Successfully uploaded and processed {file.filename}",
            "chunks_added": len(chunks)
        }

    except Exception as e:
        print(f"Error processing upload: {e}")
        if os.path.exists(file_path):
            os.remove(file_path)
        
        error_message = str(e)
        if "quota exceeded" in error_message.lower() or "429" in error_message:
             raise HTTPException(status_code=429, detail="AI quota exceeded. Please try again in a few minutes.")
             
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {error_message}")



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)