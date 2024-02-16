import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Channel } from './dto/Channel';

@Injectable()
export class ChannelService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getChannel(id: string) : Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!channel)
      throw new BadRequestException(`Channel with id ${id} does not exist!`);

    return channel as unknown as Channel;
  }
}
