from app.services.llm_service import build_prompt
import json
import pytest



def test_prompt_contains_ingredients():

    prompt = build_prompt(
        ["pollo", "arroz"]
    )

    assert "pollo" in prompt
    assert "arroz" in prompt

def test_prompt_contains_ingredients():

    prompt = build_prompt(
        ["pollo", "arroz"]
    )

    assert "pollo" in prompt
    assert "arroz" in prompt


def test_prompt_not_empty():

    prompt = build_prompt(
        ["pollo"]
    )

    assert len(prompt) > 0    

def test_parse_valid_llm_response():

    content = """
    {
        "nombre_plato": "Arroz con pollo",
        "ingredientes": ["pollo", "arroz"],
        "pasos": ["Paso 1"]
    }
    """

    result = json.loads(content)

    assert result["nombre_plato"] == "Arroz con pollo"
    assert len(result["ingredientes"]) == 2

def test_invalid_llm_response():

    content = "esto no es json"

    with pytest.raises(
        json.JSONDecodeError
    ):
        json.loads(content)