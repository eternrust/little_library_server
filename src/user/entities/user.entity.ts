import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ length: 32 })
	name: string

	@Column({ unique: true })
	email: string

	@Column()
	password: string

	@Column({ default: '' })
	imageLink: string
}
