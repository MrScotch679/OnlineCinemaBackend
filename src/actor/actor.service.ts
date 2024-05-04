import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ActorModel } from './actor.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorDto } from './dto/actor.dto'
import { ErrorMessages } from 'src/constants/error-messages'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async getActorBySlug(slug: string) {
		const actor = await this.ActorModel.findOne({ slug }).exec()

		if (!actor) {
			throw new NotFoundException(ErrorMessages.ACTOR_NOT_FOUND)
		}

		return actor
	}

	async getActorById(id: string) {
		const actor = await this.ActorModel.findById(id)

		if (!actor) {
			throw new NotFoundException(ErrorMessages.ACTOR_NOT_FOUND)
		}

		return actor
	}

	async getAllActors(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					},
					{
						slug: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				localField: '_id',
				foreignField: 'actors',
				as: 'movies'
			})
			.addFields({
				countMovies: { $size: '$movies' }
			})
			.project({ __v: 0, updatedAt: 0, movies: 0 })
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async createActor() {
		const defaultValue = {
			name: '',
			slug: '',
			photo: ''
		}

		const actor = await this.ActorModel.create(defaultValue)
		return actor._id
	}

	async updateActor(id: string, dto: ActorDto) {
		const updatedActor = await this.ActorModel.findByIdAndUpdate(id, dto, {
			new: true
		}).exec()

		if (!updatedActor) {
			throw new NotFoundException(ErrorMessages.ACTOR_NOT_FOUND)
		}

		return updatedActor
	}

	async deleteActor(id: string) {
		const deletedActor = await this.ActorModel.findByIdAndDelete(id).exec()

		if (!deletedActor) {
			throw new NotFoundException(ErrorMessages.ACTOR_NOT_FOUND)
		}

		return deletedActor
	}
}
