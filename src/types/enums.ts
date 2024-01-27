export enum categoriesTypes {
    Inicio = "Em inicialização",
    Aguardo = "Em aguardo",
}

export enum Status {
    EmAguardo = 'Em aguardo',
    EmAndamento = 'Em andamento',
    Concluido = 'Concluído',
    NaoVisualizado = 'Não visualizado',
    AguardandoRetorno = 'Aguardando retorno',
    EmInicializacao = 'Em inicialização',
  }

export enum isUrgent {
    sim = 1,
    nao = 0
}

export enum orderBy {
    Lawyer = 'lawyer',
    Client = 'client',
    Deadline = 'deadline',
    DistributionDate = 'distributionDate',
    ConclusionDate = 'conclusionDate',
    Category = 'category',
}