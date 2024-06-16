/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GenreService } from './genre.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { RolesEnum } from 'src/auth/auth.interface'
import { CreateGenreDto } from './dto/create-genre.dto'

@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.genreService.findBySlug(slug)
	}

	@Get('collections')
	async getCollections() {
		return this.genreService.getGenresCollection()
	}

	@Get()
	async getAllGenres(
		@Query('searchTerm') searchTerm?: string,
		@Query('limit') limit?: number
	) {
		return this.genreService.getAllGenres(searchTerm, limit)
	}

	@Get(':id')
	async getGenreById(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.getGenreById(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateGenre(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.genreService.updateGenre(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async createGenre() {
		return this.genreService.createGenre()
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteGenre(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.deleteGenre(id)
	}
}
