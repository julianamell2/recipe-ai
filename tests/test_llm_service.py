from app.services.llm_service import build_prompt



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