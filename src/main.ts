import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

import { PrismaService } from './prisma/prisma.service';
import { AppModule } from './modules';
import { Logger } from '@nestjs/common';

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminEmail = process.env.ADMIN_EMAIL || 'admin';
const adminPasswordSaveFilePath = process.env.ADMIN_PASSWORD_SAVE_FILE_PATH || './admin-password.txt';

async function createAdminUserIfNotExists() {
  const logger = new Logger('AdminUserCreation');
  const prisma = new PrismaService();
  const admin = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });
  if (!admin) {
    const password = Math.random().toString(36);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: adminUsername,
        password: hashedPassword,
        roles: ['ADMIN'],
      },
    });
    fs.writeFileSync(adminPasswordSaveFilePath, password);
    logger.log(`Admin user created, password saved to ${adminPasswordSaveFilePath}`);
    logger.verbose(`I advise you to change the password as soon as possible and to delete the file ${adminPasswordSaveFilePath}`);
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
