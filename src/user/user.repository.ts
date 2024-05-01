import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserRepository {
	private boardsRepository: Repository<User>

	constructor(private readonly dataSource: DataSource) {
		this.boardsRepository = this.dataSource.getRepository(User)
	}

	createUser(createUserDto: CreateUserDto) {
		const user = new User()
		user.email = createUserDto.email
		user.password = createUserDto.password
		user.name = '익명유저'
		return this.boardsRepository.save(user)
	}
}
