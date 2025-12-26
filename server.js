// server.js - VerifiedPrompts Backend

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const prisma = require('./db');
const { verifyPrompt } = require('./verify');

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

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'VerifiedPrompts API is running!',
    status: 'success'
  });
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
        // NIEUW: bewijs velden
        targetAudience: true,
        useCase: true,
        recommendedModel: true,
        exampleOutput: true,
        outputScreenshots: true,
        usageTips: true,
        // END NIEUW
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

// Maak nieuwe prompt aan (alleen voor ingelogde users)
app.post('/prompts', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, aiModel, promptText } = req.body;

    if (!title || !description || !price || !category || !aiModel || !promptText) {
      return res.status(400).json({ error: 'Alle velden zijn verplicht' });
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        aiModel,
        promptText,
        sellerId: req.user.userId,
        status: 'pending'
      }
    });

    res.status(201).json({ 
      message: 'Prompt aangemaakt!',
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
      // NIEUW: bewijs velden
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

    // Haal de prompt op
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

    // Check of al gekocht
    const existingPurchase = await prisma.purchase.findFirst({
      where: { buyerId, promptId: id }
    });

    if (existingPurchase) {
      return res.status(400).json({ error: 'You already own this prompt' });
    }

    // Bereken prijs in centen (Stripe werkt met centen)
    const priceInCents = Math.round(prompt.price * 100);

    // Maak Stripe checkout sessie
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

    // Verifieer de Stripe sessie
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    if (session.metadata.promptId !== id || session.metadata.buyerId !== buyerId) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    // Check of al gekocht
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

    // Haal prompt op
    const prompt = await prisma.prompt.findUnique({ where: { id } });

    // Maak de purchase aan
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

// Gratis purchase endpoint (voor testen - kan later verwijderd worden)
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

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Automatisch purchase aanmaken na succesvolle betaling
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
