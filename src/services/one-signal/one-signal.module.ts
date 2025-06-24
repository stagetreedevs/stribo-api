import { Module } from '@nestjs/common';
import { OneSignalService } from './one-signal.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OneSignalService],
  exports: [OneSignalService],
})
export class OneSignalModule {}
