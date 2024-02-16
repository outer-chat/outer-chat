import * as swagger from '@nestjs/swagger';
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { Channel } from './dto/Channel';
import { ChannelService } from './channel.service';

@swagger.ApiTags('channel')
@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @swagger.ApiOkResponse({
        status: 200,
        description: 'Returns the prompted channel',
        type: Channel,
    })
    @Get(':id')
    getChannel(@Param('id') id: string): Promise<Channel> {
        return this.channelService.getChannel(id);
    }
}
