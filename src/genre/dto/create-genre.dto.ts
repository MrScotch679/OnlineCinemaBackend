import { IsString } from 'class-validator'

export class CreateGenreDto {
	@IsString()
	title: string

	@IsString()
	slug: string

	@IsString()
	description: string

	@IsString()
	icon: string
}
