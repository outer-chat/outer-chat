import * as swagger from '@nestjs/swagger';
import { Controller, Get, Param, Post, Body, UseGuards, Delete, Patch, Request } from '@nestjs/common';
import { Channel } from './dto/Channel';
import { ChannelService } from './channel.service';
import { Roles } from '../guards/roles/roles.decorator';
import { Role } from '../guards/roles/roles.enum';
import { RolesGuard } from '../guards/roles/roles.guard';
import { ChannelGuard } from '../guards/channel/channel.guard';

@swagger.ApiTags('channels')
@Controller('channels')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Returns the prompted channel',
        type: Channel,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard, ChannelGuard)
    @Get(':id')
    getChannel(@Param('id') id: string): Promise<Channel> {
        return this.channelService.getChannel(id);
    }

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Returns all channels, can only be accessed by an admin',
        type: [Channel],
    })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Get()
    getChannels(): Promise<Channel[]> {
        return this.channelService.getChannels();
    }

    @swagger.ApiCreatedResponse({
        status: 201,
        description: 'Creates a new channel',
        type: String,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    createChannel(@Body() channel: Channel, @Request() req: any): Promise<string> {
        const ownerId = req.user.userId;
        return this.channelService.createChannel(channel, ownerId);
    }

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Add a recipient(s) to a channel',
        type: String,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post(':id/recipients')
    addRecipients(@Param('id') id: string, @Body() recipients: string[]): Promise<string> {
        return this.channelService.addRecipients(id, recipients);
    }

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Remove a recipient(s) from a channel',
        type: String,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id/recipients')
    removeRecipients(@Param('id') id: string, @Body() recipients: string[]): Promise<string> {
        return this.channelService.removeRecipients(id, recipients);
    }

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Edit a channel',
        type: String,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Patch(':id')
    editChannel(@Param('id') id: string, @Body() channel: Channel): Promise<string> {
        return this.channelService.channelEdition(id, channel);
    }

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Delete a channel',
        type: String,
    })
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id')
    deleteChannel(@Param('id') id: string): Promise<string> {
        return this.channelService.deleteChannel(id);
    }
}
