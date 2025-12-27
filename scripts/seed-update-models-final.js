// seed-update-models-final.js
// Run: node scripts/seed-update-models-final.js

const prisma = require('../db');

const modelUpdates = [
  {
    id: "cmjb8191z000a8ax4jdfz6oos",
    title: "Product Description Writer",
    recommendedModel: "GPT-5.2 or Claude 4.5 Sonnet - both excel at persuasive marketing copy"
  },
  {
    id: "cmjb7r61200028ax49hh3hf1t",
    title: "Professional Email Writer",
    recommendedModel: "GPT-5.2 or Claude 4.5 Sonnet - best for professional tone and nuance"
  },
  {
    id: "cmjb7u5ud00048ax4aevdu6e4",
    title: "Code Debugger & Explainer",
    recommendedModel: "Claude 4.5 Opus (best for complex code) or GPT-5.2"
  },
  {
    id: "cmjb7wm8j00068ax43qoue4af",
    title: "Viral LinkedIn Post Generator",
    recommendedModel: "GPT-5.2 (best for viral hooks) or Claude 4.5 Sonnet"
  },
  {
    id: "cmjb7yy7c00088ax4wsl284ll",
    title: "SQL Query Generator",
    recommendedModel: "GPT-5.2 or Claude 4.5 Sonnet - both excellent at SQL"
  },
  {
    id: "cmjb83d0x000c8ax4enpgl6tv",
    title: "Meeting Notes Summarizer",
    recommendedModel: "Claude 4.5 Sonnet (best at structured summaries) or GPT-5.2"
  },
  {
    id: "cmjb85pkx000e8ax43ym4ximt",
    title: "Python Script Generator",
    recommendedModel: "Claude 4.5 Opus (best for complex scripts) or GPT-5.2"
  },
  {
    id: "cmjb87oul000g8ax41z4nibd3",
    title: "Customer Review Response Generator",
    recommendedModel: "GPT-5.2 or Claude 4.5 Sonnet - both great at empathetic tone"
  },
  {
    id: "cmjb89ll2000i8ax4yv1di6kn",
    title: "Blog Post Outline Generator",
    recommendedModel: "Claude 4.5 Sonnet (best for structured content) or GPT-5.2"
  },
  {
    id: "cmjb8d1ks000k8ax4d8do2myw",
    title: "Midjourney Prompt Crafter",
    recommendedModel: "GPT-5.2 or Claude 4.5 Sonnet (for crafting the prompt) - then use in Midjourney v7"
  }
];

async function updateModels() {
  console.log('Updating recommendedModel fields to latest AI models (Dec 2024)...\n');

  for (const item of modelUpdates) {
    try {
      await prisma.prompt.update({
        where: { id: item.id },
        data: { recommendedModel: item.recommendedModel }
      });
      console.log('Updated: "' + item.title + '"');
    } catch (error) {
      console.error('Error updating "' + item.title + '":', error.message);
    }
  }

  console.log('\nDone! All prompts now recommend: GPT-5.2, Claude 4.5, Gemini 3, Midjourney v7');
}

updateModels()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
