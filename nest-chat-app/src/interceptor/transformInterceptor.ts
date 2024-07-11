import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private readonly logger = new Logger(TransformInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Promise<Observable<any>> {
    const now = Date.now();

    // this.logger.log(`Interceptor:: ${JSON.stringify(context, null, 2)}`);
    // return next.handle().pipe(map((data) => ({ data })));

    // const client: Client = context.switchToWs().getClient();
    // this.logger.log(`Interceptor: ${context.id}`);

    // const args = context.getArgs();
    // args[1] = `${args[1]} - Hello World`;

    const client = context.switchToWs().getClient();
    const recvData = context.switchToWs().getData();

    client.seqNo++;
    const seqNo = client.seqNo;

    this.logger.log(
      `[Before] Client: ${client.id}, seqNo: ${seqNo}, Data: ${recvData}`,
    );

    // context.switchToWs().getData().data = 'Hello World';

    // 수신받은 데이터를 가공한다
    // const data = recvData;
    // return next.handle().pipe(map((data) => ({ data })));

    // throw new ForbiddenException();
    // return null;

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `[After] Client: ${
            client.id
          }, seqNo: ${seqNo}, Data: ${recvData} -> ${Date.now() - now}ms`,
        );
        client.send(`${seqNo} end`);
      }),
      finalize(() => {
        this.logger.log(`finalize`);
      }),
    );
  }
}
