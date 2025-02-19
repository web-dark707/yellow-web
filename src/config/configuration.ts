/**
 * @description: 配置文件;
 */
export const getConfiguration = () =>
  ({
    telegram: {
      tradingview_secret: process.env.TRADINGVIEW_TELEGRAM_SECRET,
    },
    okx: {
      apiKey: process.env.OKX_TRADING_API_KEY,
      secretKey: process.env.OKX_TRADING_SECRET_KEY,
      passphrase: process.env.OKX_TRADING_PASSPHRASE,
    },
    binance: {
      apiKey: process.env.BINANCE_TRADING_API_KEY,
      secretKey: process.env.BINANCE_TRADING_SECRET_KEY,
    },
    pushover: {
      userKey: process.env.PUSHOVER_USER_KEY,
      token: process.env.PUSHOVER_API_TOKEN,
    },
  }) as const;

export type ConfigurationType = ReturnType<typeof getConfiguration>;
export type ConfigurationKeyPaths = Record<any, any>;
