export class RepositoryUnavailableError extends Error {
  constructor(message = "Repositorio indisponivel sem banco configurado.") {
    super(message);
    this.name = "RepositoryUnavailableError";
  }
}

export class RepositoryNotFoundError extends Error {
  constructor(message = "Registro nao encontrado.") {
    super(message);
    this.name = "RepositoryNotFoundError";
  }
}

export class RepositoryConflictError extends Error {
  constructor(message = "Registro ja existe.") {
    super(message);
    this.name = "RepositoryConflictError";
  }
}
