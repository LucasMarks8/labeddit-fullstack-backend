import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { TokenPayload } from '../Types'


dotenv.config()

export class TokenManager {

		// cria o token em string a partir de um payload (objeto JSON)
    public createToken = (payload: TokenPayload): string => {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )

        return token
    }

    public getPayload = (token: string): TokenPayload | null => {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_KEY as string
            )

            return payload as TokenPayload
        
				} catch (error) {
            return null
        }
    }
}