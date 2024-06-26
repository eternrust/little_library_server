import { Exclude } from 'class-transformer'
import { Custom } from 'src/custom/entities/custom.entity'
import { BaseEntity, Column, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

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

	@Exclude()
	@DeleteDateColumn()
	deletedAt: Date | null

	@ManyToMany(() => Custom, custom => custom.bookmark, { onDelete: "CASCADE" })
	bookmark: Custom[]
}
