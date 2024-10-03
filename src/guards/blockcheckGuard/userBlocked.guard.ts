import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class UserBlockedGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request);
        
        const user = request.user;
        console.log(user);
        

        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }

        const currentUser = await this.usersService.findById(user.userId);

        if (!currentUser) {
            throw new UnauthorizedException('User not found');
        }

        if (currentUser.is_blocked) {
            throw new UnauthorizedException('Your account has been blocked. Please contact support.');
        }

        return true;
    }
}