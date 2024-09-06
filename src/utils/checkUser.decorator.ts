import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwtAuthGuard/jwt.guard';
import { UserBlockedGuard } from 'src/guards/blockcheckGuard/userBlocked.guard';

export function CheckUserBlocked() {
    return applyDecorators(
        UseGuards(JwtAuthGuard, UserBlockedGuard)
    );
}