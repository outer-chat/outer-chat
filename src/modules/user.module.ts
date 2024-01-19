import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';

import { UserController } from 'src/controllers';
import { UserService } from 'src/services';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {}
