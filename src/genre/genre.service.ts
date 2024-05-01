import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/create-genre.dto'
import { ErrorMessages } from 'src/constants/error-messages'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async getAllGenres(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					},
					{
						slug: new RegExp(searchTerm, 'i')
					},
					{
						description: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.GenreModel.find(options)
			.select('-updatedAt')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async getGenreById(id: string) {
		const genre = await this.GenreModel.findById(id)

		if (!genre) {
			throw new NotFoundException(ErrorMessages.GENRE_NOT_FOUND)
		}

		return genre
	}

	async updateGenre(id: string, dto: CreateGenreDto) {
		const updatedGenre = await this.GenreModel.findByIdAndUpdate(id, dto, {
			new: true
		}).exec()

		if (!updatedGenre) {
			throw new NotFoundException(ErrorMessages.GENRE_NOT_FOUND)
		}

		return updatedGenre
	}

	async findBySlug(slug: string) {
		const genre = await this.GenreModel.findOne({ slug }).exec()

		if (!genre) {
			throw new NotFoundException(ErrorMessages.GENRE_NOT_FOUND)
		}

		return genre
	}

	async createGenre() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: ''
		}

		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async deleteGenre(id: string) {
		const deletedGenre = await this.GenreModel.findByIdAndDelete(id).exec()

		if (!deletedGenre) {
			throw new NotFoundException(ErrorMessages.GENRE_NOT_FOUND)
		}

		return deletedGenre
	}

	// FIXME: refactor
	async getGenresCollection() {
		const genres = await this.getAllGenres()
		const genresCollection = genres
		return genresCollection
	}
}
