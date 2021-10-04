import { SetMetadata, applyDecorators } from '@nestjs/common';

export const META_PUBLIC = 'public';

export const Public = () => applyDecorators(SetMetadata(META_PUBLIC, true));
