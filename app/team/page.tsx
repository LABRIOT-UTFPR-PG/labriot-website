import Link from "next/link"
import { Button } from "@/components/ui/button"
import TeamMembers from "@/components/team-members"

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nossa Equipe</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Conheça as mentes brilhantes por trás das pesquisas e inovações revolucionárias do Labriot.
                </p>
              </div>
            </div>
            
            {/* Componente unificado sem cargos e sem abas */}
            <div className="mt-12 w-full max-w-5xl mx-auto">
              <TeamMembers />
            </div>

          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Colabore com Nossa Equipe</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                Interessado em fazer parceria com nossos pesquisadores em um projeto? Estamos abertos a colaborações com
                instituições acadêmicas, parceiros da indústria e agências governamentais.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/contact">Contate Nossa Equipe</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}