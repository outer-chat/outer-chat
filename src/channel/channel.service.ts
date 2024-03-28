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
      include: {
        recipients: true,
        messages: true,
        permissionOverwrites: true,
      },
    });

    if (!channel)
      throw new BadRequestException(`Channel with id ${id} does not exist!`);

    return channel as unknown as Channel;
  }

  async getChannels() : Promise<Channel[]> {
    const channels = await this.prisma.channel.findMany({
      include: {
        recipients: true,
        messages: true,
        permissionOverwrites: true,
      },
    });

    channels.forEach((channel) => {
      channel.recipients.forEach((recipient) => {
        delete recipient.password;
        delete recipient.channelId;
      });
    });

    return channels as unknown as Channel[];
  }

  async createChannel(channel: Channel) : Promise<string> {

    if (!channel.recipients || channel.recipients.length === 0)
      throw new BadRequestException('No recipients have been provided can\'t proceed with channel creation!');

    const newChannel = await this.prisma.channel.create({
      data: {
        ...channel,
        messages: {
          create: channel.messages?.map((message) => ({
            ...message,
            author: {
              connect: {
                id: message.authorId,
              },
            },
          })) || [],
        },
        recipients: {
          connect: channel.recipients?.map((recipient) => ({
            id: recipient.toString(),
          })) || [],
        },
        permissionOverwrites: {
          create: channel.permissionOverwrites?.map((permissionOverwrite) => ({
            ...permissionOverwrite,
            type: Number(permissionOverwrite.type),
            allow: permissionOverwrite.allow.toString(),
            deny: permissionOverwrite.deny.toString(),
          })) || [],
        },
      },
      select: {
        id: true,
      },
    });

    return `Channel with id ${newChannel.id} has been created!`;
  }
}
