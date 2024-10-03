import { applyDecorators, UseGuards } from '@nestjs/common';
import { OwnerJwtAuthGuard } from 'src/guards/jwtAuthGuard/ownerJwt.guard';
import { OwnerBlockedGuard } from 'src/guards/blockcheckGuard/ownerBlocked.guard';

export function CheckOwnerBlocked() {
    return applyDecorators(
        UseGuards(OwnerJwtAuthGuard, OwnerBlockedGuard)
    );
}