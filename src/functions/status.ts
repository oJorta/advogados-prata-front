import { status } from "@/types/atributes"
import { categoriesTypes } from "@/types/enums"

export function StatusEnum(arg: string){

    switch(arg){
        case'Em inicialização':
            return 'Inicio'

        case'Em aguardo':
            return  'Aguardo'

        case'Não visualizado':
            return 'NaoVisualizado'
            
        default:
            return 'Inicio'
    }

}

export function selectedStatus(str: status){

    const selectedStatus = {
        "Em inicialização": categoriesTypes.Inicio,
        "Em aguardo": categoriesTypes.Aguardo,
    }
    
    return selectedStatus[str]
}

export type pathnames = '/painel/processos' | '/painel/processos/completo' | '/painel/processos/aguardo'

export function pathnameStatus(pathname: string){
    if(pathname === '/painel/processos'){
        return 0
    }

    if(pathname === '/painel/processos/completo'){
        return 1

    }

    if(pathname === '/painel/processos/aguardo'){
        return 2
    }
}