import {
	Controller,
	HttpCode,
	Post,
	Query,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common'
import { FileService } from './file.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { RolesEnum } from 'src/auth/auth.interface'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('file')
export class FileController {
	constructor(private readonly FileService: FileService) {}

	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Query('folder') folder?: string
	) {
		return this.FileService.saveFiles([file], folder)
	}
}
