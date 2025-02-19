import { Controller, Post, Body } from '@nestjs/common';
import { OkxTradingviewService } from './okx-tradingview.service';
import { BinanceTradingviewService } from './binance-tradingview.service';
import { BitgetTradingviewService } from './bitget-tradingview.service';
import { BybitTradingviewService } from './bybit-tradingview.service';
import { NotifyService } from './notify-service';

@Controller('tradingview')
export class TradingviewController {
  constructor(
    private readonly okxTradingviewService: OkxTradingviewService,
    private readonly binanceTradingviewService: BinanceTradingviewService,
    private readonly bitgetTradingviewService: BitgetTradingviewService,
    private readonly bybitTradingviewService: BybitTradingviewService,
    private readonly notifyService: NotifyService,
  ) {}

  // okx交易所
  @Post('/okx-trading')
  okxTrading(@Body() payload) {
    return this.okxTradingviewService.okxTrading(payload);
  }

  // binance交易所
  @Post('/binance-trading')
  binanceTrading(@Body() payload) {
    return this.binanceTradingviewService.binanceTrading(payload);
  }

  // bitget交易所
  @Post('/bitget-trading')
  bitgetTrading(@Body() payload) {
    return this.bitgetTradingviewService.bitgetTrading(payload);
  }

  // bybit交易所
  @Post('/bybit-trading')
  bybitTrading(@Body() payload) {
    return this.bybitTradingviewService.bybitTrading(payload);
  }

  // 通知
  @Post('/notify')
  notify(@Body() payload) {
    return this.notifyService.notify(payload);
  }
}
