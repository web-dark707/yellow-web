import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isObject } from 'lodash';
import * as crypto from 'crypto';
import { axiosWithRetry } from '@/utils/request';

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
export class BinanceTradingviewService {
  // Binance 时间偏移量
  private timeOffset: number = 0;
  constructor(private readonly configService: ConfigService) {}

  /**
   * @description: binance交易
   */
  async binanceTrading(payload: Payload) {
    if (!isObject(payload) || Object.keys(payload).length === 0) {
      throw new Error('传入数据格式错误');
    }
    return await this.binanceContractTrade(payload);
  }

  /**
   * @description: Binance合约交易，需要分清开仓和平仓，开仓需要先平仓，然后再开仓，确定方向。
   */
  async binanceContractTrade(payload: Payload) {
    const {
      symbol,
      action,
      amount,
      leverage,
      stopLoss,
      takeProfit,
      market_position,
    } = payload;

    const { apiKey, secretKey } = this.configService.get('binance');
    const baseUrl = 'https://fapi.binance.com';
    const contractSymbol = `${symbol.replace(/.P$/i, '')}`;

    try {
      // 同步时间偏移
      await this.syncTimeOffset(baseUrl);

      // 获取市场价格
      const currentPrice = await this.getMarketPrice(
        baseUrl,
        contractSymbol,
        apiKey,
      );

      // 计算开仓数量
      const quantity = this.calculateContracts(amount, leverage, currentPrice);

      // 获取当前持仓信息
      const positionInfo = await this.getPositionInfo(
        baseUrl,
        contractSymbol,
        apiKey,
        secretKey,
      );

      // 判断是否有持仓, 如果有持仓则先平仓, 再开仓
      const hasPosition = !!positionInfo.find(
        (pos) => parseFloat(pos.positionAmt) !== 0,
      );

      // 做多开仓的情况
      if (action === 'buy' && market_position === 'long') {
        //如果当前有持仓先平仓，再开仓
        if (hasPosition) {
          await this.closePosition(baseUrl, contractSymbol, apiKey, secretKey);
          console.log(`平仓成功`);
        }
        // 开仓操作
        await this.openPosition(
          baseUrl,
          contractSymbol,
          action,
          market_position,
          quantity,
          currentPrice,
          leverage,
          stopLoss,
          takeProfit,
          apiKey,
          secretKey,
        );
        console.log(`做多开仓成功`);
      }

      // 做空开仓的情况
      if (action === 'sell' && market_position === 'short') {
        //如果当前有持仓先平仓，再开仓
        if (hasPosition) {
          await this.closePosition(baseUrl, contractSymbol, apiKey, secretKey);
          console.log(`平仓成功`);
        }
        // 开仓操作
        await this.openPosition(
          baseUrl,
          contractSymbol,
          action,
          market_position,
          quantity,
          currentPrice,
          leverage,
          stopLoss,
          takeProfit,
          apiKey,
          secretKey,
        );
        console.log(`做空开仓成功`);
      }
      // 平仓的情况
      if (market_position === 'flat') {
        //如果当前有持仓直接平仓
        if (hasPosition) {
          await this.closePosition(baseUrl, contractSymbol, apiKey, secretKey);
          console.log(`平仓成功`);
        } else {
          console.log('当前没有持仓,无需平仓');
        }
      }

      console.log('交易成功');
    } catch (error) {
      console.error('交易错误:', error.response?.data || error.message);
      throw new Error('交易失败');
    }
  }

  /**
   * @description: 生成签名
   */
  createSignature(secretKey: string, queryString: string): string {
    return crypto
      .createHmac('sha256', secretKey)
      .update(queryString)
      .digest('hex');
  }

  /**
   * @description 同步时间偏移
   */
  async syncTimeOffset(baseUrl: string) {
    const localTime = Date.now();
    const serverTime = await this.getServerTime(baseUrl);
    this.timeOffset = serverTime - localTime;
  }

  /**
   * @description 获取校准后的时间戳
   */
  getAdjustedTimestamp(): number {
    return Date.now() + this.timeOffset;
  }

