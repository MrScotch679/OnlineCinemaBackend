import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { GenreModel } from './genre.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { CreateGenreDto } from './dto/create-genre.dto'
import { ErrorMessages } from 'src/constants/error-messages'
import { MovieService } from 'src/movie/movie.service'
import { ICollection } from './genre.interface'
import { QueryOptions } from 'mongoose'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService
	) {}

	async getAllGenres(searchTerm?: string, limit?: number) {
		const searchOptions: QueryOptions = {}

		if (searchTerm) {
			searchOptions.$or = [
				{
					title: new RegExp(searchTerm, 'i')
				},
				{
					slug: new RegExp(searchTerm, 'i')
				},
				{
					description: new RegExp(searchTerm, 'i')
				}
			]
		}

		let query = this.GenreModel.find(searchOptions)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })

		if (limit) {
			query = query.limit(limit)
		}

		const genres = await query.exec()

		if (!genres) {
			throw new NotFoundException(ErrorMessages.GENRE_NOT_FOUND)
		}

		return genres
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
			title: '',
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

	async getGenresCollection() {
		const genres = await this.getAllGenres()

		const genresCollection = await Promise.all(
			genres.map(async (genre) => {
				const movie = await this.movieService.getMoviesByGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					image: movie?.[0]?.bigPoster || '',
					title: genre.title,
					slug: genre.slug
				}

				return result
			})
		)

		return genresCollection
	}
}
