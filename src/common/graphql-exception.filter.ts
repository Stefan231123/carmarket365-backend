import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphqlExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo();

    const fieldName = info?.fieldName || 'unknown';

    if (exception instanceof HttpException) {
      this.logger.warn(`GraphQL ${fieldName}: ${exception.message}`);
      return exception;
    }

    // Unexpected errors — log full detail, return sanitized message
    this.logger.error(
      `Unexpected error in ${fieldName}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    return new Error('Internal server error');
  }
}
