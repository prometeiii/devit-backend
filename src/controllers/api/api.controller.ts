import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

@Controller('api')
export class ApiController {
  private requestLimitPerSecond: number = 50;
  private requestCount: number = 0;
  private lastRequestTimestamp: number = Date.now();
  private maxDelay: number = 1000;

  @Get(':id')
  handleApiRequest(@Param('id') id: number): Promise<{ id: number }> {
    const currentTimestamp = Date.now();

    if (currentTimestamp - this.lastRequestTimestamp >= this.maxDelay) {
      this.requestCount = 0;
      this.lastRequestTimestamp = currentTimestamp;
    }

    this.requestCount++;

    if (this.requestCount > this.requestLimitPerSecond) {
      throw new HttpException(
        'Too many requests',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const delay = Math.floor(Math.random() * this.maxDelay);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id });
      }, delay);
    });
  }
}
