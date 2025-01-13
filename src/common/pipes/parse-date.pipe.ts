import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (!value) {
      return undefined;
    }

    const timestamp = Date.parse(value);
    if (isNaN(timestamp)) {
      throw new BadRequestException('Invalid date format');
    }

    return new Date(timestamp);
  }
}
