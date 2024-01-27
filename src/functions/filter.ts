import { categoryUser, lawyerUser } from "@/types/atributes"

export function outputFilter(arg: string, values: (string | number | Date)[], keys: string[]){

    switch(arg){
        case'beginningPeriod':
            return `"${arg}":"${values.at(keys.indexOf(arg))?.toISOString().substring(0, 10).replaceAll('-','/')}",`

        case'endPeriod':
            return  `"${arg}":"${values.at(keys.indexOf(arg))?.toISOString().substring(0, 10).replaceAll('-','/')}",`
        case'userId':
            return `"${arg}":${values.at(keys.indexOf(arg))},`
        case'categoryId':
            return `"${arg}":${values.at(keys.indexOf(arg))},`
        case'removeLawyers':
            return `"${arg}":${values.at(keys.indexOf(arg))},`
        default:
            return `"${arg}":"${values.at(keys.indexOf(arg))}",`
    }

}

export function IdforName(index: number, data: lawyerUser[] | categoryUser[]){
    let result: string = '--'
    data.map(el=>{
        if(el.id === index){
            result = el.name

        }
    })
    return result
}