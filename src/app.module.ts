import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { AuthModule } from './auth/auth.module'
import { RefreshToken } from './auth/entities/refreshToken.entity'
import { CustomModule } from './custom/custom.module'
import { Custom } from './custom/entities/custom.entity'

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
			entities: [User, RefreshToken, Custom],
			synchronize: true,
			logging: true
		}),
		UserModule,
		AuthModule,
		CustomModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
