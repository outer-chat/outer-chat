import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

import { UserController } from '../controllers';
import { UserService } from '../services';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}
