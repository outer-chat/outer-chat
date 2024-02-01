import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';

import { PrismaService } from './prisma/prisma.service';
import { AppModule } from './modules';

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

async function createAdminUserIfNotExists() {
  const prisma = new PrismaService();
  const admin = await prisma.user.findUnique({
    where: {
      email: 'admin',
    },
  });
  if (!admin) {
    const password = 'admin';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        email: 'admin',
        username: 'admin',
        password: hashedPassword,
        roles: ['ADMIN', 'USER'],
      },
    });
  }
  prisma.$disconnect();
}

async function createDocument(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle('OUTER.CHAT API')
    .setDescription('The OUTER.CHAT API documentation')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.setGlobalPrefix('api');

  await createDocument(app);
  await createAdminUserIfNotExists();
  await app.listen(port, host);
}

main();
