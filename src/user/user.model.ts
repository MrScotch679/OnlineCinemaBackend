import { Ref, prop } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { MovieModel } from 'src/movie/movie.model'

export interface UserModelInterface extends Base {
	email: string
	password: string
	isAdmin: boolean
	favorites?: Ref<MovieModel>[]
}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	email: string

	@prop({})
	password: string

	@prop({ default: false })
	isAdmin: boolean

	@prop({ default: [], ref: () => MovieModel })
	favorites?: Ref<MovieModel>[]
}
