export default function obsStatus(obs: string){
    switch(obs){
        case 'Não visualizado':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-gray)'
            }

        case 'Em andamento':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-green)'
            }
        case 'Aguardando retorno':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-red)'
            }

        case 'Em aguardo':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-yellow)'
            }

        case 'Em inicialização':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-yellow)'
            }

        case 'Concluído':
            return {
                padding: '0 0.2rem',
                borderLeft: 'solid 0.5rem var(--status-green)'
            }
    }
}