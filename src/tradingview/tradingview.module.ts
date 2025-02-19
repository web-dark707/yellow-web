import { Module } from '@nestjs/common';
import { OkxTradingviewService } from './okx-tradingview.service';
import { BinanceTradingviewService } from './binance-tradingview.service';
import { BitgetTradingviewService } from './bitget-tradingview.service';
import { BybitTradingviewService } from './bybit-tradingview.service';
import { NotifyService } from './notify-service';
import { IndicatorService } from './indicator.service';
import { TradingviewController } from './tradingview.controller';

@Module({
  controllers: [TradingviewController],
  providers: [
    OkxTradingviewService,
    BinanceTradingviewService,
    BitgetTradingviewService,
    BybitTradingviewService,
    NotifyService,
    IndicatorService,
  ],
})
export class TradingviewModule {}
