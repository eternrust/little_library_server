import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateCustomDto } from './dto/create-custom.dto'
import { UpdateCustomDto } from './dto/update-custom.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Custom } from './entities/custom.entity'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { CreateCustomPageDto } from './dto/create-custom-page.dto'
import { UserService } from 'src/user/user.service'
import { UpdateCustomPageDto } from './dto/update-custom-page.dto'

@Injectable()
export class CustomService {
	constructor(
		@InjectRepository(Custom)
		private readonly customRepository: Repository<Custom>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly userService: UserService
	) { }

	async createPage({ id, name }: { id: number; name: string }, createCustomPageDto: CreateCustomPageDto) {
		const rootCustom = await this.create(
			{ id, name },
			{
				type: 'page',
				style: createCustomPageDto.style,
				data: createCustomPageDto.data,
				parentId: null
			}
		)

		for await (const element of createCustomPageDto.node) {
			await this.create(
				{ id, name },
				{
					type: element.type,
					style: element.style,
					data: element.data,
					parentId: rootCustom.id
				}
			)
		}

		return await this.find(rootCustom.id)
	}

	async create({ id }: { id: number; name: string }, createCustomDto: CreateCustomDto) {
		const { type, style, data, parentId } = createCustomDto

		if (!(typeof type === 'string' && typeof style === 'string' && typeof data === 'string')) {
			throw new HttpException('type, style, data 데이터를 모두 넣어주셔야 합니다.', HttpStatus.BAD_REQUEST)
		}

		if (!['page', 'block', 'date'].filter(v => v === type).length) {
			throw new HttpException('type의 값은 page, block, data 중 하나로 넣어주셔야 합니다.', HttpStatus.BAD_REQUEST)
		}

		if (parentId && type === 'page') {
			throw new HttpException('type의 값이 page일 시 parentId가 존재할 수 없습니다!', HttpStatus.BAD_REQUEST)
		}

		if (!parentId && type !== 'page') {
			throw new HttpException('type의 값이 block, date일 시 parentId가 존재해야 합니다!', HttpStatus.BAD_REQUEST)
		}

		let parent: Custom | undefined
		const user: User | undefined = await this.userRepository.findOne({
			where: { id }
		})

		if (!user) {
			throw new HttpException('유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND)
		}

		if (parentId) {
			parent = await this.find(parentId)

			if (!parent) {
				throw new HttpException('없는 노드를 조상으로 할 수 없습니다.', HttpStatus.NOT_FOUND)
			}
		}

		const custom = this.customRepository.create({
			userId: id,
			type,
			style,
			data,
			parentId
		})

		const saveCustom = await this.customRepository.save(custom)

		if (parent) {
			if (parent.node) {
				parent.node.push(custom)
			} else {
				parent.node = [custom]
			}

			await this.customRepository.save(parent)
		}

		return await this.find(saveCustom.id)
	}

	async find(id: number, isReq?: boolean, userId?: number) {
		const custom = await this.customRepository
			.createQueryBuilder('custom')
			.leftJoinAndSelect('custom.node', 'node')
			.leftJoinAndSelect('custom.bookmark', 'bookmark')
			.leftJoinAndMapOne('custom.user', User, 'user', 'user.id=custom.userId')
			.where('custom.id=:id', { id })
			.select(['custom', 'node', 'bookmark', 'user.name'])
			.getOneOrFail()

		if (!custom) {
			throw new HttpException('해당 id를 가진 custom은 없습니다.', HttpStatus.NOT_FOUND)
		}

		custom['isBookmark'] = custom.bookmark.some(v => v.id === custom.userId)

		if (isReq) {
			custom.bookmark = undefined
		}

		custom['isMe'] = custom.userId === userId

		return custom
	}

	async findByUser(id: number) {
		const custom = await this.customRepository
			.createQueryBuilder('custom')
			.leftJoinAndSelect('custom.node', 'node')
			.leftJoinAndSelect('custom.bookmark', 'bookmark')
			.leftJoinAndMapOne('custom.user', User, 'user', 'user.id=custom.userId')
			.where('custom.userId=:id', { id })
			.andWhere('custom.type="page"')
			.select(['custom', 'node', 'bookmark', 'user.name'])
			.getMany()

		if (!custom) {
			throw new HttpException('해당 id를 가진 custom은 없습니다.', HttpStatus.NOT_FOUND)
		}

		return custom
	}

	async findMe({ id }: { id: number; name: string }) {
		const custom = await this.customRepository
			.createQueryBuilder('custom')
			.leftJoinAndSelect('custom.node', 'node')
			.leftJoinAndSelect('custom.bookmark', 'bookmark')
			.leftJoinAndMapOne('custom.user', User, 'user', 'user.id=custom.userId')
			.where('custom.userId=:id', { id })
			.andWhere('custom.type="page"')
			.select(['custom', 'node', 'bookmark', 'user.name'])
			.getMany()

		if (!custom) {
			throw new HttpException('해당 id를 가진 custom은 없습니다.', HttpStatus.NOT_FOUND)
		}

		return custom
	}

	async search(word: string) {
		const custom = await this.customRepository
			.createQueryBuilder('custom')
			.leftJoinAndMapOne('custom.user', User, 'user', 'user.id=custom.userId')
			.where('custom.type="page"')
			.andWhere('custom.data LIKE :title', { title: `%${word}%` })
			.select([
				'custom.id AS id',
				'custom.style AS style',
				'custom.data AS data',
				'custom.createdAt AS createdAt',
				'custom.updatedAt AS updatedAt',
				'custom.deletedAt AS deletedAt',
				'user.name'
			])
			.getRawMany()

		if (!custom) {
			throw new HttpException('custom을 찾을 수 없습니다.', HttpStatus.NOT_FOUND)
		}

		return custom
	}

	async recommendCustom() {
		const custom = await this.customRepository
			.createQueryBuilder('custom')
			.leftJoinAndSelect('custom.node', 'node')
			.leftJoinAndSelect('custom.bookmark', 'bookmark')
			.leftJoinAndMapOne('custom.user', User, 'user', 'user.id=custom.userId')
			.where('custom.type="page"')
			.orderBy('RAND()')
			.select(['custom', 'node', 'bookmark', 'user.name'])
			.getMany()

		if (!custom) {
			throw new HttpException('해당 id를 가진 custom은 없습니다.', HttpStatus.NOT_FOUND)
		}

		return custom
	}

	async bookmark(userData: { id: number; name: string }, customId: number) {
		const custom = await this.find(customId)
		const user = await this.userService.find(userData, userData.id)

		if (user.bookmark.some(v => v.id === customId)) {
			custom.bookmark = custom.bookmark.filter(v => v.id !== userData.id)
		} else {
			custom.bookmark.push(user)
		}

		await this.customRepository.save(custom)
	}

	async updatePage(user: { id: number; name: string }, id: number, updateCustomPageDto: UpdateCustomPageDto) {
		const custom = await this.find(id)

		if (custom.type !== 'page') {
			throw new HttpException('이 요청은 page type에서 이루어져야합니다', HttpStatus.BAD_REQUEST)
		}

		if (custom.userId !== user.id) {
			throw new HttpException('이 custom을 수정할 권한이 없습니다', HttpStatus.UNAUTHORIZED)
		}

		// if (updateCustomPageDto.node.some(v => !v.id)) {
		// 	throw new HttpException('각 node에는 id가 반드시 필요합니다.', HttpStatus.BAD_REQUEST)
		// }

		await this.update(user.id, id, {
			data: updateCustomPageDto.data,
			style: updateCustomPageDto.style
		})

		const keys = updateCustomPageDto.node.map(v => v.id || 0)
		for await (const node of custom.node) {
			const keyIndex = keys.indexOf(node.id)
			if (keyIndex !== -1) {
				await this.update(user.id, node.id, updateCustomPageDto.node[keyIndex])
			} else {
				await this.delete(user.id, node.id)
			}
		}

		for await (const node of updateCustomPageDto.node.filter(v => !v.id)) {
			await this.create(
				user,
				{
					type: node.type,
					style: node.style,
					data: node.data,
					parentId: id
				}
			)
		}
	}

	async delete(userId: number, id: number) {
		const custom = await this.find(id)

		if (custom.userId !== userId) {
			throw new HttpException('이 custom을 수정할 권한이 없습니다', HttpStatus.UNAUTHORIZED)
		}

		await this.customRepository.softDelete(id)
	}

	async update(userId: number, id: number, updateCustomDto: UpdateCustomDto) {
		const custom = await this.find(id)

		if (custom.userId !== userId) {
			throw new HttpException('이 custom을 수정할 권한이 없습니다', HttpStatus.UNAUTHORIZED)
		}

		this.customRepository.update(id, updateCustomDto)
	}
}
