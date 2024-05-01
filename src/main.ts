import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './error/http-exceiption.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const options = new DocumentBuilder()
		.setTitle('Little Library')
		.setDescription('nest로 짜보는 서버의 api docs')
		.setVersion('1.0')
		.addServer('http://localhost:3000/', 'Local environment')
		.addTag('Your API Tag')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-docs', app, document)
	app.useGlobalFilters(new HttpExceptionFilter())
	await app.listen(process.env.PORT || '8080')
}
bootstrap()
