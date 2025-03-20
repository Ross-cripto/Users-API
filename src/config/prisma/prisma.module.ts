import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** This module provides the PrismaService,
 *  which is used to interact with the database.
 * It is exported so that it can be used in other modules.
*/

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
