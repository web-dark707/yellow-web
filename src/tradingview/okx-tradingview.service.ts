import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isObject } from 'lodash';
import * as crypto from 'crypto';
import { axiosWithRetry } from '@/utils/request';
import { NotifyService } from './notify-service';
import { contractSymbolDecimal, contractSymbolValue } from '@/config/options';

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
  leverage: string; // 杠杆倍数，okx的杠杆倍数只能在app上设置
  stopLoss: string; //止损比例
  takeProfit: string; // 止盈比例
}

@Injectable()
export class OkxTradingviewService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notifyService: NotifyService,
  ) {}

  /**
   * @description: okx交易
   */
  async okxTrading(payload: any) {
    if (!isObject(payload) || Object.keys(payload).length === 0) {
      return '传入数据格式错误';
    }
    // okx 合约交易
    await this.okxContractTrade(payload);
    // 通知
    await this.notifyService.notify(payload);
    return '交易成功';
  }

  /**
   * @description: 生成签名
   */
  createSignature(
    secretKey: string,
    timestamp: string,
    method: string,
    requestPath: string,
    body = '',
  ): string {
    const what = timestamp + method + requestPath + body;
    const hmac = crypto.createHmac('sha256', secretKey);
    return hmac.update(what).digest('base64');
  }

  /**
   * @description: okx合约交易,需要分清开仓和平仓，开仓需要先平仓，然后再开仓，确定方向。确保不同币种独立处理
   */
  async okxContractTrade(payload: Payload) {
    const {
      symbol,
      action,
      amount,
      leverage,
      stopLoss,
      takeProfit,
      market_position,
    } = payload;

    const { apiKey, secretKey, passphrase } = this.configService.get('okx');
    const baseUrl = 'https://www.okx.com';
    const contractSymbol = `${symbol.replace(/USDT.P$/i, '')}-USDT-SWAP`;

    try {
      // 获取当前 symbol 的持仓信息
      const position = await this.getPositionInfo(
        contractSymbol,
        apiKey,
        secretKey,
        passphrase,
        baseUrl,
      );

      // 如果要做多，先平仓，再开多单
      if (action === 'buy' && market_position === 'long') {
        if (position && Number(position.pos) > 0) {
          console.log('已经持有多单，无需重复开多');
        } else {
          await this.closePosition(
            contractSymbol,
            apiKey,
            secretKey,
            passphrase,
            baseUrl,
          );
          console.log('已平仓，准备开多单');
          await this.openPosition(
            contractSymbol, // 合约币种
            amount, // 交易金额
            leverage, // 杠杆倍数
            market_position, // 做多或做空
            action, // 买入或卖出
            stopLoss, // 止损比例
            takeProfit, // 止盈比例
            apiKey, // api key
            secretKey, // secret key
            passphrase, // passphrase
            baseUrl, // 请求地址
          );
          console.log(`做多开仓成功`);
        }
      }

      // 如果要做空，先平仓，再开空单
      if (action === 'sell' && market_position === 'short') {
        if (position && Number(position.pos) < 0) {
          console.log('已经持有空单，无需重复开空');
        } else {
          await this.closePosition(
            contractSymbol,
            apiKey,
            secretKey,
            passphrase,
            baseUrl,
          );
          console.log('已平仓，准备开空单');

          await this.openPosition(
            contractSymbol, // 合约币种
            amount, // 交易金额
            leverage, // 杠杆倍数
            market_position, // 做多或做空
            action, // 买入或卖出
            stopLoss, // 止损比例
            takeProfit, // 止盈比例
            apiKey, // api key
            secretKey, // secret key
            passphrase, // passphrase
            baseUrl, // 请求地址
          );
          console.log(`做空开仓成功`);
        }
      }

      // 如果是平仓指令
      if (market_position === 'flat') {
        if (position && position.pos !== '0') {
          await this.closePosition(
            contractSymbol,
            apiKey,
            secretKey,
            passphrase,
            baseUrl,
          );
          console.log('平仓成功');
        } else {
          console.log('当前没有持仓，无需平仓');
        }
      }

      console.log('交易成功');
    } catch (error) {
      console.error('交易错误:', error.response?.data || error.message);
      throw new Error('交易失败');
    }
  }

  /**
   * @description: 获取当前合约的持仓信息（仅返回指定 symbol 的持仓数据）
   */
  async getPositionInfo(
    symbol: string,
    apiKey: string,
    secretKey: string,
    passphrase: string,
    baseUrl: string,
  ) {
    const timestamp = new Date().toISOString();
    const method = 'GET';
    const requestPath = `/api/v5/account/positions`; // 获取所有持仓

    const signature = this.createSignature(
      secretKey,
      timestamp,
      method,
      requestPath,
    );

    const headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url: `${baseUrl}${requestPath}`,
        headers,
      });

      if (response.data.code !== '0') {
        console.error('获取当前持仓信息失败:', response.data);
        return null;
      }

      // 遍历持仓数据，查找指定 symbol 的持仓信息
      const position = response.data.data.find((p) => p.instId === symbol);

      return position || null; // 如果没有持仓，则返回 null
    } catch (error) {
      console.error(
        '获取当前持仓信息失败:',
        error.message || error.response?.data,
      );
      throw new Error('获取当前持仓信息失败');
    }
  }

  /**
   * @description: 获取市场行情数据
   */
  async getMarketPrice(baseUrl: string, secretKey, symbol: string) {
    const requestPath = `/api/v5/market/ticker?instId=${symbol}`;
    const timestamp = new Date().toISOString();
    const method = 'GET';

    const signature = this.createSignature(
      secretKey,
      timestamp,
      method,
      requestPath,
    );

    const headers = {
      'OK-ACCESS-KEY': this.configService.get('okx.apiKey'),
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url: `${baseUrl}${requestPath}`,
        headers,
      });

      if (response.data.code !== '0') {
        console.error('获取市场数据失败:', response.data);
      }

      return response.data.data[0]; // 返回市场数据
    } catch (error) {
      console.error('获取市场数据失败:', error.message || error.response?.data);
      throw new Error('获取市场数据失败');
    }
  }

  /**
   * @description: 获取当前市场价格并计算可开仓数量，并使其符合 lot size 规则
   */
  async getOpenPositionAmount(
    baseUrl: string,
    secretKey: string,
    symbol: string,
    amount: string,
    leverage: string,
    apiKey: string,
    passphrase: string,
  ) {
    const marketData = await this.getMarketPrice(baseUrl, secretKey, symbol);
    if (!marketData) {
      throw new Error('无法获取市场数据');
    }

    // 获取合约交易规则，调试币种的最小交易单位和合约面值
    const { lotSize, contractValue } = await this.getLotSizeAndContractValue(
      baseUrl,
      apiKey,
      secretKey,
      passphrase,
      symbol,
    );

    //当前价格
    const lastPrice = parseFloat(marketData.last);
    // 杠杆倍数 * 交易金额 / 当前价格 = 开仓数量
    const leverageMultiplier = parseFloat(leverage);

    const openAmount = (
      (Number(amount) * leverageMultiplier * contractSymbolValue[symbol]) /
      lastPrice
    ).toFixed(contractSymbolDecimal[symbol]);

    console.log('当前价格:', lastPrice);
    console.log('杠杆倍数:', leverageMultiplier);
    console.log('交易金额:', amount);
    console.log('最小交易单位:', lotSize);
    console.log('合约面值:', contractValue);
    console.log('开仓数量:', openAmount);

    return openAmount;
  }

  /**
   * @description: 获取合约交易规则 (lot size 和 contract value)
   */
  async getLotSizeAndContractValue(
    baseUrl: string,
    apiKey: string,
    secretKey: string,
    passphrase: string,
    symbol: string,
  ) {
    const requestPath = `/api/v5/public/instruments?instType=SWAP`;
    const timestamp = new Date().toISOString();
    const method = 'GET';

    const signature = this.createSignature(
      secretKey,
      timestamp,
      method,
      requestPath,
    );

    const headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axiosWithRetry({
        method: 'get',
        url: `${baseUrl}${requestPath}`,
        headers,
      });

      if (response.data.code !== '0') {
        console.error('获取合约信息失败:', response.data);
        throw new Error('获取合约信息失败');
      }

      // 找到匹配的 symbol
      const instrument = response.data.data.find(
        (inst) => inst.instId === symbol,
      );

      if (!instrument) {
        throw new Error(`未找到 ${symbol} 的交易规则`);
      }

      return {
        lotSize: parseFloat(instrument.lotSz), // 最小交易单位
        contractValue: parseFloat(instrument.ctVal), // 合约面值
      };
    } catch (error) {
      console.error('获取合约信息失败:', error.message || error.response?.data);
      throw new Error('获取合约信息失败');
    }
  }

  /**
   * @description: 获取止损价和止盈价
   */
  async getStopLossAndTakeProfitPrice(
    baseUrl: string, // 请求地址
    secretKey: string, // secret key
    symbol: string, // 合约币种
    stopLoss: string, // 止损比例
    takeProfit: string, // 止盈比例
    market_position: string, // 做多或做空
  ) {
    const marketData = await this.getMarketPrice(baseUrl, secretKey, symbol);

    if (!marketData) {
      throw new Error('无法获取市场数据');
    }

    // 当前价格
    const lastPrice = parseFloat(marketData.last);

    let stopLossPrice, takeProfitPrice;

    if (market_position === 'long') {
      // 做多时，止损价低于当前价格，止盈价高于当前价格
      stopLossPrice = (lastPrice * (1 - parseFloat(stopLoss) / 100)).toFixed(2);
      takeProfitPrice = (
        lastPrice *
        (1 + parseFloat(takeProfit) / 100)
      ).toFixed(2);
    } else if (market_position === 'short') {
      // 做空时，止损价高于当前价格，止盈价低于当前价格
      stopLossPrice = (lastPrice * (1 + parseFloat(stopLoss) / 100)).toFixed(2);
      takeProfitPrice = (
        lastPrice *
        (1 - parseFloat(takeProfit) / 100)
      ).toFixed(2);
    } else {
      throw new Error('市场方向无效，应为 "long" 或 "short"');
    }

    return {
      stopLossPrice,
      takeProfitPrice,
    };
  }

  /**
   * @description: 开仓操作
   */
  async openPosition(
    symbol: string, // 合约币种
    amount: string, // 交易金额
    leverage: string, // 杠杆倍数
    market_position: string, // 做多或做空
    action: string, // 买入或卖出
    stopLoss: string, // 止损比例
    takeProfit: string, // 止盈比例
    apiKey: string, // api key
    secretKey: string, // secret key
    passphrase: string, // passphrase
    baseUrl: string, // 请求地址
  ) {
    const timestamp = new Date().toISOString();
    const method = 'POST';
    const requestPath = '/api/v5/trade/order';
    const slide = market_position === 'long' ? 'buy' : 'sell';

    // 获取可开仓数量
    const openAmount = await this.getOpenPositionAmount(
      baseUrl,
      secretKey,
      symbol,
      amount,
      leverage,
      apiKey,
      passphrase,
    );
    console.log('开仓数量:', openAmount);

    // 获取止损价和止盈价
    const { stopLossPrice, takeProfitPrice } =
      await this.getStopLossAndTakeProfitPrice(
        baseUrl,
        secretKey,
        symbol,
        stopLoss,
        takeProfit,
        market_position,
      );

    console.log('止损价:', stopLossPrice);
    console.log('止盈价:', takeProfitPrice);

    const body: any = JSON.stringify({
      instId: symbol, // 合约币种
      tdMode: 'isolated', // 逐仓模式
      side: slide, // 做多或者做空，okx 做多为 buy，做空为 sell
      ordType: 'market', // 市价单
      sz: openAmount, // 开仓数量
      tpTriggerPx: takeProfitPrice, // 止盈触发价
      tpOrdPx: '-1', // 市价止盈
      tpTriggerPxType: 'last', // 止盈触发价类型，默认为最新价格
      slTriggerPx: stopLossPrice, // 止损触发价
      slOrdPx: '-1', // 市价止损
      slTriggerPxType: 'last', // 止损触发价类型，默认为最新价格
    });

    const signature = this.createSignature(
      secretKey,
      timestamp,
      method,
      requestPath,
      body,
    );

    const headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    };

    try {
      const res = await axiosWithRetry({
        method: 'post',
        url: `${baseUrl}${requestPath}`,
        data: body,
        headers,
      });

      if (res.data.code !== '0') {
        console.error('开仓失败:', res.data);
      } else {
        console.log('开仓成功');
      }
    } catch (error) {
      console.error('开仓失败:', error.response?.data || error.message);
      throw new Error('开仓失败');
    }
  }

  /**
   * @description: 平仓操作，仅针对指定 symbol
   */
  async closePosition(
    symbol: string,
    apiKey: string,
    secretKey: string,
    passphrase: string,
    baseUrl: string,
  ) {
    const timestamp = new Date().toISOString();
    const method = 'POST';
    const requestPath = '/api/v5/trade/close-position';

    // 获取当前 symbol 的持仓信息
    const position = await this.getPositionInfo(
      symbol,
      apiKey,
      secretKey,
      passphrase,
      baseUrl,
    );

    if (!position || position.pos === '0') {
      console.log(`当前 ${symbol} 没有持仓，无需平仓`);
      return;
    }

    const body = JSON.stringify({
      instId: symbol,
      mgnMode: 'isolated', // 使用逐仓模式
      posSide: position.posSide, // 确保只平掉当前方向的仓位
    });

    const signature = this.createSignature(
      secretKey,
      timestamp,
      method,
      requestPath,
      body,
    );

    const headers = {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    };

    try {
      const res = await axiosWithRetry({
        method: 'post',
        url: `${baseUrl}${requestPath}`,
        data: body,
        headers,
      });

      if (res.data.code !== '0') {
        console.error(`平仓 ${symbol} 失败:`, res.data);
      } else {
        console.log(`平仓 ${symbol} 成功`);
      }
    } catch (error) {
      console.error(
        `平仓 ${symbol} 失败:`,
        error.response?.data || error.message,
      );
      throw new Error(`平仓 ${symbol} 失败`);
    }
  }
}
