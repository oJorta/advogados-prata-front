export function addStyle(verify?: boolean){
    if(verify){
        return {border: 'solid 0.125rem var(--color-invalid)'}
    }
}

export function addStylePlace(verify?: boolean){
    if(verify){
        return {marginLeft: '10rem'}
    }
}