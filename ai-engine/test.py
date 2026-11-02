import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-3.8-flash"))

for i in range(25):
    print(i)
    response = model.generate_content("hello")
    print(response.text)