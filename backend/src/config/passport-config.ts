import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt"
import passport from "passport"

import { findUserById } from "../services/auth.service"



interface jwtUserPayload {
	userId: string
}

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET || 'secert_jwt',
	audience: [

		'user'
	],
	algorithms: ["HS256"]
}


passport.use(new JwtStrategy(options, async (payload: jwtUserPayload, done) => {
	try {
		if (!payload || !payload.userId) {
			return done(null, false)
		}
		// find that user

		const user = await findUserById(payload.userId)
		if (!user) {
			return done(null, false)
		}

		return done(null, user);
	} catch (error) {
		if (!payload || !payload.userId) {
			return done(null, false)
		}
	}
}))

passport.serializeUser((user: any, done) => done(null, user))
passport.deserializeUser((user: any, done) => done(null, user))


export const passportAuthenticateJwt = passport.authenticate('jwt', {
	session: false
})