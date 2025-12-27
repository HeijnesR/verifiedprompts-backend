// server.js - VerifiedPrompts Backend

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();
const prisma = require('./db');
const { verifyPrompt } = require('./verify');

// Anthropic client voor proof data generatie
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Stripe configuratie
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  maxNetworkRetries: 3,
  timeout: 30000,
});

// Maak de server
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware om JWT te checken
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Geen token, toegang geweigerd' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Ongeldige token' });
    }
    req.user = user;
    next();
  });
}

// Functie om proof data te genereren met Claude
async function generateProofData(title, description, promptText, category) {
  try {
    const modelsPath = path.join(__dirname, 'models.json');
    let modelsConfig = {};
    try {
      modelsConfig = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
    } catch (e) {
      // Fallback als bestand niet bestaat
      modelsConfig = {
        models: {
          chatgpt: { recommended: "GPT-5.2" },
          claude: { recommended: "Claude 4.5 Sonnet" }
        }
      };
    }

    const systemPrompt = `You are an expert at analyzing AI prompts and generating compelling proof data for a prompt marketplace. Your task is to analyze a prompt and generate marketing-friendly proof data that helps buyers understand the value.

Always respond in valid JSON format with these exact fields:
- targetAudience: Who should buy this prompt (1-2 sentences)
- useCase: Primary use case and problem it solves (1-2 sentences)  
- recommendedModel: Which AI model works best (use current models: ${modelsConfig.models?.chatgpt?.recommended || 'GPT-5.2'}, ${modelsConfig.models?.claude?.recommended || 'Claude 4.5 Sonnet'}, ${modelsConfig.models?.midjourney?.recommended || 'Midjourney v7'})
- exampleOutput: A realistic example of what output this prompt generates (use markdown formatting, 100-300 words)
- usageTips: How to get the best results, including which variables to fill in (use markdown formatting, list the variables found in the prompt)`;

    const userPrompt = `Analyze this prompt and generate proof data:

**Title:** ${title}
**Description:** ${description}
**Category:** ${category}
**Prompt Text:**
${promptText}

Generate compelling proof data in JSON format. For the exampleOutput, create a realistic example of what this prompt would generate. For usageTips, identify all variables in curly braces like {variable_name} and explain what to fill in for each.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        { role: "user", content: userPrompt }
      ],
      system: systemPrompt
    });

    const responseText = message.content[0].text;
    
    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = responseText;
    if (responseText.includes('```json')) {
      jsonStr = responseText.split('```json')[1].split('```')[0];
    } else if (responseText.includes('```')) {
      jsonStr = responseText.split('```')[1].split('```')[0];
    }
    
    const proofData = JSON.parse(jsonStr.trim());
    
    return {
      targetAudience: proofData.targetAudience || '',
      useCase: proofData.useCase || '',
      recommendedModel: proofData.recommendedModel || '',
      exampleOutput: proofData.exampleOutput || '',
      usageTips: proofData.usageTips || ''
    };
  } catch (error) {
    console.error('Error generating proof data:', error);
    // Return empty proof data if generation fails
    return {
      targetAudience: '',
      useCase: '',
      recommendedModel: '',
      exampleOutput: '',
      usageTips: ''
    };
  }
}

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'VerifiedPrompts API is running!',
    status: 'success'
  });
});

// Haal actuele AI modellen op
app.get('/models', (req, res) => {
  try {
    const modelsPath = path.join(__dirname, 'models.json');
    const modelsData = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));
    res.json(modelsData);
  } catch (error) {
    // Fallback als bestand niet bestaat
    res.json({
      lastUpdated: "2024-12-27",
      models: {
        chatgpt: { recommended: "GPT-5.2" },
        claude: { recommended: "Claude 4.5 Sonnet" },
        gemini: { recommended: "Gemini 3" },
        midjourney: { recommended: "Midjourney v7" }
      },
      promptRecommendations: {
        code: "Claude 4.5 Opus or GPT-5.2",
        business: "GPT-5.2 or Claude 4.5 Sonnet",
        marketing: "GPT-5.2 or Claude 4.5 Sonnet",
        creative: "Claude 4.5 Sonnet or GPT-5.2",
        image: "Use prompt with Midjourney v7"
      }
    });
  }
});

