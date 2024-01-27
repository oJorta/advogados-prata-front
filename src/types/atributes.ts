export type categoryUser = {
    id: number,
    name: string
}

export type lawyerUser = {
    id: number,
    name: string,
    email: string,
    nroOAB: number,
    role: number
}

export type especialty = {
    affinity: number,
    userId: number,
    category: categoryUser
}

export type file = {
    id: number,
    name: string,
    filePath: string,
    processId: number
}

export type status = "Em inicialização" | "Em aguardo"