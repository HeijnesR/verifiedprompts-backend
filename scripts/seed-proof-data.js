// seed-proof-data.js
// Run: node scripts/seed-proof-data.js

const prisma = require('../db');

const proofData = [
  {
    id: "cmjb8191z000a8ax4jdfz6oos",
    title: "Product Description Writer",
    data: {
      targetAudience: "E-commerce managers, Shopify store owners, Amazon sellers, and product marketers",
      useCase: "When launching new products or optimizing existing listings to increase conversions",
      recommendedModel: "GPT-4 Turbo or Claude 3 Sonnet",
      exampleOutput: "**Input:** Write a product description for wireless earbuds, premium brand, $149\n\n**Output:**\n\nExperience Sound Without Limits\n\nImmerse yourself in crystal-clear audio with our ProSound X3 Wireless Earbuds. Engineered for audiophiles who refuse to compromise.\n\nWhy You'll Love Them:\n- 40-hour battery life - A full work week on a single charge\n- Active Noise Cancellation - Your music, zero distractions\n- IPX5 waterproof - Gym sessions and rain, no problem\n- Seamless connectivity - Instant pairing with all your devices\n\nThe ergonomic design fits perfectly in your ear, while the premium titanium drivers deliver bass that you'll feel and highs that sparkle.\n\nFree shipping | 30-day returns | 2-year warranty",
      usageTips: "Include target price point, brand positioning (budget/mid/premium), and 2-3 key features you want highlighted. Add competitor products for differentiation.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb7r61200028ax49hh3hf1t",
    title: "Professional Email Writer",
    data: {
      targetAudience: "Business professionals, sales teams, job seekers, and anyone who writes work emails daily",
      useCase: "When you need to write important emails quickly - follow-ups, introductions, requests, negotiations, or difficult conversations",
      recommendedModel: "GPT-4 or Claude 3 (both excel at professional tone)",
      exampleOutput: "**Input:** Write a follow-up email after a sales demo, they seemed interested but had budget concerns\n\n**Output:**\n\nSubject: Next Steps + Flexible Options for [Company]\n\nHi [Name],\n\nThank you for your time yesterday - I enjoyed learning about your team's challenges with [specific pain point discussed].\n\nI understand budget timing is a consideration. A few options that might help:\n\n1. Quarterly billing instead of annual (same price, spread out)\n2. Starter package - Begin with core features, expand later\n3. Q1 start date - Lock in current pricing, begin when budget refreshes\n\nI've also attached the ROI calculator we discussed. Based on your numbers, most teams see payback within 3 months.\n\nWould any of these options make it easier to move forward? Happy to jump on a quick call to discuss.\n\nBest,\n[Your name]",
      usageTips: "Always include: the context/situation, recipient's role, your relationship with them, and the desired outcome. The more specific, the better.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb7u5ud00048ax4aevdu6e4",
    title: "Code Debugger & Explainer",
    data: {
      targetAudience: "Developers of all levels, coding bootcamp students, and engineers debugging unfamiliar codebases",
      useCase: "When you're stuck on a bug, inherited legacy code, or need to understand what a piece of code does",
      recommendedModel: "Claude 3 Opus (best for complex code) or GPT-4 Turbo",
      exampleOutput: "**Input:** Why does this code return undefined?\n\nasync function getUser(id) {\n  const user = await fetch('/api/users/' + id);\n  return user;\n}\n\n**Output:**\n\nBug Found: The issue is that fetch() returns a Response object, not the actual data. You're returning the Response before extracting the JSON.\n\nFixed Code:\n\nasync function getUser(id) {\n  const response = await fetch('/api/users/' + id);\n  const user = await response.json();\n  return user;\n}\n\nExplanation:\n1. fetch() returns a Response object containing metadata (status, headers, etc.)\n2. .json() is an async method that parses the response body as JSON\n3. Without .json(), you get the Response wrapper, not your data",
      usageTips: "Include the full error message, what you expected to happen, and what actually happened. Include surrounding code for context.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb7wm8j00068ax43qoue4af",
    title: "Viral LinkedIn Post Generator",
    data: {
      targetAudience: "Founders, thought leaders, sales professionals, and anyone building their personal brand on LinkedIn",
      useCase: "When you want to share insights, stories, or opinions that get engagement and grow your following",
      recommendedModel: "GPT-4 Turbo (best for viral hooks) or Claude 3 Sonnet",
      exampleOutput: "**Input:** Write about how I hired someone who had no experience but turned out to be our best employee\n\n**Output:**\n\nI almost didn't hire Sarah.\n\nNo degree. No experience.\nJust a portfolio of side projects and hungry eyes.\n\nMy co-founder said I was crazy.\nHR said it was \"risky.\"\n\nI hired her anyway.\n\n6 months later:\n-> She shipped our most-used feature\n-> She mentored 2 senior devs on a new framework\n-> She became our first promoted engineer\n\nHere's what I learned:\n\nSkills can be taught.\nHunger cannot.\n\nThe best hire I ever made had zero experience.\n\nStop hiring resumes.\nStart hiring potential.\n\n--\n\nWhat's the best \"risky\" hire you've ever made?",
      usageTips: "Share a specific story with numbers/results. Include a contrarian take or lesson learned. End with a question to boost comments.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb7yy7c00088ax4wsl284ll",
    title: "SQL Query Generator",
    data: {
      targetAudience: "Data analysts, product managers, marketers who need data, and developers who don't write SQL daily",
      useCase: "When you need to pull data from a database but don't remember the exact SQL syntax",
      recommendedModel: "GPT-4 Turbo or Claude 3 Sonnet (both excellent at SQL)",
      exampleOutput: "**Input:** Get all customers who made a purchase in the last 30 days but haven't purchased in the 30 days before that (reactivated customers). Tables: customers, orders\n\n**Output:**\n\nSELECT DISTINCT c.id, c.email, c.name\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\n  AND c.id NOT IN (\n    SELECT DISTINCT customer_id\n    FROM orders\n    WHERE created_at BETWEEN NOW() - INTERVAL '60 days'\n                         AND NOW() - INTERVAL '30 days'\n  )\nORDER BY c.id;\n\n**Explanation:**\n1. Find customers with orders in last 30 days\n2. Exclude those who ALSO ordered 31-60 days ago\n3. Result: customers who came back after being inactive\n\n**Performance tip:** Add index on orders(customer_id, created_at) if this runs slow.",
      usageTips: "Describe your table structure (or paste CREATE TABLE statements). Mention your database type (PostgreSQL, MySQL, etc.) for syntax accuracy.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb83d0x000c8ax4enpgl6tv",
    title: "Meeting Notes Summarizer",
    data: {
      targetAudience: "Team leads, project managers, executives, and anyone who attends too many meetings",
      useCase: "After any meeting - turn messy notes or transcripts into clear action items and summaries",
      recommendedModel: "Claude 3 Sonnet (best at structured summaries) or GPT-4",
      exampleOutput: "**Input:** [Pasted 45-minute meeting transcript about product roadmap]\n\n**Output:**\n\nMeeting Summary: Q1 Product Roadmap\nDate: Dec 20, 2024 | Duration: 45 min | Attendees: Sarah, Mike, Lisa, Tom\n\nKey Decisions:\n1. Mobile app v2 launches March 15 (not end of Q1)\n2. Pause enterprise features until core product stability improves\n3. Hire 2 frontend devs - job posts go live next week\n\nAction Items:\n- Sarah: Finalize mobile app requirements doc (Due: Dec 27)\n- Mike: Set up interviews for frontend roles (Due: Jan 3)\n- Lisa: Create stability metrics dashboard (Due: Jan 10)\n- Tom: Update public roadmap page (Due: Dec 23)\n\nOpen Questions:\n- Do we need a dedicated QA hire? (Revisit in January)\n- Budget approval for new hires? (Sarah following up with finance)\n\nNext Meeting: Jan 6, 2024 - Sprint planning for mobile v2",
      usageTips: "Paste the full transcript or notes, even if messy. Mention if you want specific sections (just action items, decisions only, etc.).",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb85pkx000e8ax43ym4ximt",
    title: "Python Script Generator",
    data: {
      targetAudience: "Developers, data scientists, automation enthusiasts, and anyone who wants to automate repetitive tasks",
      useCase: "When you need a quick Python script for automation, data processing, web scraping, or file manipulation",
      recommendedModel: "Claude 3 Opus (best for complex scripts) or GPT-4 Turbo",
      exampleOutput: "**Input:** Script to monitor a website and send me a Slack notification when the price drops below $500\n\n**Output:**\n\nimport requests\nfrom bs4 import BeautifulSoup\nimport time\nimport os\n\nURL = \"https://example.com/product\"\nTARGET_PRICE = 500\nCHECK_INTERVAL = 3600  # 1 hour\nSLACK_WEBHOOK = os.environ.get(\"SLACK_WEBHOOK_URL\")\n\ndef get_price():\n    response = requests.get(URL, headers={\"User-Agent\": \"Mozilla/5.0\"})\n    soup = BeautifulSoup(response.content, \"html.parser\")\n    price_elem = soup.select_one(\".price\")\n    price = float(''.join(c for c in price_elem.text if c.isdigit() or c == '.'))\n    return price\n\ndef send_slack_alert(price):\n    requests.post(SLACK_WEBHOOK, json={\n        \"text\": f\"Price Alert! Now ${price:.2f} - {URL}\"\n    })\n\nwhile True:\n    price = get_price()\n    if price < TARGET_PRICE:\n        send_slack_alert(price)\n        break\n    time.sleep(CHECK_INTERVAL)",
      usageTips: "Describe what you want to automate in plain English. Mention any specific libraries you want to use (or don't want). Include error handling requirements.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb87oul000g8ax41z4nibd3",
    title: "Customer Review Response Generator",
    data: {
      targetAudience: "Business owners, customer success teams, reputation managers, and e-commerce sellers",
      useCase: "When responding to customer reviews on Google, Yelp, Amazon, Trustpilot, or app stores",
      recommendedModel: "GPT-4 or Claude 3 Sonnet (both great at empathetic tone)",
      exampleOutput: "**Input:** Respond to this 2-star review: \"Shipping took forever and the packaging was damaged. Product works fine but I expected better for the price.\"\n\n**Output:**\n\nHi [Customer name],\n\nThank you for your honest feedback - and I'm genuinely sorry about the shipping and packaging issues. That's not the experience we want for you, especially at this price point.\n\nI've flagged this with our fulfillment team to investigate the delay, and we're reviewing our packaging with our shipping partners to prevent damage.\n\nI'd love to make this right. Could you email me directly at [email]? I'll personally ensure your next order arrives quickly and in perfect condition - on us.\n\nThanks for giving us a chance to improve.\n\n[Your name]\nFounder, [Company]\n\n---\nWhy this works: Acknowledges specific issues, shows action being taken, offers concrete resolution, personal touch from founder, takes conversation private.",
      usageTips: "Paste the exact review. Mention your brand voice (formal, casual, friendly). Include what resolution you're willing to offer.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb89ll2000i8ax4yv1di6kn",
    title: "Blog Post Outline Generator",
    data: {
      targetAudience: "Content marketers, bloggers, SEO specialists, and founders doing content marketing",
      useCase: "When starting a new blog post - get a structured outline before writing to save time and improve quality",
      recommendedModel: "Claude 3 Sonnet (best for structured content) or GPT-4",
      exampleOutput: "**Input:** Blog post about \"why startups should use AI for customer support\" - targeting founders, SEO-focused\n\n**Output:**\n\nBlog Outline: Why Startups Should Use AI for Customer Support in 2025\n\nTarget keyword: AI customer support for startups\nWord count: 1,800-2,200\n\nH1: Why Startups Should Use AI for Customer Support (+ How to Start)\n\nIntro (150 words): Hook about support ticket volume, problem with hiring, promise of solution\n\nH2: The Real Cost of Manual Customer Support (300 words)\n- Agent salary + benefits\n- Training time and turnover\n- Hidden cost: founder time\n\nH2: What AI Customer Support Actually Looks Like in 2025 (350 words)\n- Beyond chatbots\n- Real examples\n- What AI handles vs humans\n\nH2: 5 Benefits of AI Support for Early-Stage Startups (400 words)\n1. 24/7 availability\n2. Instant response times\n3. Consistent answers\n4. Scales instantly\n5. Data insights\n\nH2: How to Implement AI Support in a Weekend (400 words)\n- Step-by-step guide\n\nConclusion (150 words): Recap + CTA",
      usageTips: "Include your target keyword, desired word count, target audience, and any specific sections you want covered. Mention competitor posts to differentiate.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb8d1ks000k8ax4d8do2myw",
    title: "Midjourney Prompt Crafter",
    data: {
      targetAudience: "Designers, marketers, content creators, and anyone creating AI-generated images",
      useCase: "When you have an image idea but don't know how to write a Midjourney prompt that gets the result you want",
      recommendedModel: "GPT-4 or Claude 3 (for crafting the prompt) - Then use in Midjourney",
      exampleOutput: "**Input:** I need a hero image for a fintech startup website. Modern, trustworthy, showing growth/success. Blue color scheme.\n\n**Output:**\n\nPrimary Prompt:\nAbstract 3D visualization of financial growth, translucent glass cubes ascending like a bar chart, soft blue gradient background, golden light rays piercing through, floating geometric particles, clean minimal composition, professional corporate aesthetic, 8k, photorealistic rendering --ar 16:9 --v 6 --style raw\n\nAlternative (More Human):\nConfident diverse business team celebrating success in modern glass office, city skyline view, natural lighting, candid moment, blue and white color palette, shallow depth of field, editorial photography style --ar 16:9 --v 6\n\nParameter Guide:\n--ar 16:9 = Widescreen for hero images\n--v 6 = Latest Midjourney version\n--style raw = Less \"Midjourney look\", more photorealistic\nAdd --no text, words, letters if you get unwanted text",
      usageTips: "Describe the mood, use case (website hero, social post, etc.), color preferences, and what you want to avoid. Include aspect ratio needs.",
      outputScreenshots: []
    }
  }
];

async function seedProofData() {
  console.log('Starting proof data seeding for 10 prompts...\n');

  for (const item of proofData) {
    try {
      await prisma.prompt.update({
        where: { id: item.id },
        data: item.data
      });
      console.log('Updated: "' + item.title + '"');
    } catch (error) {
      console.error('Error updating "' + item.title + '":', error.message);
    }
  }

  console.log('\nDone! All 10 prompts now have proof data.');
}

seedProofData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
