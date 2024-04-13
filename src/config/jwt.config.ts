import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'
import { JWT_SECRET } from 'src/constants/jwt.constants'

export const getJWTConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get(JWT_SECRET)
})
