import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { RolesEnum } from 'src/auth/auth.interface'
import { CreateMovieDto } from './dto/movie.dto'

@Controller('movie')
export class MovieController {
	constructor(private readonly MovieService: MovieService) {}

	@Get('by-slug/:slug')
	async getMovieBySlug(@Param('slug') slug: string) {
		return this.MovieService.getMovieBySlug(slug)
	}

	@Get('by-actor/:actorId')
	async getMovieByActor(
		@Param('actorId', IdValidationPipe) actorId: Types.ObjectId
	) {
		return this.MovieService.getMovieByActor(actorId)
	}

	@Get('by-genres')
	async getMoviesByGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
		return this.MovieService.getMoviesByGenres(genreIds)
	}

	@Get()
	async getAllMovies() {
		return this.MovieService.getAllMovies()
	}

	@Get('most-popular')
	async getMostPopularMovies() {
		return this.MovieService.getMostPopularMovies()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.MovieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth(RolesEnum.ADMIN)
	async getMovieById(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.MovieService.getMovieById(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async createMovie() {
		return this.MovieService.createMovie()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateMovie(
		@Param('id', IdValidationPipe) id: Types.ObjectId,
		@Body() dto: CreateMovieDto
	) {
		return this.MovieService.updateMovie(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteMovie(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.MovieService.deleteMovie(id)
	}
}
