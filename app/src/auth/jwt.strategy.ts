import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(ConfigService)
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { kakaoAuthorizationCode: string; useremail: string, userCalendarId: string }) {
        return { 
            kakaoAuthorizationCode: payload.kakaoAuthorizationCode, 
            useremail: payload.useremail, 
            userCalendarId: payload.userCalendarId 
        };
    }
}
 