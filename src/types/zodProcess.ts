import { z } from 'zod'

//Enums
import { categoriesTypes } from "@/types/enums"

export const formProcess = z.object({
    processKey: z.string().nonempty('O campo de chave do processo precisa ser preenchido').max(30, 'Chave muito extensa'),
    materia: z.string().optional(),
    deadline: z.coerce.date().optional(),
    // deadline: z.coerce.date().min(new Date(), 'Prazo muito curto!').optional(),
    name: z.string().max(45, 'Nome muito extenso').optional(),
    information: z.string().optional(),
    categoryId: z.number().positive('Obrigatório a seleção de categoria'),
    userId: z.number({invalid_type_error:'Selecione um Advogado'}).nonnegative('Obrigatório a seleção').optional(),
    status: z.nativeEnum(categoriesTypes),
    isUrgent: z.boolean(),
    file: z.any().array()
})

export type backProcessDatas = {
    id: number,
    processKey: string,
    materia: string,
    deadline: string,
    distributionDate: string,
    conclusionDate: string,
    name: string,
    information: string,
    categoryId: number,
    userId: number,
    status: string,
    seem: string,
    isUrgent: boolean
}

export type Data = {
    processKey: string,
    materia: string | undefined,
    deadline: string | undefined,
    distributionDate: string,
    name: string | undefined,
    information: string | undefined,
    categoryId: number,
    userId: number | undefined,
    status: categoriesTypes,
    isUrgent: boolean,
}

export type credentialInputs = z.infer< typeof formProcess>

