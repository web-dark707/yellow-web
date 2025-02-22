module.exports = {
  apps: [
    {
      name: 'elder-true-lord', // 项目名字,启动后的名字
      script: 'npm', // 执行脚本
      cwd: './', // 根目录
      args: 'run start', // 传递给脚本的参数
      watch: true, // 开启监听文件变动重启
      ignore_watch: ['node_modules', 'public', 'logs'], // 不用监听的文件
      instances: '1', // max表示最大的 应用启动实例个数，仅在 cluster 模式有效 默认为 fork
      autorestart: true, // 默认为 true, 发生异常的情况下自动重启
      max_memory_restart: '2G', //如果应用使用超过2G内存，它将重新启动
      error_file: './logs/pm2/app-err.log', // 错误日志文件
      out_file: './logs/pm2/app-out.log', // 正常日志文件
      merge_logs: true, // 设置追加日志而不是新建日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
      min_uptime: '60s', // 应用运行少于时间被认为是异常启动
      max_restarts: 30, // 最大异常重启次数
      restart_delay: 60, // 异常重启情况下，延时重启时间
      env: {
        // 环境参数，当前指定为生产环境
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        // 环境参数,当前指定为生产环境
        NODE_ENV: 'production',
      },
      // 在启动应用程序之前执行的钩子
      pre_start: 'npm run build',
    },
  ],
};
