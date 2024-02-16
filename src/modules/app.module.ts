import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChannelModule } from '../channel/channel.module';

@Module({
  imports: [UserModule, AuthModule, ChannelModule],
})

export class AppModule {}
