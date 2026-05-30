from app.services.llm_service import generate_recipe

recipe = generate_recipe(
    ["pollo", "arroz"]
)

print(recipe)