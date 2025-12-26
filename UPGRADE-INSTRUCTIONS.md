# VerifiedPrompts Upgrade: "Bewijs" Feature

Deze upgrade voegt velden toe waarmee je per prompt kunt laten zien dat het werkt - de key differentiator tegen AI-commoditisatie.

## Nieuwe velden

| Veld | Type | Beschrijving |
|------|------|--------------|
| `targetAudience` | String | Voor wie is deze prompt? (bijv. "freelance copywriters") |
| `useCase` | String | Wanneer gebruik je dit? (bijv. "When writing product descriptions") |
| `recommendedModel` | String | Welk specifiek model werkt het beste? (bijv. "GPT-4 Turbo") |
| `exampleOutput` | String | Markdown met voorbeeld resultaat |
| `outputScreenshots` | String[] | Array met screenshot URLs |
| `usageTips` | String | Tips voor beste resultaten |

---

## Stap 1: Schema updaten

Vervang je `prisma/schema.prisma` met het nieuwe bestand.

## Stap 2: Migratie draaien

```bash
cd C:\projects\promptverify

# Maak nieuwe migratie
npx prisma migrate dev --name add_proof_fields

# Of als je op productie bent (Render):
npx prisma migrate deploy
```

## Stap 3: Prisma client regenereren

```bash
npx prisma generate
```

## Stap 4: Push naar GitHub

```bash
git add .
git commit -m "Add proof fields for anti-commoditization"
git push
```

Render zal automatisch deployen en de migratie uitvoeren.

---

## Frontend aanpassingen nodig

Na de database update moet je ook:

1. **Prompt detail pagina** - de nieuwe velden tonen
2. **Prompt aanmaak formulier** - velden toevoegen voor sellers
3. **API endpoints** - de nieuwe velden meesturen

Wil je dat ik deze ook maak?
