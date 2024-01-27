export const affinityName = (value: number) => {
    switch (value) {
        case 0:
            return 'Básico'
        case 1:
            return 'Bom'
        case 2:
            return 'Muito Bom'
        default:
            return 'Não'
    }
}