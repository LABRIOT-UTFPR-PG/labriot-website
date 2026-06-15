"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteMemberButton({ id }: { id: number | string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      setIsDeleting(true);
      // BACKEND RELATION: no projeto original, esta linha chamava uma rota API/backend.
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      router.refresh(); // Atualiza a página com os novos dados do servidor
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="text-destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isDeleting ? "Excluindo..." : "Excluir"}
    </Button>
  )
}