// Update models.json (admin)
app.put('/models', authenticateToken, (req, res) => {
  try {
    const modelsPath = path.join(__dirname, 'models.json');
    const newData = {
      ...req.body,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    fs.writeFileSync(modelsPath, JSON.stringify(newData, null, 2));
    res.json({ message: 'Models updated', data: newData });
  } catch (error) {
    res.status(500).json({ error: 'Could not update models', details: error.message });
  }
});

// Haal alle users op
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Registreer nieuwe user
app.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Deze email is al geregistreerd' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: role || 'buyer'
      }
    });

    res.status(201).json({ 
      message: 'User aangemaakt!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Ongeldige email of wachtwoord' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Ongeldige email of wachtwoord' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login succesvol!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Haal alle prompts op (met filters)
app.get('/prompts', async (req, res) => {
  try {
    const { category, aiModel, minPrice, maxPrice, verified } = req.query;
    
    const where = {
      status: 'approved'
    };
    
    if (category) where.category = category;
    if (aiModel) where.aiModel = aiModel;
    if (verified === 'true') where.isVerified = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const prompts = await prisma.prompt.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        category: true,
        aiModel: true,
        verificationScore: true,
        qualityScore: true,
        consistencyScore: true,
        isVerified: true,
        createdAt: true,
        targetAudience: true,
        useCase: true,
        recommendedModel: true,
        exampleOutput: true,
        outputScreenshots: true,
        usageTips: true,
        seller: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Maak nieuwe prompt aan met automatische proof data generatie
app.post('/prompts', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, aiModel, promptText } = req.body;

    if (!title || !description || !price || !category || !aiModel || !promptText) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    // Genereer proof data met AI
    console.log('Generating proof data for:', title);
    const proofData = await generateProofData(title, description, promptText, category);
    console.log('Proof data generated:', proofData.targetAudience ? 'Success' : 'Empty');

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        aiModel,
        promptText,
        sellerId: req.user.userId,
        status: 'pending',
        // Auto-generated proof data
        targetAudience: proofData.targetAudience,
        useCase: proofData.useCase,
        recommendedModel: proofData.recommendedModel,
        exampleOutput: proofData.exampleOutput,
        usageTips: proofData.usageTips
      }
    });

    res.status(201).json({ 
      message: 'Prompt aangemaakt met automatische proof data!',
      prompt
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Haal prompt details op (promptText alleen als gekocht of eigenaar)
app.get('/prompts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let userId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Token ongeldig, maar dat is ok
      }
    }

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: {
        seller: {
          select: { id: true, name: true }
        }
      }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt niet gevonden' });
    }

    let hasAccess = false;
    if (userId) {
      const isOwner = prompt.sellerId === userId;
      const hasPurchased = await prisma.purchase.findFirst({
        where: { buyerId: userId, promptId: id }
      });
      hasAccess = isOwner || !!hasPurchased;
    }

    const response = {
      id: prompt.id,
      title: prompt.title,
      description: prompt.description,
      price: prompt.price,
      category: prompt.category,
      aiModel: prompt.aiModel,
      verificationScore: prompt.verificationScore,
      qualityScore: prompt.qualityScore,
      consistencyScore: prompt.consistencyScore,
      isVerified: prompt.isVerified,
      seller: prompt.seller,
      createdAt: prompt.createdAt,
      hasAccess: hasAccess,
      targetAudience: prompt.targetAudience,
      useCase: prompt.useCase,
      recommendedModel: prompt.recommendedModel,
      exampleOutput: prompt.exampleOutput,
      outputScreenshots: prompt.outputScreenshots,
      usageTips: prompt.usageTips
    };

    if (hasAccess) {
      response.promptText = prompt.promptText;
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Verifieer een prompt
app.post('/prompts/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    const prompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt niet gevonden' });
    }

    const testInputs = [
      { onderwerp: 'sollicitatie', toon: 'formeel', lengte: 'kort' },
      { onderwerp: 'klacht over product', toon: 'beleefd maar direct', lengte: 'gemiddeld' },
      { onderwerp: 'bedankje aan collega', toon: 'vriendelijk', lengte: 'kort' }
    ];

    const verification = await verifyPrompt(prompt.promptText, testInputs, 3);

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        verificationScore: verification.verificationScore,
        qualityScore: verification.qualityScore,
        consistencyScore: verification.consistencyScore,
        isVerified: verification.isVerified,
        status: verification.isVerified ? 'approved' : 'rejected'
      }
    });

    res.json({
      message: verification.isVerified ? 'Prompt geverifieerd!' : 'Prompt afgekeurd',
      verification,
      prompt: updatedPrompt
    });

  } catch (error) {
    res.status(500).json({ error: 'Verificatie error', details: error.message });
  }
});

