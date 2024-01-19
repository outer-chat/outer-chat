import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './modules';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

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
  await app.listen(port, host);
}

main();
