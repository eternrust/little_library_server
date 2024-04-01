import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT,
			username: process.env.DB_ID,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [],
			synchronize: true,
			logging: true
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
