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
import { ActorService } from './actor.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { RolesEnum } from 'src/auth/auth.interface'
import { ActorDto } from './dto/actor.dto'

@Controller('actor')
export class ActorController {
	constructor(private readonly ActorService: ActorService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.ActorService.getActorBySlug(slug)
	}

	@Get()
	async getAllActors(@Query('searchTerm') searchTerm?: string) {
		return this.ActorService.getAllActors(searchTerm)
	}

	@Get(':id')
	async getActorById(@Param('id', IdValidationPipe) id: string) {
		return this.ActorService.getActorById(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async createActor() {
		return this.ActorService.createActor()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateActor(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ActorDto
	) {
		return this.ActorService.updateActor(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteActor(@Param('id', IdValidationPipe) id: string) {
		return this.ActorService.deleteActor(id)
	}
}
