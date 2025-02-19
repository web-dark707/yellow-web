import { Injectable } from '@nestjs/common';

interface Payload {
  symbol: string; // 交易币种
  action: string; // 买入或卖出
  price: string; // 开仓价格
  contracts: string; // 合约数量
  position_size: string; // 仓位大小
  market_position: string; // 做多或做空
  time: string; // 开仓时间
  amount: string; // 交易金额
  leverage: string; // 杠杆倍数
  stopLoss: string; //止损比例
  takeProfit: string; // 止盈比例
}

@Injectable()
export class BybitTradingviewService {
  bybitTrading(payload: any) {
    return payload;
  }
}
