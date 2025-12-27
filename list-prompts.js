const prisma = require('./db');

prisma.prompt.findMany({
  select: {
    title: true,
    promptText: true
  }
})
.then(p => console.log(JSON.stringify(p, null, 2)))
.finally(() => prisma.$disconnect());