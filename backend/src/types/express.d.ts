import type { userInterface } from "../models/user.model";

declare global {
	namespace Express {
		interface User extends userInterface {
			id?: any;
			password?: any; 
		}
	}
}