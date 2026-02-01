import bcrypt from "bcrypt"
export async function hashPassword(value: string, hashSalt: number = 10) {
	return await bcrypt.hash(value, hashSalt)
}


export async function comparePassword(candidatePassword: string, password: string) {
	return await bcrypt.compare(candidatePassword, password)
}
