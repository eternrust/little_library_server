import { Exclude } from 'class-transformer'
import { User } from 'src/user/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm'

@Entity('custom')
export class Custom {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ nullable: false })
	userId: number

	@Column()
	type: 'page' | 'block' | 'date'

	@Column()
	style: string

	@Column()
	data: string

	@CreateDateColumn({ type: 'timestamp' })
	createdAt: Date

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt: Date

	@Exclude()
	@DeleteDateColumn()
	deletedAt: Date | null

	@ManyToOne(() => Custom, custom => custom.node)
	parent: Custom

	@Column({ nullable: true })
	parentId: number

	@OneToMany(() => Custom, custom => custom.parent, { cascade: true })
	node: Custom[]

	@ManyToMany(() => User, user => user.bookmark, { cascade: true })
	@JoinTable()
	bookmark: User[]
}
