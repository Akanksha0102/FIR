import os
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_fir(prompt: str, temperature: float = 0.2):
    try:
        messages = [
            {
                "role": "system",
                "content": """
You are a legal assistant for Indian FIR analysis.

Return ONLY valid JSON:
{
  "section_identified": "",
  "offence_detected": "",
  "generated_explanation": "",
  "punishment": "",
  "court": "",
  "is_cognizable": true/false,
  "is_bailable": true/false
}

Rules:
- Use only given FIR text
- Do NOT guess random IPC sections
- If unclear, return "insufficient data"
"""
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=temperature,
            max_tokens=500
        )

        content = response.choices[0].message.content

        return json.loads(content)

    except Exception as e:
        return {"error": str(e)}

















# # import openai

# # from dotenv import load_dotenv
# # import os

# # # from config import *
# # load_dotenv()

# # openai.api_key = os.getenv('OPEN_API_KEY')

# # # N_RETRIES = 3

# # # @retry(stop=stop_after_attempt(N_RETRIES), wait=wait_exponential(multiplier=1, min=4, max=70))
# # def generate_fir(prompt:str, temperature:float=0.01):
# #     messages=[
# #         {
# #             "role": "system",
# #             "content":  """
# #         You have to generate a response based on text input from the user. The response needs to be formal and should follow the Indian Penal Code without any compromise.
# #         You have to guve proper sections which will be applicable to the collective statements of witnesses and follow the Indian penal code to the T.
# #         You cannnot use anyother law than Indian Penal Code.
# #         The response needs to be formal and must tell wether the section applicable is cognizable, give a proper short description of the section to the user, tell whether the offense is bailable or not.
# #         The format needs to match the following template and give output in json file.
           
# #             (i) *Act …………………………………. *Sections ……………………………………………...
# #             (ii) *Act …………………………………. *Sections ……………………………………………...
# #             (iii) *Act …………………………………. *Sections ……………………………………………...
# #             (iv) * Other Acts & Sections ………………………………………………………………………..
           
# #         """.strip()
# #         }
# #     ]

# #     response = openai.ChatCompletion.create(
# #         model="gpt-3.5-turbo-1106",
# #         messages=messages,
# #         temperature=0.4,
# #         max_tokens=1000,
# #     )

# #     return response.choices[0].message['content']

# # # if __name__ == '__main__':
    
    
    
    
    # NO MONEY FOR GPT THEREFORE JUST DEMO
    
# import json

# def generate_fir(prompt: str, temperature: float = 0.2):
#     try:
#         # 🧠 Fake intelligent FIR response (DEMO MODE)
#         return {
#             "section_identified": "IPC 379, IPC 411",
#             "offence_detected": "Theft and stolen property possession",
#             "generated_explanation": (
#                 "Based on the FIR text, the case involves unlawful taking of property "
#                 "without consent. Evidence suggests theft under IPC 379 and possible "
#                 "handling of stolen goods under IPC 411."
#             ),
#             "punishment": "Imprisonment up to 3 years or fine or both",
#             "court": "Judicial Magistrate First Class (JMFC)",
#             "is_cognizable": True,
#             "is_bailable": True
#         }

#     except Exception as e:
#         return {"error": str(e)}