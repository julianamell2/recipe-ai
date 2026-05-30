from app.services.llm_service import build_prompt


def test_ingredients_are_in_prompt():

    ingredients = [
        "pollo",
        "arroz",
        "tomate"
    ]

    prompt = build_prompt(ingredients)

    assert "pollo" in prompt
    assert "arroz" in prompt
    assert "tomate" in prompt