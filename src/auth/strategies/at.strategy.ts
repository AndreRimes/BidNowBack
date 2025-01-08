import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { CookieUtils } from 'src/commons/utils/CookieUtils'
import { User } from '@prisma/client'

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                req => {
                    const token = CookieUtils.getCookieValue(req, "accessToken");
                    return token || null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: "secret",
        })
    }

    async validate(payload: User) {
        return payload
    }
}