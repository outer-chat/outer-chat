import * as swagger from '@nestjs/swagger';
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { Channel } from './dto/Channel';
import { ChannelService } from './channel.service';
import { Roles } from 'src/guards/roles/roles.decorator';
import { Role } from 'src/guards/roles/roles.enum';
import { RolesGuard } from 'src/guards/roles/roles.guard';

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
    @UseGuards(RolesGuard)
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
    createChannel(@Body() channel: Channel): Promise<string> {
        return this.channelService.createChannel(channel);
    }
}
