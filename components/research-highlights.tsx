import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function ResearchHighlights() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Visualização de publicação de pesquisa"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">Aprendizado Adaptativo em Sistemas Robóticos</h3>
              <p className="text-sm text-muted-foreground mt-2">Publicado em IEEE Transactions on Robotics, 2023</p>
              <p className="text-sm mt-2">
                Este artigo apresenta uma abordagem inovadora para aprendizado adaptativo em sistemas robóticos,
                permitindo que robôs se ajustem rapidamente a ambientes e tarefas em mudança.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Diagrama de arquitetura de rede neural"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">Percepção Multi-Modal para Manipulação Robótica</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Publicado na Conference on Robot Learning (CoRL), 2022
              </p>
              <p className="text-sm mt-2">
                Esta pesquisa introduz uma estrutura para integrar informações visuais, táteis e proprioceptivas para
                aprimorar as capacidades de manipulação robótica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="Diagrama de estrutura de IA ética"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">Considerações Éticas na Tomada de Decisão Autônoma</h3>
              <p className="text-sm text-muted-foreground mt-2">Publicado no AI Ethics Journal, 2022</p>
              <p className="text-sm mt-2">
                Este artigo explora as implicações éticas da tomada de decisão autônoma em sistemas de IA e propõe uma
                estrutura para o desenvolvimento responsável de IA.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

