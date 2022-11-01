import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateRoomDto } from './dtos/create-room.dto';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  private static readonly logger = new Logger(ChatGateway.name);

  handleConnection(client: Socket) {
    ChatGateway.logger.debug(
      `${client.id}(${client.handshake.query['username']}) is connected!`,
    );

    this.server.emit('msgToClient', {
      name: `admin`,
      text: `join chat.`,
    });
  }
  handleDisconnect(client: Socket) {
    ChatGateway.logger.debug(`${client.id} is disconnected...`);
  }
  afterInit(server: any) {
    ChatGateway.logger.debug(`Socket Server Init Complete`);
  }
  /*
  @SubscribeMessage('create-room')
  handleMessage(@MessageBody() createRoomDto: CreateRoomDto): string {
    console.log(createRoomDto);
    return 'Hello world!';
  }
  */

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: { name: string; text: string }): void {
    this.server.emit('msgToClient', payload);
  }
}