// Maak Stripe checkout sessie voor een prompt
app.post('/prompts/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.userId;

    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: { seller: true }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    if (prompt.status !== 'approved') {
      return res.status(400).json({ error: 'This prompt is not available' });
    }

    if (prompt.sellerId === buyerId) {
      return res.status(400).json({ error: 'You cannot buy your own prompt' });
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { buyerId, promptId: id }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You already own this prompt' });
    }

    const priceInCents = Math.round(prompt.price * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: prompt.title,
              description: prompt.description || 'AI Prompt',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://getverifiedprompts.com/purchase-success?session_id={CHECKOUT_SESSION_ID}&prompt_id=${id}`,
      cancel_url: `https://getverifiedprompts.com/prompt/${id}`,
      metadata: {
        promptId: id,
        buyerId: buyerId,
      },
    });

    res.json({ checkoutUrl: session.url });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Checkout error', details: error.message });
  }
});

// Bevestig aankoop na succesvolle betaling
app.post('/prompts/:id/confirm-purchase', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;
    const buyerId = req.user.userId;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    if (session.metadata.promptId !== id || session.metadata.buyerId !== buyerId) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { buyerId, promptId: id }
    });

    if (existingPurchase) {
      const prompt = await prisma.prompt.findUnique({ where: { id } });
      return res.json({
        message: 'Already purchased',
        promptText: prompt.promptText
      });
    }

    const prompt = await prisma.prompt.findUnique({ where: { id } });

    const purchase = await prisma.purchase.create({
      data: {
        buyerId,
        promptId: id,
        amount: prompt.price
      }
    });

    res.json({
      message: 'Purchase confirmed!',
      purchase,
      promptText: prompt.promptText
    });

  } catch (error) {
    res.status(500).json({ error: 'Confirmation error', details: error.message });
  }
});

// Gratis purchase endpoint (voor testen)
app.post('/prompts/:id/purchase', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const buyerId = req.user.userId;

    const prompt = await prisma.prompt.findUnique({
      where: { id }
    });

    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    if (prompt.status !== 'approved') {
      return res.status(400).json({ error: 'This prompt is not available' });
    }

    if (prompt.sellerId === buyerId) {
      return res.status(400).json({ error: 'You cannot buy your own prompt' });
    }

    const existingPurchase = await prisma.purchase.findFirst({
      where: { buyerId, promptId: id }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You already own this prompt' });
    }

    const purchase = await prisma.purchase.create({
      data: {
        buyerId,
        promptId: id,
        amount: prompt.price
      }
    });

    res.status(201).json({
      message: 'Prompt purchased!',
      purchase,
      promptText: prompt.promptText
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Haal mijn gekochte prompts op
app.get('/my/purchases', authenticateToken, async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { buyerId: req.user.userId },
      include: {
        prompt: {
          select: {
            id: true,
            title: true,
            description: true,
            promptText: true,
            category: true,
            aiModel: true,
            seller: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// Stripe Webhook endpoint
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const { promptId, buyerId } = session.metadata;
      
      const existingPurchase = await prisma.purchase.findFirst({
        where: { buyerId, promptId }
      });

      if (!existingPurchase) {
        const prompt = await prisma.prompt.findUnique({ where: { id: promptId } });
        
        await prisma.purchase.create({
          data: {
            buyerId,
            promptId,
            amount: prompt.price
          }
        });
        
        console.log('Purchase created via webhook for prompt:', promptId);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }

  res.json({ received: true });
});

// Start de server
app.listen(PORT, () => {
  console.log(`
  ================================
  🚀 VerifiedPrompts Server Started!
  ================================
  URL: http://localhost:${PORT}
  ================================
  `);
});
