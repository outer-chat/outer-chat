import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

    channel.recipients = channel.recipients.map((recipient) => recipient.userId) as any;

    if (!channel)
      throw new NotFoundException(`Channel with id ${id} does not exist!`);

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
      channel.recipients = channel.recipients.map((recipient) => recipient.userId) as any;
    });

    return channels as unknown as Channel[];
  }

  async createChannel(channel: Channel, ownerId: string) : Promise<string> {
    if (!ownerId)
      throw new BadRequestException('Owner id must be provided to create a channel!');
    if (!channel.recipients || channel.recipients.length === 0)
      throw new BadRequestException('No recipients have been provided can\'t proceed with channel creation!');
    if (!Array.isArray(channel.recipients))
      throw new BadRequestException('Recipients must be an array of user(s)');

    const newChannel = await this.prisma.channel.create({
      data: {
          ...channel,
          ownerId: ownerId,
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
            create: channel.recipients.map((recipient) => ({
            userId: recipient as any,
            })),
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

  async addRecipients(channelId: string, recipientIds: string[]) : Promise<string> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel)
      throw new NotFoundException(`Channel with id ${channelId} does not exist`);

    if (!Array.isArray(recipientIds))
      throw new BadRequestException('Recipient(s) must be an array of string(s)');
    if (recipientIds.length === 0)
      throw new BadRequestException('Recipient(s) must not be empty');

    const updatedChannel = await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        recipients: {
          create: recipientIds.map((id) => ({
            userId: id as any,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return `Recipient(s) with id(s) ${recipientIds.join(', ')} have been added to channel with id ${updatedChannel.id}!`;
  }

  async removeRecipients(channelId: string, recipientIds: string[]) : Promise<string> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel)
      throw new NotFoundException(`Channel with id ${channelId} does not exist`);

    if (!Array.isArray(recipientIds))
      throw new BadRequestException('Recipient(s) must be an array of string(s)');
    if (recipientIds.length === 0)
      throw new BadRequestException('Recipient(s) must not be empty');

    const updatedChannel = await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        recipients: {
          deleteMany: recipientIds.map((id) => ({
            userId: id as any,
          })),
        },
      },
      select: {
        id: true,
      },
    });

    return `Recipient(s) with id(s) ${recipientIds.join(', ')} have been removed from channel with id ${updatedChannel.id}!`;
  }

  async channelEdition(channelId: string, channel: Channel) : Promise<string> {
    const forbiddenFields = ['id', 'createdAt', 'updatedAt', 'messages', 'recipients', 'serverId', "ownerId"];

    if (Object.keys(channel).some((key) => forbiddenFields.includes(key)))
      throw new BadRequestException(`The following fields are not allowed to be updated: ${forbiddenFields.join(', ')}`);

    const updatedChannel = await this.prisma.channel.update({
      where: {
        id: channelId,
      },
      data: {
        ...channel,
        messages: {
          updateMany: channel.messages?.map((message) => ({
            where: { id: message.id },
            data: message,
          })),
        },
        recipients: {
          set: channel.recipients?.map((recipient) => ({
            id: recipient.id,
          })),
        },
        permissionOverwrites: {
          set: channel.permissionOverwrites?.map((permissionOverwrite) => ({
            ...permissionOverwrite,
            type: Number(permissionOverwrite.type),
            allow: permissionOverwrite.allow.toString(),
            deny: permissionOverwrite.deny.toString(),
          })),
        },
      },
    });

    if (!updatedChannel)
      throw new NotFoundException(`Channel with id ${channelId} does not exist`);

    return `Channel with id ${updatedChannel.id} has been updated!`;
  }

  async deleteChannel(channelId: string) : Promise<string> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
    });

    if (!channel)
      throw new NotFoundException(`Channel with id ${channelId} does not exist`);

    await this.prisma.channel.delete({
      where: {
        id: channelId,
      },
    });

    return `Channel with id ${channelId} has been deleted!`;
  }
}
