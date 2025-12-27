// seed-proof-data-v2.js
// Run: node scripts/seed-proof-data-v2.js

const prisma = require('../db');

const proofData = [
  {
    id: "cmjb8191z000a8ax4jdfz6oos",
    title: "Product Description Writer",
    data: {
      targetAudience: "E-commerce managers, Shopify store owners, Amazon sellers, and product marketers",
      useCase: "When launching new products or optimizing existing listings to increase conversions",
      recommendedModel: "GPT-4 Turbo or Claude 3 Sonnet",
      exampleOutput: "**Input:**\n- Product: ProSound X3 Wireless Earbuds\n- Key features: 40hr battery, ANC, IPX5 waterproof\n- Target customer: Audiophiles and commuters\n- Price point: premium\n- Platform: Shopify\n\n**Output:**\n\n**Experience Sound Without Limits**\n\nTired of earbuds that die mid-commute? Meet ProSound X3.\n\nImmerse yourself in crystal-clear audio with our wireless earbuds engineered for audiophiles who refuse to compromise.\n\n**Why You'll Love Them:**\n- 40-hour battery life - A full work week on a single charge\n- Active Noise Cancellation - Your music, zero distractions\n- IPX5 waterproof - Gym sessions and rain, no problem\n- Seamless connectivity - Instant pairing with all your devices\n\n*Join 10,000+ happy listeners*\n\nOnly 12 left at this price!\n\n**[Add to Cart - $149]**",
      usageTips: "Fill in all variables for best results:\n- {product_name}: Your product's name\n- {features}: List 3-5 key features\n- {target_audience}: Who buys this?\n- {price_range}: budget/mid-range/premium\n- {platform}: Amazon/Shopify/eBay/website\n\nThe more specific your features, the better the bullet points.",
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
      exampleOutput: "**Input:**\n- Purpose: Follow up after sales demo\n- Recipient: VP of Engineering\n- Tone: friendly\n- Key points: Address budget concerns, offer flexible options\n- Desired outcome: Schedule second call\n\n**Output:**\n\n**Subject:** Next Steps + Flexible Options for [Company]\n\nHi [Name],\n\nThank you for your time yesterday - I enjoyed learning about your team's challenges with deployment bottlenecks.\n\nI understand budget timing is a consideration. A few options that might help:\n\n1. Quarterly billing instead of annual (same price, spread out)\n2. Starter package - Begin with core features, expand later\n3. Q1 start date - Lock in current pricing, begin when budget refreshes\n\nWould any of these make it easier to move forward? Happy to jump on a 15-minute call to discuss.\n\nBest,\n[Your name]",
      usageTips: "Fill in all variables for best results:\n- {purpose}: What's the email about?\n- {recipient_role}: Their job title/role\n- {tone}: formal/friendly/urgent/apologetic\n- {key_points}: What must be included?\n- {desired_action}: What should they do after reading?\n\nBe specific about the desired outcome for a stronger call-to-action.",
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
      exampleOutput: "**Input:**\n- Language: JavaScript\n- Code:\nasync function getUser(id) {\n  const user = await fetch('/api/users/' + id);\n  return user;\n}\n\n**Output:**\n\n**1. Bugs/Issues Found:**\n- fetch() returns a Response object, not the parsed data\n- No error handling for failed requests\n- No validation of the id parameter\n\n**2. Why These Are Problematic:**\n- You'll get a Response object instead of actual user data\n- Network errors will crash your app\n- Invalid IDs could cause unexpected behavior\n\n**3. Fixed Code:**\n```javascript\nasync function getUser(id) {\n  // Validate input\n  if (!id) throw new Error('User ID required');\n  \n  const response = await fetch('/api/users/' + id);\n  \n  // Check for HTTP errors\n  if (!response.ok) {\n    throw new Error('User not found');\n  }\n  \n  // Parse JSON data\n  const user = await response.json();\n  return user;\n}\n```\n\n**4. Performance Suggestions:**\n- Consider caching frequent user lookups\n- Use AbortController for request timeout",
      usageTips: "Fill in all variables for best results:\n- {programming_language}: Be specific (JavaScript, Python 3.11, etc.)\n- {code}: Paste the full code block with context\n\nInclude any error messages you're seeing for faster debugging. Add surrounding code if the bug might be related to scope or imports.",
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
      exampleOutput: "**Input:**\n- Topic: Hiring someone without experience who became our best employee\n- Audience: Startup founders and hiring managers\n- Goal: engagement\n- Tone: storytelling\n\n**Output:**\n\nI almost didn't hire Sarah.\n\nNo degree. No experience.\nJust a portfolio of side projects and hungry eyes.\n\nMy co-founder said I was crazy.\nHR said it was \"risky.\"\n\nI hired her anyway.\n\n6 months later:\n-> She shipped our most-used feature\n-> She mentored 2 senior devs on a new framework\n-> She became our first promoted engineer\n\nHere's what I learned:\n\nSkills can be taught.\nHunger cannot.\n\nThe best hire I ever made had zero experience.\n\nStop hiring resumes.\nStart hiring potential.\n\n--\n\nWhat's the best \"risky\" hire you've ever made?\n\n#hiring #startups #leadership #careers #tech",
      usageTips: "Fill in all variables for best results:\n- {topic}: Your story or insight (be specific)\n- {audience}: Who should relate to this?\n- {goal}: engagement/leads/brand awareness\n- {tone}: inspirational/educational/controversial/storytelling\n\nPersonal stories with specific numbers perform best. The first line is crucial - make it intriguing!",
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
      exampleOutput: "**Input:**\n- Database type: PostgreSQL\n- Request: Get all customers who made a purchase in the last 30 days but haven't purchased in the 30 days before that (reactivated customers)\n- Tables: customers (id, email, name, created_at), orders (id, customer_id, amount, created_at)\n\n**Output:**\n\n**1. SQL Query:**\n```sql\nSELECT DISTINCT c.id, c.email, c.name\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\n  AND c.id NOT IN (\n    SELECT DISTINCT customer_id\n    FROM orders\n    WHERE created_at BETWEEN NOW() - INTERVAL '60 days'\n                         AND NOW() - INTERVAL '30 days'\n  )\nORDER BY c.id;\n```\n\n**2. Explanation:**\n- Finds customers with orders in last 30 days\n- Excludes those who ALSO ordered 31-60 days ago\n- Result: customers who came back after being inactive\n\n**3. Recommended Indexes:**\n```sql\nCREATE INDEX idx_orders_customer_date ON orders(customer_id, created_at);\n```\n\n**4. Alternative Approach:**\nUsing a CTE for better readability with large datasets.",
      usageTips: "Fill in all variables for best results:\n- {database}: MySQL/PostgreSQL/SQLite/SQL Server (syntax differs!)\n- {plain_english_request}: Describe what you want in normal language\n- {table_names_and_columns}: List your tables and their columns\n\nThe more detail about your table structure, the more accurate the query. Include data types if relevant.",
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
      exampleOutput: "**Input:**\n{notes}: \"talked about Q1 roadmap, sarah wants mobile app done by march, mike says we need 2 more devs, budget is tight according to lisa, tom will update the public page, we should revisit QA hiring in jan, next meeting jan 6 for sprint planning...\"\n\n**Output:**\n\n**1. Meeting Overview:**\nQ1 product roadmap discussion focused on mobile app timeline, resource constraints, and hiring needs. Key tension between aggressive timeline and limited budget.\n\n**2. Key Decisions Made:**\n- Mobile app v2 launches March 15 (not end of Q1)\n- Pause enterprise features until core product stability improves\n- Hire 2 frontend devs - job posts go live next week\n\n**3. Action Items:**\n| Who | What | Deadline |\n|-----|------|----------|\n| Sarah | Finalize mobile app requirements doc | Dec 27 |\n| Mike | Set up interviews for frontend roles | Jan 3 |\n| Lisa | Create stability metrics dashboard | Jan 10 |\n| Tom | Update public roadmap page | Dec 23 |\n\n**4. Open Questions:**\n- Do we need a dedicated QA hire? (Revisit in January)\n- Budget approval for new hires? (Lisa following up with finance)\n\n**5. Next Steps:**\nReview requirements doc before holiday break\n\n**6. Follow-up Meeting:**\nYes - Jan 6, 2025 for sprint planning on mobile v2",
      usageTips: "Fill in the {notes} variable with your meeting notes or transcript. Can be messy - bullet points, sentence fragments, or full transcript all work.\n\nThe more detail you include, the better the action items. Include names of attendees so it can assign owners correctly.",
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
      exampleOutput: "**Input:**\n- Task: Monitor a website price and notify me when it drops below $500\n- Input: URL of product page\n- Output: Slack notification when price drops\n- Libraries: any\n\n**Output:**\n\n```python\n\"\"\"Price Monitor - Sends Slack alert when price drops below target.\"\"\"\n\nimport requests\nfrom bs4 import BeautifulSoup\nimport time\nimport os\nfrom typing import Optional\n\n\ndef get_price(url: str) -> Optional[float]:\n    \"\"\"Scrape current price from product page.\"\"\"\n    try:\n        response = requests.get(url, headers={\"User-Agent\": \"Mozilla/5.0\"})\n        response.raise_for_status()\n        soup = BeautifulSoup(response.content, \"html.parser\")\n        price_elem = soup.select_one(\".price, [data-price]\")\n        if not price_elem:\n            return None\n        price_text = price_elem.get_text(strip=True)\n        return float(''.join(c for c in price_text if c.isdigit() or c == '.'))\n    except Exception as e:\n        print(f\"Error fetching price: {e}\")\n        return None\n\n\ndef send_slack_alert(price: float, url: str) -> None:\n    \"\"\"Send notification to Slack webhook.\"\"\"\n    webhook_url = os.environ.get(\"SLACK_WEBHOOK_URL\")\n    if not webhook_url:\n        raise ValueError(\"SLACK_WEBHOOK_URL not set\")\n    \n    requests.post(webhook_url, json={\n        \"text\": f\"Price Alert! Now ${price:.2f} - {url}\"\n    })\n\n\ndef main() -> None:\n    \"\"\"Main monitoring loop.\"\"\"\n    URL = \"https://example.com/product\"\n    TARGET_PRICE = 500\n    CHECK_INTERVAL = 3600  # 1 hour\n    \n    print(f\"Monitoring {URL} for price < ${TARGET_PRICE}\")\n    \n    while True:\n        price = get_price(URL)\n        if price:\n            print(f\"Current price: ${price:.2f}\")\n            if price < TARGET_PRICE:\n                send_slack_alert(price, URL)\n                print(\"Alert sent!\")\n                break\n        time.sleep(CHECK_INTERVAL)\n\n\nif __name__ == \"__main__\":\n    # Example usage:\n    # export SLACK_WEBHOOK_URL=\"your-webhook-url\"\n    # python price_monitor.py\n    main()\n```",
      usageTips: "Fill in all variables for best results:\n- {task}: Describe what you want to automate in plain English\n- {input_description}: What data/files does it need?\n- {output_description}: What should the result be?\n- {libraries}: Specific libraries or \"any\" for AI to choose\n\nMention if you need it to run on a schedule, handle errors gracefully, or work with specific file formats.",
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
      exampleOutput: "**Input:**\n- Review: \"Shipping took forever and the packaging was damaged. Product works fine but I expected better for the price.\"\n- Rating: 2/5\n- Platform: Amazon\n- Business type: Electronics retailer\n\n**Output:**\n\nHi [Customer name],\n\nThank you for your honest feedback - and I'm genuinely sorry about the shipping delay and packaging issues. That's not the experience we want for you, especially at this price point.\n\nI've flagged this with our fulfillment team to investigate the delay, and we're reviewing our packaging with our shipping partners to prevent damage.\n\nI'd love to make this right. Could you email me directly at support@[company].com? I'll personally ensure your next order arrives quickly and in perfect condition - on us.\n\nThanks for giving us a chance to improve.\n\nBest,\n[Your name]\nCustomer Experience, [Company]\n\n---\n**Why this response works:**\n- Addresses specific issues (shipping + packaging)\n- Takes responsibility without excuses\n- Shows concrete action being taken\n- Offers resolution\n- Takes conversation private",
      usageTips: "Fill in all variables for best results:\n- {review_text}: Paste the exact review\n- {star_rating}: 1-5 (tone adjusts automatically)\n- {platform}: Google/Yelp/Amazon/Trustpilot (format differs)\n- {business_type}: Helps tailor the response\n\nFor negative reviews, always have a resolution ready to offer. For positive reviews, the response will focus on gratitude and reinforcement.",
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
      exampleOutput: "**Input:**\n- Topic: Why startups should use AI for customer support\n- Target keyword: AI customer support for startups\n- Word count: 2000\n- Audience: Startup founders and ops managers\n- Goal: convert\n\n**Output:**\n\n**1. Title (SEO-optimized):**\nAI Customer Support for Startups: Save 40% on Support Costs in 2025\n\n**2. Meta Description (155 chars):**\nLearn how AI customer support helps startups reduce costs by 40% while improving response times. Step-by-step implementation guide inside.\n\n**3. Introduction Hook:**\nOpen with: \"Your support ticket volume doubles with every funding round. Your headcount budget doesn't.\"\n\n**4. Outline:**\n\n**H2: The Real Cost of Manual Support for Startups**\n- Average support agent salary + benefits ($45-65k)\n- Hidden costs: training, turnover, management overhead\n- Founder time spent on support (opportunity cost)\n\n**H2: What AI Customer Support Actually Looks Like in 2025**\n- Beyond basic chatbots: modern AI capabilities\n- Real examples: Intercom Fin, Zendesk AI, Freshdesk Freddy\n- What AI handles vs. what needs humans (diagram idea)\n\n**H2: 5 Benefits of AI Support for Early-Stage Startups**\n- H3: 24/7 availability without night shifts\n- H3: Instant response times (customer expectations data)\n- H3: Consistent answers every time\n- H3: Scales instantly during launches\n- H3: Actionable data insights\n\n**H2: How to Implement AI Support This Weekend**\n- Step 1: Audit your current tickets (find patterns)\n- Step 2: Choose your tool (comparison table)\n- Step 3: Train on existing docs/tickets\n- Step 4: Set up human handoff rules\n- Step 5: Monitor and improve\n\n**H2: Common Mistakes to Avoid**\n- Hiding that it's AI\n- No escalation path\n- Set-and-forget mentality\n\n**5. Internal/External Links:**\n- Internal: Link to customer success tools comparison\n- External: Gartner AI in customer service stats\n\n**6. CTA:**\n\"Start with a free trial of [Tool]. Most startups see results within 48 hours.\"\n\n**7. FAQ Schema:**\nQ: How much does AI customer support cost?\nQ: Can AI handle complex technical questions?\nQ: Will customers know they're talking to AI?",
      usageTips: "Fill in all variables for best results:\n- {topic}: Be specific about your angle\n- {primary_keyword}: Your main SEO target\n- {word_count}: Affects depth of outline\n- {audience}: Who is reading this?\n- {goal}: inform/convert/entertain (changes CTA style)\n\nFor SEO content, include your target keyword in the topic description for better title suggestions.",
      outputScreenshots: []
    }
  },
  {
    id: "cmjb8d1ks000k8ax4d8do2myw",
    title: "Midjourney Prompt Crafter",
    data: {
      targetAudience: "Designers, marketers, content creators, and anyone creating AI-generated images",
      useCase: "When you have an image idea but don't know how to write a Midjourney prompt that gets the result you want",
      recommendedModel: "GPT-4 or Claude 3 (for crafting the prompt) - Then use output in Midjourney",
      exampleOutput: "**Input:**\n- Concept: Hero image for a fintech startup website\n- Style: photorealistic\n- Mood: bright, trustworthy\n- Aspect ratio: 16:9\n\n**Output:**\n\n**1. Main Prompt:**\n```\nAbstract 3D visualization of financial growth, translucent glass cubes ascending like a bar chart, soft blue gradient background, golden light rays piercing through, floating geometric particles, clean minimal composition, professional corporate aesthetic, 8k, photorealistic rendering --ar 16:9 --v 6 --style raw\n```\n\n**2. Recommended Parameters:**\n- `--ar 16:9` - Widescreen for hero images\n- `--v 6` - Latest Midjourney version\n- `--style raw` - Less stylized, more photorealistic\n- `--q 2` - Higher quality (optional, costs more)\n\n**3. Alternative Versions:**\n\n*Version B (More Human):*\n```\nConfident diverse business team in modern glass office, city skyline through windows, natural morning light, candid moment of collaboration, blue and white color palette, shallow depth of field, editorial photography --ar 16:9 --v 6\n```\n\n*Version C (More Abstract):*\n```\nFlowing streams of light blue data particles forming upward arrow, dark navy background, cinematic lighting, volumetric fog, digital art meets corporate minimal --ar 16:9 --v 6 --style raw\n```\n\n**4. Tips for Iterating:**\n- Use `--no text, words, letters` if unwanted text appears\n- Add `--seed [number]` to create variations of a good result\n- Try `--chaos 20` for more unexpected variations",
      usageTips: "Fill in all variables for best results:\n- {image_description}: Describe your vision in detail\n- {style}: photorealistic/illustration/3D render/watercolor/oil painting/etc.\n- {mood}: dark/bright/dreamy/dramatic/minimalist/energetic\n- {ratio}: 1:1 (square), 16:9 (landscape), 9:16 (portrait/mobile), 4:3\n\nBe specific about colors, lighting, and composition. Mention what you want to AVOID using \"--no [thing]\".",
      outputScreenshots: []
    }
  }
];

async function seedProofData() {
  console.log('Starting proof data update (v2 with detailed usageTips)...\n');

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

  console.log('\nDone! All 10 prompts now have improved proof data with variable instructions.');
}

seedProofData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
