import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { SignInUserDto } from './dto/signin-user.dto'

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name)
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	public async signUp(body: CreateUserDto) {
		const { name, email, password } = body

		const isEmailExist: number = await this.userRepository.count({
			where: { email }
		})
		if (isEmailExist) {
			throw new HttpException('이미 가입된 이메일입니다.', HttpStatus.CONFLICT)
		}
		const hashedPassword = await bcrypt.hash(password, 10)

		const newUser = this.userRepository.create({
			name,
			email,
			password: hashedPassword
		})

		this.userRepository.save(newUser)
	}

	public async signIn(body: SignInUserDto) {
		const { email, password } = body

		const user: User | undefined = await this.userRepository.findOne({
			where: { email }
		})
		if (!user) {
			throw new HttpException('이 이메일로 가입된 유저가 없습니다.', HttpStatus.NOT_FOUND)
		}

		const comparePassword = await bcrypt.compare(password, user.password)
		if (!comparePassword) {
			throw new HttpException('비밀번호가 다릅니다.', HttpStatus.UNAUTHORIZED)
		}

		console.log(comparePassword)
	}
}
