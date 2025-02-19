import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { TradingviewModule } from './tradingview/tradingview.module';
import { getConfiguration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      envFilePath: '.env',
    }),
    ///导入速率限制模块   ttl:单位秒钟， 表示ttl秒内最多只能请求 limit 次， 避免暴力攻击。
    ThrottlerModule.forRoot([
      {
        ttl: 60, //60秒
        limit: 60, //60次
      },
    ]),
    TradingviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, //速率限制守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
