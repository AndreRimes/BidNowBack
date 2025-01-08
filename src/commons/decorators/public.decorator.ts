import { SetMetadata } from '@nestjs/common'

/**
 * Set the route as public
 */
export const Public = () => SetMetadata('isPublic', true)