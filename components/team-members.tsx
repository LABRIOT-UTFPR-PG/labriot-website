import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSafeHref, getSafeImageSrc } from "@/lib/media"
import { getPublicTeam } from "@/lib/public-data"

type TeamMember = {
  id: number | string;
  name: string;
  specialization: string | null;
  category: string;
  image: string | null;
  linkedin: string | null;
};

function getCategoryLabel(category: string) {
  if (category === 'leadership') return 'Liderança';
  if (category === 'students') return 'Estudantes';
  return category || 'Equipe';
}

export default async function TeamMembers() {
  const team = await getPublicTeam() as TeamMember[]

  // Agrupar por categoria
  const groupedTeam = team.reduce((acc, member) => {
    const category = getCategoryLabel(member.category);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  return (
    <div className="space-y-14">
      {Object.entries(groupedTeam).map(([category, members]) => (
        <div key={category} className="space-y-8">
          <h3 className="section-kicker mx-auto">{category}</h3>
          {/* flex-wrap e justify-center centralizam perfeitamente os cards mesmo quando há poucos membros */}
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {members.map((member) => (
              <Card key={member.id} className="premium-card group mx-auto w-full max-w-[260px] !border-0 !bg-transparent !shadow-none">
                <div className="relative m-3 aspect-[4/4.5] overflow-hidden rounded-2xl bg-muted/40">
                  <Image 
                    src={getSafeImageSrc(member.image)} 
                    alt={member.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <CardHeader className="p-5 pb-2">
                  <CardTitle className="truncate font-display text-lg font-semibold tracking-[-0.035em] text-foreground" title={member.name}>
                    {member.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4 pt-0">
                  <p className="truncate text-sm text-muted-foreground" title={member.specialization ?? undefined}>
                    {member.specialization}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
                  {getSafeHref(member.linkedin) ? (
                    <Button variant="outline" size="sm" asChild className="h-9 w-full text-xs">
                      <Link 
                        href={getSafeHref(member.linkedin) ?? "#"} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Perfil
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="h-9 w-full cursor-not-allowed text-xs opacity-50">
                      Sem Perfil
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
