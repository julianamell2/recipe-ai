import os
import json
import requests

from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv(
    "OPENROUTER_API_KEY"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL"
)


def generate_recipe(ingredients):

    prompt = f"""
Genera una receta usando únicamente estos ingredientes:

{', '.join(ingredients)}

IMPORTANTE:

- Responde únicamente JSON válido.
- No uses markdown.
- No uses ```json.
- No agregues explicaciones.
- Máximo 5 pasos.
- Máximo 5 ingredientes.

Formato exacto:

{{
  "nombre_plato": "",
  "ingredientes": [],
  "pasos": [],
  "tiempo_estimado": "",
  "nivel_dificultad": ""
}}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": OPENROUTER_MODEL,
            "max_tokens": 1500,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    result = response.json()

    print(response.status_code)
    print(result)

    if "choices" not in result:
        raise Exception(
            f"OpenRouter error: {result}"
        )

    content = (
        result["choices"][0]
        ["message"]
        ["content"]
    )

    try:
        return json.loads(content)

    except json.JSONDecodeError:

        start = content.find("{")
        end = content.rfind("}") + 1

        if start != -1 and end != -1:
            return json.loads(
                content[start:end]
            )

        raise Exception(
            f"Respuesta inválida del modelo: {content}"
        )