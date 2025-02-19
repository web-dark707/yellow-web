import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return '欢迎使用老真君策略后台服务，实现自动量化交易，赚取长期稳定收益!';
  }
}
