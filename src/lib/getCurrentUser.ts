import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export async function getCurrentUser(): Promise<string> {
    const cookieStore = await cookies();

    const token = cookieStore.get('token')?.value;

    if (!token) throw new UnauthorizedError("Token not found");

    let decode;
    try {
        decode = verifyToken(token);
    } catch {
        throw new UnauthorizedError("Invalid or expired token");
    }

    if (!decode || !decode.userId) throw new UnauthorizedError("Unauthorized");

    return decode.userId;
}