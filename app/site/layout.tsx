"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function TeamMembers() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setTeam(data)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {team.map((member) => (
        <Card key={member.id} className="overflow-hidden">
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
            {/* Cargo removido daqui para evitar redundância */}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{member.specialization}</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/team/${member.id}`}>Ver Perfil</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}