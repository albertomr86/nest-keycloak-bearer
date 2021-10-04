import { ContextType, ExecutionContext } from '@nestjs/common';

type GqlContextType = 'graphql' | ContextType;

export const extractRequestFromContext = (context: ExecutionContext): any => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest();
  }

  if (context.getType<GqlContextType>() === 'graphql') {
    try {
      const { GqlExecutionContext } = require('@nestjs/graphql');
      return GqlExecutionContext.create(context).getContext().req;
    } catch {
      throw new Error('@nestjs/graphql is not installed, cannot proceed');
    }
  }

  return null;
};

export const extractTokenFromRequest = (req: any): string => {
  const headers = req.headers as Record<string, string>;

  if (!headers || !headers.authorization) {
    return null;
  }

  const auth = headers.authorization.split(' ');
  if (auth[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return auth[1];
};
