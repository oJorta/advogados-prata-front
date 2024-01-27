export function inputCheckedStatus(selectedStatus: string, currentStatus: string){
    if(selectedStatus == currentStatus){
        return {
            padding: '0.2rem',
            borderRadius: 'var(--border-radius)',
            border: 'solid 0.2rem var(--color-bondiBlue)',
            backgroundColor: 'var(--color-blue)',
            animation: 'var(--animation-appear-input)'
        }
    }
}

export function inputCheckedDocument(selectedStatus: string, currentStatus: string){
    if(selectedStatus == currentStatus){
        return {
            padding: '0.2rem',
            borderRadius: 'var(--border-radius)',
            border: 'solid 0.2rem var(--color-bondiBlue)',
            backgroundColor: 'var(--color-blue)',
            animation: 'var(--animation-appear-input)'
        }
    }
}

export function inputCheckedUrgent(selectedStatus: boolean, currentStatus: boolean){
    if(selectedStatus === currentStatus ){
        return {
            padding: '0.2rem',
            borderRadius: 'var(--border-radius)',
            border: 'solid 0.2rem var(--color-bondiBlue)',
            backgroundColor: 'var(--color-blue)',
            animation: 'var(--animation-appear-input)'
        }
    }
}