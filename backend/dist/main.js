import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(`Mom's Cloud Kitchen API listening on http://localhost:${port}`);
}
await bootstrap();
//# sourceMappingURL=main.js.map