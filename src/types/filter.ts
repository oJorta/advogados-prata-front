import { categoryUser, lawyerUser } from "./atributes"

export type filter = {
    categories: categoryUser[],
    users: lawyerUser[],
    customers: string[],
    materias: string[],
    deadlines: string[],
}