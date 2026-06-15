type ApiError = {
  message?: string;
  errors?: Array<{
    field?: string;
    message?: string;
  }>;
};

const FIELD_LABELS: Record<string, string> = {
  title: "Titulo",
  name: "Nome",
  username: "Usuario",
  password: "Senha",
  currentPassword: "Senha atual",
  newPassword: "Nova senha",
  confirmPassword: "Confirmacao da senha",
  siteName: "Nome do site",
  siteDescription: "Descricao do site",
  contactEmail: "Email de contato",
  contactPhone: "Telefone de contato",
  contactAddress: "Endereco",
  description: "Descricao",
  fullDescription: "Descricao completa",
  status: "Status",
  startDate: "Data de inicio",
  endDate: "Data de conclusao",
  date: "Data",
  time: "Horario",
  location: "Localizacao",
  summary: "Resumo",
  records: "Marcacoes",
  memberId: "Membro",
  present: "Presenca",
  active: "Atividade",
  notes: "Observacoes",
  image: "Imagem",
  url: "Link",
  "socialMedia.twitter": "Twitter",
  "socialMedia.linkedin": "LinkedIn",
  "socialMedia.github": "GitHub",
  linkedin: "LinkedIn",
  category: "Setor",
  specialization: "Especializacao",
};

export function getApiErrorMessage(payload: ApiError | null, fallback: string) {
  if (payload?.errors?.length) {
    return payload.errors
      .map((error) => {
        const label = error.field ? FIELD_LABELS[error.field] ?? error.field : "Campo";
        return `${label}: ${error.message ?? "valor invalido"}`;
      })
      .join("\n");
  }

  return payload?.message || fallback;
}
