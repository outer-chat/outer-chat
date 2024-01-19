import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule, AuthModule],
})

export class AppModule {}
