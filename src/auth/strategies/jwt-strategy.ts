import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import constants from '../../shared/security/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants.JWT_SECRET,
        });
    }
   
    async validate(payload: any) {
        return { id: payload.sub, username: payload.username, roles: payload.roles}; // returns undefined??
    }

    // async canActivate(context: ExecutionContext): Promise<boolean> {
    //     const request = context.switchToHttp().getRequest();
    //     const reviewId = request.params.reviewId;
    //     const review = await this.reviewService.findOne(reviewId);
    //     if (!review) {
    //       throw new UnauthorizedException();
    //     }
    //     const user = request.user;
    //     if (user.role === 'admin' || review.userId === user.id) {
    //       return true;
    //     }
    //     throw new UnauthorizedException();
    // }
}