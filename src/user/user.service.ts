import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { SignInUserDto } from './dto/signin-user.dto'
import { AuthService } from 'src/auth/auth.service'
import { Custom } from 'src/custom/entities/custom.entity'
import { UpdateUserDto } from './dto'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly authService: AuthService
	) { }

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

		await this.userRepository.save(newUser)

		await this.authService.generateRefreshToken(newUser)
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

		return {
			accessToken: await this.authService.generateAccessToken(user),
			refreshToken: await this.authService.generateRefreshToken(user)
		}
	}

	public async find({ id: userId }: { id: number, name: string }, id: number) {
		// const user: User | undefined = await this.userRepository.findOne({ where: { id } })
		const user = await this.userRepository
			.createQueryBuilder('user')
			.leftJoinAndSelect('user.bookmark', 'bookmark')
			.where('user.id=:id', { id })
			.getOneOrFail()

		if (!user) {
			throw new HttpException('해당 id의 유저가 없습니다.', HttpStatus.NOT_FOUND)
		}

		for (const bookmark of user.bookmark) {
			bookmark['user_name'] = (await this.userRepository.findOne({ where: { id: bookmark.userId } })).name
		}

		user['isMe'] = userId === user.id
		user['password'] = undefined
		return user
	}

	public async quit(user: { id: number; name: string }) {
		await this.find(user, user.id)
		await this.userRepository.delete(user.id)
	}

	public async change(user: { id: number; name: string }, updateUserDto: UpdateUserDto) {
		await this.find(user, user.id)
		await this.userRepository.update(user.id, updateUserDto)
	}
}
