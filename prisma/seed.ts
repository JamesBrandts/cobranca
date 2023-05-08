import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "rachel@remix.run";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  await prisma.contribuinte.deleteMany().catch(() => { });
  await prisma.economia.deleteMany().catch(() => { });
  await prisma.atividade.deleteMany().catch(() => { });
  await prisma.divida.deleteMany().catch(() => { });
  await prisma.user.deleteMany().catch(() => { });
  await prisma.password.deleteMany().catch(() => { });
  await prisma.note.deleteMany().catch(() => { });
  await prisma.cobranca.deleteMany().catch(() => { });
  await prisma.item.deleteMany().catch(() => { });
  await prisma.tag.deleteMany().catch(() => { });


  // seed the database with the initial data
  const hashedPassword = await bcrypt.hash("1234567890", 10);

  await prisma.user.create({
    data: {
      email: "admin@mail.com",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        email: `user${i}@mail.com`,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    }
    )
  }

  for (let i = 0; i < 100; i++) {
    await prisma.contribuinte.create({
      data: {
        nome: `Contribuinte ${i}`,
        cpf_cnpj: `${Math.floor(Math.random() * 100000000000)}${i}`,
        email: `contribuinte${i}@mail.com`,
        telefone: `(51)9${Math.floor(Math.random() * 100000000)}`
      }
    })
  }

  const contribuintes = await prisma.contribuinte.findMany();
  for (let contribuinte of contribuintes) {
    const economia = await prisma.economia.create({
      data: {
        contribuinteId: contribuinte.id,
      }
    })
    for (let i = 0; i < Math.random() * 100; i++) {
      await prisma.divida.create({
        data: {
          valor: Math.floor(Math.random() * 100000),
          contribuinteId: contribuinte.id,
          tributo: "IPTU",
          economiaId: economia.id,
          exercicio: 2013 + Math.floor(Math.random() * 10),
          parcela: Math.floor(Math.random() * 10),
          tipo: "N"
        }
      })
    }
    for (let i = 0; i < Math.random() * 100; i++) {
      await prisma.divida.create({
        data: {
          valor: Math.floor(Math.random() * 100000),
          contribuinteId: contribuinte.id,
          tributo: "IPTU",
          economiaId: economia.id,
          exercicio: 2013 + Math.floor(Math.random() * 10),
          parcela: Math.floor(Math.random() * 10),
          tipo: "P"
        }
      })
    }
  }
  

  for (let contribuinte of contribuintes) {
    const atividade = await prisma.atividade.create({
      data: {
        contribuinteId: contribuinte.id,
      }
    })
    for (let i = 0; i < Math.random() * 50; i++) {
      await prisma.divida.create({
        data: {
          valor: Math.floor(Math.random() * 1000000),
          contribuinteId: contribuinte.id,
          tributo: "ISSQN",
          atividadeId: atividade.id,
          exercicio: 2013 + Math.floor(Math.random() * 10),
          parcela: Math.floor(Math.random() * 10),
          tipo: "N"
        }
      })
    }
    for (let i = 0; i < Math.random() * 50; i++) {
      await prisma.divida.create({
        data: {
          valor: Math.floor(Math.random() * 1000000),
          contribuinteId: contribuinte.id,
          tributo: "ISSQN",
          atividadeId: atividade.id,
          exercicio: 2013 + Math.floor(Math.random() * 10),
          parcela: Math.floor(Math.random() * 10),
          tipo: "P"
        }
      })
    }
  }

  console.log(`Database has been seeded. 🌱`);
}



seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
