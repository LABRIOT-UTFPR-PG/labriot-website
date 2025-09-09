import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"

export default function TeamAdmin() {
  // Dados simulados de membros da equipe
  const leadership = [
    {
      id: 1,
      name: "Dra. Sarah Chen",
      role: "Diretora do Laboratório",
      specialization: "Robótica, Visão Computacional, Ética em IA",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Dr. Marcus Johnson",
      role: "Pesquisador Líder",
      specialization: "Aprendizado de Máquina, Redes Neurais",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  const researchers = [
    {
      id: 3,
      name: "Dra. Aisha Patel",
      role: "Pesquisadora Sênior",
      specialization: "Manipulação Robótica, Fusão de Sensores",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "Pesquisador Sênior",
      specialization: "Visão Computacional, SLAM Visual",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 5,
      name: "Dra. Elena Rodriguez",
      role: "Cientista de Pesquisa",
      specialization: "Processamento de Linguagem Natural, Interação Humano-Robô",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const engineers = [
    {
      id: 6,
      name: "Michael Zhang",
      role: "Engenheiro Líder",
      specialization: "Desenvolvimento de Hardware para Sistemas Robóticos",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 7,
      name: "Sophia Martinez",
      role: "Engenheira de Software Sênior",
      specialization: "Arquiteturas de Software para Controle Robótico",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Equipe</h1>
        <Button asChild>
          <Link href="/admin/team/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Membro
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar membros..." className="w-full bg-background pl-8" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      <Tabs defaultValue="leadership" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leadership">Liderança</TabsTrigger>
          <TabsTrigger value="researchers">Pesquisadores</TabsTrigger>
          <TabsTrigger value="engineers">Engenheiros</TabsTrigger>
        </TabsList>

        <TabsContent value="leadership" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {leadership.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.specialization}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/team/edit/${member.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/team/${member.id}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="researchers" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researchers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.specialization}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/team/edit/${member.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/team/${member.id}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engineers" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {engineers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.specialization}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/team/edit/${member.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/team/${member.id}`} target="_blank">
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

