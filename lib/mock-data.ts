export const teamMembers = [
  {
    id: 1,
    name: "Equipe LabRIoT",
    role: "Pesquisador",
    specialization: "Pesquisa em IoT, IA e automacao",
    category: "leadership",
    image: "/placeholder.svg",
    linkedin: "",
  },
];

export const projects = [
  {
    id: 1,
    title: "Alimentador IoT",
    description: "Prototipo conectado para automacao e monitoramento.",
    status: "ongoing",
    startDate: "2026",
    endDate: "",
    image: "/projects/alimentador-iot.png",
    url: "",
    fullDescription:
      "Projeto demonstrativo usado como ponto inicial para reconectar o frontend ao novo backend.",
  },
];

export const research = [
  {
    id: 1,
    title: "Internet das Coisas Aplicada",
    description: "Linha de pesquisa voltada a sensores, conectividade e automacao inteligente.",
  },
];

export const publications = [
  {
    id: 1,
    title: "Publicacao demonstrativa",
    authors: "LabRIoT",
    journal: "Em reconstrucao",
    year: 2026,
    doi: "",
    description: "Registro temporario ate conectarmos MongoDB via Prisma.",
  },
];

export const posts = [
  {
    id: 1,
    title: "Reconstrucao do site LabRIoT",
    summary: "Frontend restaurado e backend sendo recriado com Prisma e MongoDB.",
    content:
      "Este post temporario confirma que as rotas publicas simples ja respondem enquanto o banco real e conectado.",
    author: "LabRIoT",
    date: "2026-06-12",
    image: "/images/ia.avif",
  },
];

export const events = [
  {
    id: 1,
    title: "Evento demonstrativo",
    description: "Agenda temporaria para validar a tela de eventos.",
    date: "2026-06-12",
    time: "19:00",
    location: "UTFPR",
    status: "Proximo",
  },
];

export function findById<T extends { id: number }>(items: T[], id: string) {
  return items.find((item) => String(item.id) === id) ?? null;
}
