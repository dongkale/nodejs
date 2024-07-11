import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/user-data.dto';
import { Server, Socket } from 'ws';

@Injectable()
export class WsChatService {
  private readonly logger = new Logger(WsChatService.name);

  private wsClients: Array<UserDto> = [];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  addClient(client: any): number {
    this.wsClients.push({ index: 0, client: client });

    const findValue = this.wsClients.findIndex(
      (item) => item.client === client,
    );

    this.logger.log(`Client Added: ${findValue}`);

    return findValue;
  }

  deleteClient(client: any): number {
    const findValue = this.wsClients.findIndex(
      (item) => item.client === client,
    );
    if (findValue > -1) {
      this.wsClients.splice(findValue, 1);
    }

    this.logger.log(`Client Delete: ${findValue}`);

    return findValue;
  }

  broadcast(client: any, message: string, flag: boolean): number {
    // const findValue = this.wsClients.findIndex(
    //   (item) => item.client === client,
    // );

    const filteredList = flag
      ? this.wsClients.filter((item) => item.client !== client)
      : this.wsClients;

    for (const item of filteredList) {
      item.client.send(message);
    }

    this.logger.log(`Client Broadcast: ${filteredList.length}`);

    // for (let [index, val] of this.wsClients.entries()) {
    //   item.client.send(message);
    // }

    return filteredList.length;
  }

  funcBroadcast(message: string, fn: (number, any, string) => boolean): number {
    // this.logger.log(`Client BroadcastFunc: ${this.wsClients.length}`);

    let count = 0;

    for (const [index, value] of this.wsClients.entries()) {
      if (!fn(index, value.client, message)) {
        break;
      }

      count++;
    }

    return count;
  }

  getCount() {
    return this.wsClients.length;
  }

  getJson(client: any) {
    return client ? JSON.stringify(client) : JSON.stringify(this.wsClients);
  }

  getIndex(client: any) {
    return this.wsClients.findIndex((item) => item.client === client);
  }
}
