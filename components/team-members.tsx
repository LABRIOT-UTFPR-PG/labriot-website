import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { openDb } from "@/lib/db";
import { sanitizeHref } from "@/lib/validation";

type TeamMember = {
  id: number;
  name: string;
  specialization: string;
  category: string;
  image: string;
  linkedin: string;
};

export default async function TeamMembers() {
  let team: TeamMember[] = [];
  try {
    const db = await openDb();
    team = (await db.all("SELECT * FROM team ORDER BY id ASC")) as TeamMember[];
  } catch (error) {
    console.error("[TeamMembers] Erro ao carregar equipe:", error);
  }

  if (team.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhum membro cadastrado no momento.
      </p>
    );
  }

  const groupedTeam = team.reduce((acc, member) => {
    const category = member.category || "Equipe";
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
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {members.map((member) => {
              const safeLinkedin = sanitizeHref(member.linkedin);
              const safeImage = sanitizeHref(member.image) || "/placeholder.svg";

              return (
                <Card
                  key={member.id}
                  className="overflow-hidden w-full max-w-[240px] mx-auto border bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative w-full overflow-hidden">
                    <Image
                      src={safeImage}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="p-3">
                    <CardTitle
                      className="text-base font-bold text-foreground truncate"
                      title={member.name}
                    >
                      {member.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 pb-2">
                    <p
                      className="text-xs text-muted-foreground truncate"
                      title={member.specialization}
                    >
                      {member.specialization}
                    </p>
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    {safeLinkedin ? (
                      <Button variant="outline" size="sm" asChild className="w-full h-8 text-xs">
                        <Link href={safeLinkedin} target="_blank" rel="noopener noreferrer">
                          Ver Perfil
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="w-full h-8 text-xs opacity-50 cursor-not-allowed"
                      >
                        Sem Perfil
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
