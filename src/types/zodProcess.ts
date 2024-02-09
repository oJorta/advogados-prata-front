import { z } from 'zod'

//Enums
import { categoriesTypes } from "@/types/enums"

export const formProcess = z.object({
    processKey: z.string().nonempty('O campo de chave do processo precisa ser preenchido').max(30, 'Chave muito extensa'),
    matter: z.string().optional(),
    deadline: z.coerce.date().optional(),
    // deadline: z.coerce.date().min(new Date(), 'Prazo muito curto!').optional(),
    name: z.string().max(45, 'Nome muito extenso').optional(),
    description: z.string().optional(),
    categoryId: z.number().positive('Obrigatório a seleção de categoria'),
    userId: z.number({invalid_type_error:'Selecione um Advogado'}).nonnegative('Obrigatório a seleção').optional(),
    status: z.nativeEnum(categoriesTypes),
    isUrgent: z.number(),
    file: z.any().array()
})

export type backProcessDatas = {
    id: number,
    processKey: string,
    matter: string,
    deadline: string,
    distributionDate: string,
    conclusionDate: string,
    name: string,
    description: string,
    categoryId: number,
    userId: number,
    status: string,
    legalOpinion: string,
    isUrgent: number
}

export type Data = {
    processKey: string,
    matter: string | undefined,
    deadline: string | undefined,
    distributionDate: string,
    name: string | undefined,
    description: string | undefined,
    categoryId: number,
    userId: number | undefined,
    status: categoriesTypes,
    isUrgent: number,
}

export type credentialInputs = z.infer< typeof formProcess>

