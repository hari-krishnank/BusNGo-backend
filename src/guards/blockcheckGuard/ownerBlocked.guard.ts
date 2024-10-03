import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OwnerService } from 'src/busOwner/services/owner.service';

@Injectable()
export class OwnerBlockedGuard implements CanActivate {
    constructor(private ownersService: OwnerService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log(request);
        
        const owner = request.user;
        console.log(owner);
         

        if (!owner) {
            throw new UnauthorizedException('Owner not found in request');
        }

        const currentOwner = await this.ownersService.findById(owner.ownerId);
        console.log('current owner:', currentOwner);
        

        if (!currentOwner) {
            throw new UnauthorizedException('Owner not found');
        }

        if (currentOwner.is_blocked) {
            throw new UnauthorizedException('Your account has been blocked. Please contact support.');
        }

        return true;
    }
}