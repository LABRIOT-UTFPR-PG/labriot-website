import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { openDb } from "@/lib/db"

type TeamMember = {
  id: number;
  name: string;
  specialization: string;
  category: string;
  image: string;
  linkedin: string;
};

export default async function TeamMembers() {
  const db = await openDb()
  const team = await db.all('SELECT * FROM team ORDER BY id ASC') as TeamMember[]

  // Agrupar por categoria
  const groupedTeam = team.reduce((acc, member) => {
    const category = member.category || 'Equipe';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="space-y-16">
      {Object.entries(groupedTeam).map(([category, members]) => (
        <div key={category} className="space-y-8">
          <h3 className="text-2xl font-bold text-center border-b pb-2">{category}</h3>
          {/* justify-center centraliza os cards quando não preenchem a linha inteira */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-center max-w-5xl mx-auto">
            {members.map((member) => (
              <Card key={member.id} className="overflow-hidden w-full max-w-sm mx-auto">
                <div className="aspect-square relative">
                  <Image 
                    src={member.image || "/placeholder.svg"} 
                    alt={member.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.specialization}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    {/* Redireciona para o LinkedIn se houver, caso contrário fica desabilitado ou link morto */}
                    <Link 
                      href={member.linkedin || "#"} 
                      target={member.linkedin ? "_blank" : "_self"}
                      rel={member.linkedin ? "noopener noreferrer" : ""}
                      className={!member.linkedin ? "pointer-events-none opacity-50" : ""}
                    >
                      Ver Perfil
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}