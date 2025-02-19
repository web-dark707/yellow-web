import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { SMA, EMA, ATR } from 'technicalindicators';

@Injectable()
export class IndicatorService implements OnModuleInit {
  private prices: number[] = []; // 存储历史价格 + 实时价格
  private highs: number[] = []; // 高点
  private lows: number[] = []; // 低点
  private closes: number[] = []; // 收盘价
  private signalConfirmed: boolean = false; // 是否已确认信号

  async onModuleInit() {
    console.log('Initializing IndicatorService...');
  }

  /**
   * @description: 获取历史K线数据
   */
  private async fetchHistoricalData(
    symbol: string,
    days: number,
  ): Promise<void> {
    const apiUrl = `https://api.exchange.com/kline?symbol=${symbol}&interval=1d&limit=${days}`;
    const response = await axios.get(apiUrl);

    response.data.forEach((kline) => {
      this.highs.push(parseFloat(kline[2])); // 最高价
      this.lows.push(parseFloat(kline[3])); // 最低价
      this.closes.push(parseFloat(kline[4])); // 收盘价
    });
  }

  /**
   * @description: 初始化历史数据
   */
  async initializeData(symbol: string): Promise<void> {
    await this.fetchHistoricalData(symbol, 119);
    this.prices = [...this.closes];
  }

  /**
   * @description: 计算买卖信号
   */
  private async calculateSignal(): Promise<'BUY' | 'SELL' | 'NO SIGNAL'> {
    if (this.prices.length < 119) {
      throw new Error('Insufficient historical data');
    }

    // 计算 SMA 和 EMA
    const smaValues = SMA.calculate({ period: 120, values: this.prices });
    const emaValues = EMA.calculate({ period: 10, values: this.prices });

    if (smaValues.length === 0 || emaValues.length < 2) {
      return 'NO SIGNAL';
    }

    const latestSMA120 = smaValues[smaValues.length - 1];
    const latestEMA10 = emaValues[emaValues.length - 1];
    const prevEMA10 = emaValues[emaValues.length - 2];
    const emaSlope = latestEMA10 - prevEMA10;

    if (latestEMA10 > latestSMA120 && emaSlope > 0) {
      return 'BUY'; // 金叉信号
    } else if (latestEMA10 < latestSMA120 && emaSlope < 0) {
      return 'SELL'; // 死叉信号
    }

    return 'NO SIGNAL';
  }

  /**
   * @description: 计算开仓和平仓价格
   */
  async calculateTradingRanges(
    currentPrice: number,
    k: number,
  ): Promise<{ openPrice: number; closePrice: number }> {
    if (this.signalConfirmed) {
      return { openPrice: currentPrice, closePrice: currentPrice }; // 已确认信号，保持不动
    }

    if (this.prices.length < 119) {
      throw new Error('Insufficient historical data');
    }

    // 添加当前价格到数组
    this.prices.push(currentPrice);
    this.closes.push(currentPrice);

    if (this.prices.length > 120) {
      this.prices.shift();
      this.closes.shift();
      this.highs.shift();
      this.lows.shift();
    }

    // 计算 ATR
    const atrValues = ATR.calculate({
      period: 14,
      high: this.highs,
      low: this.lows,
      close: this.closes,
    });

    if (atrValues.length === 0) {
      throw new Error('Insufficient ATR data');
    }

    const latestATR = atrValues[atrValues.length - 1];

    // 判断买卖信号
    const signal = await this.calculateSignal();

    if (signal === 'BUY' || signal === 'SELL') {
      this.signalConfirmed = true; // 确认信号
      const triggerRange = 0.001 * currentPrice + k * latestATR;

      if (signal === 'BUY') {
        // 做多
        const openPrice = currentPrice + triggerRange;
        const closePrice = currentPrice - triggerRange;
        return { openPrice, closePrice };
      } else if (signal === 'SELL') {
        // 做空
        const openPrice = currentPrice - triggerRange;
        const closePrice = currentPrice + triggerRange;
        return { openPrice, closePrice };
      }
    }

    return { openPrice: currentPrice, closePrice: currentPrice }; // 无信号时返回当前价格范围
  }

  /**
   * @description: 每日清理逻辑
   */
  async endOfDay(): Promise<void> {
    if (this.signalConfirmed) {
      console.log('Signal confirmed, waiting for next signal reset.');
      // 保持信号状态，等待下一次信号触发
    } else {
      console.log('No confirmed signal, continuing monitoring.');
    }
  }

  /**
   * @description: 重置信号（例如下一次洗盘）
   */
  resetSignal(): void {
    this.signalConfirmed = false;
    console.log('Signal reset, monitoring resumed.');
  }
}
