import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthService } from 'src/auth/auth.service'
import { RefreshToken } from 'src/auth/entities/refreshToken.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	imports: [TypeOrmModule.forFeature([User, RefreshToken]), AuthModule],
	controllers: [UserController],
	providers: [UserService, AuthService]
})
export class UserModule {}
