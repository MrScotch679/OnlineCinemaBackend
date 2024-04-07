import { prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

export interface UserModelInterface extends Base {
	email: string
	password: string
	isAdmin: boolean
	favorite?: string[]
}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string

	@prop({})
	password: string

	@prop({ default: false })
	isAdmin: boolean

	@prop({ default: [] })
	favorite?: string[]
}
