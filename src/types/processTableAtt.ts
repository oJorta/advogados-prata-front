export type processProps = {
    createdAt: string
    id: number,
    processKey: string,
    matter: string,
    name: string,
    userId: number,
    description: string,
    deadline: string,
    distributionDate: string,
    conclusionDate: string,
    status: string
    categoryId: number
    legalOpinion: string
    user?: any
    category?: any
}