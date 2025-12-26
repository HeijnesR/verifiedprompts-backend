const prisma = require('./db');

prisma.prompt.findMany({
  select: {
    id: true,
    title: true,
    category: true
  }
})
.then(prompts => {
  console.log(JSON.stringify(prompts, null, 2));
})
.finally(() => prisma.$disconnect());