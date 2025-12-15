// verify.js - AI Verificatie Systeem

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Test een prompt en krijg een kwaliteitsscore
async function testPrompt(promptText, testInput) {
  try {
    // Vul de variabelen in de prompt in
    let filledPrompt = promptText;
    for (const [key, value] of Object.entries(testInput)) {
      filledPrompt = filledPrompt.replace(`{${key}}`, value);
    }

    // Stuur naar Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: filledPrompt }
      ]
    });

    const output = response.content[0].text;

    // Laat Claude de output beoordelen
    const evaluation = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
        { 
          role: 'user', 
          content: `Beoordeel deze AI-gegenereerde output op kwaliteit. Geef een score van 1-10 en een korte uitleg.

Output om te beoordelen:
"""
${output}
"""

Antwoord in dit exacte JSON formaat:
{"score": 8, "reason": "Korte uitleg hier"}` 
        }
      ]
    });

    // Parse de evaluatie
    const evalText = evaluation.content[0].text;
    const jsonMatch = evalText.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const evalResult = JSON.parse(jsonMatch[0]);
      return {
        output,
        score: evalResult.score,
        reason: evalResult.reason
      };
    }

    return { output, score: 5, reason: 'Kon niet evalueren' };

  } catch (error) {
    console.error('Test error:', error.message);
    return { output: null, score: 0, reason: error.message };
  }
}

// Verifieer een prompt door hem meerdere keren te testen
async function verifyPrompt(promptText, testInputs, numberOfTests = 3) {
  console.log(`\nStart verificatie met ${numberOfTests} tests...`);
  
  const results = [];

  for (let i = 0; i < numberOfTests; i++) {
    // Kies willekeurige test input
    const testInput = testInputs[i % testInputs.length];
    console.log(`\nTest ${i + 1}/${numberOfTests}...`);
    
    const result = await testPrompt(promptText, testInput);
    results.push(result);
    
    console.log(`Score: ${result.score}/10 - ${result.reason}`);
  }

  // Bereken gemiddelde scores
  const validResults = results.filter(r => r.score > 0);
  
  if (validResults.length === 0) {
    return {
      isVerified: false,
      verificationScore: 0,
      qualityScore: 0,
      consistencyScore: 0,
      results
    };
  }

  const avgQuality = validResults.reduce((sum, r) => sum + r.score, 0) / validResults.length;
  
  // Bereken consistentie (hoe dicht liggen de scores bij elkaar?)
  const scoreVariance = validResults.reduce((sum, r) => sum + Math.pow(r.score - avgQuality, 2), 0) / validResults.length;
  const consistencyScore = Math.max(0, 10 - scoreVariance);

  // Totaal verificatie score
  const verificationScore = (avgQuality * 0.7) + (consistencyScore * 0.3);

  return {
    isVerified: verificationScore >= 6,
    verificationScore: Math.round(verificationScore * 10) / 10,
    qualityScore: Math.round(avgQuality * 10) / 10,
    consistencyScore: Math.round(consistencyScore * 10) / 10,
    results
  };
}

module.exports = { verifyPrompt, testPrompt };