  /**
   * @description: 获取服务器时间
   */
  async getServerTime(baseUrl: string): Promise<number> {
    const endpoint = '/fapi/v1/time';
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url,
      });

      if (response.data && response.data.serverTime) {
        return response.data.serverTime;
      } else {
        throw new Error('未能获取服务器时间');
      }
    } catch (error) {
      console.error(
        '获取服务器时间错误:',
        error.response?.data || error.message,
      );
      throw new Error('获取服务器时间失败');
    }
  }

  /**
   * @description: 获取当前持仓信息
   */
  async getPositionInfo(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const endpoint = '/fapi/v2/positionRisk';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000; // 设置时间窗口为 10 秒
    const params = `symbol=${symbol}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      if (response.data) {
        return response.data;
      } else {
        throw new Error('未能获取持仓信息');
      }
    } catch (error) {
      console.error('获取持仓信息错误:', error.response?.data || error.message);
      throw new Error('获取持仓信息失败');
    }
  }

  /**
   * @description 获取市场行情数据
   */
  async getMarketPrice(baseUrl: string, symbol: string, apiKey: string) {
    const endpoint = '/fapi/v1/ticker/price';
    const url = `${baseUrl}${endpoint}?symbol=${symbol}`;

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      if (response.data && response.data.price) {
        return parseFloat(response.data.price);
      } else {
        throw new Error('未能获取市场价格');
      }
    } catch (error) {
      console.error('获取市场价格失败:', error.response?.data || error.message);
      throw new Error('获取市场价格失败');
    }
  }

  /**
   * @description: 获取当前市场价格并计算可开仓数量
   */
  calculateContracts(amount: string, leverage: string, price: number) {
    const tradeAmount = parseFloat(amount);
    const leverageMultiplier = parseFloat(leverage);

    return ((tradeAmount * leverageMultiplier) / price).toFixed(3);
  }

  /**
   * @description: 获取止损价和止盈价
   */
  calculateStopLossAndTakeProfit(
    currentPrice: number, // 当前价格
    stopLoss: string, // 止损比例
    takeProfit: string, // 止盈比例
    marketPosition: string, // 市场方向
  ) {
    const stopLossPercent = parseFloat(stopLoss) / 100;
    const takeProfitPercent = parseFloat(takeProfit) / 100;

    if (marketPosition === 'long') {
      return {
        stopLossPrice: (currentPrice * (1 - stopLossPercent)).toFixed(2),
        takeProfitPrice: (currentPrice * (1 + takeProfitPercent)).toFixed(2),
      };
    } else if (marketPosition === 'short') {
      return {
        stopLossPrice: (currentPrice * (1 + stopLossPercent)).toFixed(2),
        takeProfitPrice: (currentPrice * (1 - takeProfitPercent)).toFixed(2),
      };
    } else {
      throw new Error('市场方向无效，应为 "long" 或 "short"');
    }
  }

  /**
   * @description 设置杠杆
   */
  async setLeverage(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    leverage: string, // 杠杆倍数
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const endpoint = '/fapi/v1/leverage';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;
    const params = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      await axiosWithRetry({
        method: 'post',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      console.log('杠杆设置成功');
    } catch (error) {
      console.error('杠杆设置失败:', error.response?.data || error.message);
      throw new Error('杠杆设置失败');
    }
  }

  /**
   * @description 开仓操作
   */
  async openPosition(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    side: string, // 交易方向
    market_position: string, // 市场方向
    quantity: string, // 交易数量
    currentPrice: number, // 当前价格
    leverage: string, // 杠杆倍数
    stopLoss: string, // 止损比例
    takeProfit: string, // 止盈比例
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const takeProfitSide = market_position === 'long' ? 'BUY' : 'SELL';
    const endpoint = '/fapi/v1/order';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;
    const orderParams = `symbol=${symbol}&side=${takeProfitSide}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const orderSignature = this.createSignature(secretKey, orderParams);
    const orderUrl = `${baseUrl}${endpoint}?${orderParams}&signature=${orderSignature}`;

    // 设置杠杆
    await this.setLeverage(baseUrl, symbol, leverage, apiKey, secretKey);

    // 计算止损价和止盈价
    const { stopLossPrice, takeProfitPrice } =
      this.calculateStopLossAndTakeProfit(
        currentPrice,
        stopLoss,
        takeProfit,
        market_position,
      );

    try {
      await axiosWithRetry({
        method: 'post',
        url: orderUrl,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      // 添加止损订单
      if (stopLossPrice) {
        await this.setStopLoss(
          baseUrl,
          symbol,
          takeProfitSide,
          quantity,
          stopLossPrice,
          apiKey,
          secretKey,
        );
      }

      // 添加止盈订单
      if (takeProfitPrice) {
        await this.setTakeProfit(
          baseUrl,
          symbol,
          takeProfitSide,
          quantity,
          takeProfitPrice,
          apiKey,
          secretKey,
        );
      }

      console.log('开仓成功');
    } catch (error) {
      console.error('开仓失败:', error.response?.data || error.message);
      throw new Error('开仓失败');
    }
  }

  /**
   * @description 平仓操作
   */
  async closePosition(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const endpoint = '/fapi/v1/order';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;

    // 获取当前持仓信息
    const positionInfo = await this.getPositionInfo(
      baseUrl,
      symbol,
      apiKey,
      secretKey,
    );
    const position = positionInfo.find(
      (pos) => parseFloat(pos.positionAmt) !== 0,
    );
    if (!position) {
      throw new Error('没有持仓可以平仓');
    }

    // 取消止损和止盈订单
    await this.cancelOpenOrders(baseUrl, symbol, apiKey, secretKey);

    // 获取持仓方向并取反
    const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY';
    const quantity = Math.abs(parseFloat(position.positionAmt)).toFixed(3);

    const params = `symbol=${symbol}&side=${side}&type=MARKET&quantity=${quantity}&reduceOnly=true&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      await axiosWithRetry({
        method: 'post',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });
      console.log('平仓成功');
    } catch (error) {
      console.error('平仓失败:', error.response?.data || error.message);
      throw new Error('平仓失败');
    }
  }

  /**
   * @description 设置止损订单
   */
  async setStopLoss(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    side: string, // 交易方向
    quantity: string, // 交易数量
    stopLossPrice: string, // 止损价格
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const endpoint = '/fapi/v1/order';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;
    const stopSide = side === 'BUY' ? 'SELL' : 'BUY';
    const params = `symbol=${symbol}&side=${stopSide}&type=STOP_MARKET&quantity=${quantity}&stopPrice=${stopLossPrice}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      await axiosWithRetry({
        method: 'post',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      console.log('止损订单设置成功');
    } catch (error) {
      console.error('止损订单设置失败:', error.response?.data || error.message);
      throw new Error('止损订单设置失败');
    }
  }

  /**
   * @description 设置止盈订单
   */
  async setTakeProfit(
    baseUrl: string, // 交易所地址
    symbol: string, // 交易币种
    side: string, // 交易方向
    quantity: string, // 交易数量
    takeProfitPrice: string, // 止盈价格
    apiKey: string, // API Key
    secretKey: string, // Secret Key
  ) {
    const endpoint = '/fapi/v1/order';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;
    const takeProfitSide = side === 'BUY' ? 'SELL' : 'BUY';
    const params = `symbol=${symbol}&side=${takeProfitSide}&type=TAKE_PROFIT_MARKET&quantity=${quantity}&stopPrice=${takeProfitPrice}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      await axiosWithRetry({
        method: 'post',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      console.log('止盈订单设置成功');
    } catch (error) {
      console.error('止盈订单设置失败:', error.response?.data || error.message);
      throw new Error('止盈订单设置失败');
    }
  }

  /**
   * @description:  取消所有挂单
   */
  async cancelOpenOrders(
    baseUrl: string,
    symbol: string,
    apiKey: string,
    secretKey: string,
  ) {
    const endpoint = '/fapi/v1/allOpenOrders';
    const timestamp = this.getAdjustedTimestamp();
    const recvWindow = 10000;
    const params = `symbol=${symbol}&timestamp=${timestamp}&recvWindow=${recvWindow}`;
    const signature = this.createSignature(secretKey, params);
    const url = `${baseUrl}${endpoint}?${params}&signature=${signature}`;

    try {
      await axiosWithRetry({
        method: 'delete',
        url,
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      });

      console.log('取消挂单成功');
    } catch (error) {
      console.error('取消挂单失败:', error.response?.data || error.message);
      throw new Error('取消挂单失败');
    }
  }
}
