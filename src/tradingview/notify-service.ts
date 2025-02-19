import { isProd } from '@/config/env';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Telegraf } from 'telegraf';
import { isObject } from 'lodash';
import { ConfigService } from '@nestjs/config';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import { axiosWithRetry } from '@/utils/request';

dayjs.extend(utc);
dayjs.extend(timezone);
// 设置全局默认时区为上海
dayjs.tz.setDefault('Asia/Shanghai');

interface Payload {
  symbol: string; // 交易币种
  action: string; // 买入或卖出
  price: string; // 开仓价格
  contracts: string; // 合约数量
  position_size: string; // 仓位大小
  market_position: string; // 做多或做空
  time: string; // 开仓时间
  interval: string; // K线周期
  amount: string; // 交易金额
  leverage: string; // 杠杆倍数
  stopLoss: string; //止损比例
  takeProfit: string; // 止盈比例
}

@Injectable()
export class NotifyService {
  private tradingviewBot: any;

  constructor(private readonly configService: ConfigService) {
    this.createTradingviewBot();
  }

  /**
   * @description: 创建TradingviewBot
   */
  createTradingviewBot() {
    if (isProd()) {
      this.tradingviewBot = new Telegraf(
        this.configService.get('telegram.tradingview_secret'),
      );
      this.tradingviewBot.launch();
    }
  }

  /**
   * @description: 通知
   */
  async notify(payload: any) {
    if (isProd()) {
      const message = this.formatMessage(payload);
      // 推送通知到 Telegram
      // await this.tradingviewBot.telegram.sendMessage(-1002363106002, message);
      // 推送通知到 Pushover
      await this.sendPushoverNotification(message);
    }
  }

  /**
   * @description: 格式化消息
   */
  formatMessage(payload: Payload) {
    if (!isObject(payload) || Object.keys(payload).length === 0) {
      return '传入数据格式错误';
    }

    const getActionText = () => {
      if (payload.action === 'buy') {
        return '做多';
      }
      if (payload.action === 'sell') {
        return '做空';
      }
    };

    const formattedTime = dayjs
      .tz(dayjs(payload.time).valueOf(), 'Asia/Shanghai')
      .format('YYYY-MM-DD HH:mm:ss');
    const symbol = payload.symbol.replace(/USDT.P$/i, '');

    // 转换周期
    let intervalFormatted = `${payload.interval}分钟`;
    const intervalNumber = parseInt(payload.interval, 10);
    if (intervalNumber >= 1440) {
      intervalFormatted = `${(intervalNumber / 1440).toFixed(0)}天`;
    } else if (intervalNumber >= 60) {
      intervalFormatted = `${(intervalNumber / 60).toFixed(0)}小时`;
    }

    return `
      🔔 **交易提醒**
      - **币种**: ${symbol}
      - **操作**: ${getActionText()}
      - **价格**: ${parseFloat(payload.price).toFixed(2)}
      - **周期**: ${intervalFormatted}
      - **时间**: ${formattedTime}
      `;
  }

  /**
   * @description:  发送Pushover通知
   */
  async sendPushoverNotification(message: string) {
    const pushoverApiUrl = 'https://api.pushover.net/1/messages.json';
    const pushoverUserKey = this.configService.get('pushover.userKey');
    const pushoverApiToken = this.configService.get('pushover.token');

    const payload = {
      token: pushoverApiToken,
      user: pushoverUserKey,
      message: message,
      title: '交易提醒',
      sound: 'climb',
      priority: 2,
      retry: 60,
      expire: 180,
    };

    try {
      await axiosWithRetry({
        method: 'post',
        url: pushoverApiUrl,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('pushover 错误:', error.response?.data || error.message);
    }
  }
}
