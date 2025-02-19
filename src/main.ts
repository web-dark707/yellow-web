import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

const { SERVER_PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cors
  app.enableCors({
    origin: '*', //允许所有跨域
  });

  //设置 HTTP 标头来帮助保护应用免受一些众所周知的 Web 漏洞的影响
  app.use(
    helmet({
      contentSecurityPolicy: false, //取消https强制转换
    }),
  );

  await app.listen(SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  console.log('API服务已经启动,请访问:', `${serverUrl}`);
}
bootstrap();
