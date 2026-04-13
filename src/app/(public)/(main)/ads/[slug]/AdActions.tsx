// app/ads/[slug]/AdActions.tsx
'use client'

import { Button } from '@/components/ui/button'
import { adService } from '@/services/ad/ad.service'
import { useMutation } from '@tanstack/react-query'
import { Edit3, Power, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function AdActions({ adId, slug, status }: { adId: string, slug: string, status: string }) {
    const router = useRouter()

    const { mutate: closeAd, isPending: isClosing } = useMutation({
        mutationFn: () => adService.close(adId),
        onSuccess: () => {
            toast.success('Объявление закрыто')
            router.refresh()
        }
    })

    const { mutate: deleteAd, isPending: isDeleting } = useMutation({
        mutationFn: () => adService.remove(adId),
        onSuccess: () => {
            toast.success('Объявление удалено')
            router.push('/ads')
        }
    })

    return (
        <div className="flex flex-col gap-3 mt-6 pt-6 border-t">
            <p className="text-xs font-semibold text-slate-400 uppercase">Управление</p>
            <div className="grid grid-cols-2 gap-2">
                <Button 
                    variant="outline" 
                    onClick={() => router.push(`/ads/${slug}/edit`)}
                    className="gap-2"
                >
                    <Edit3 size={16} /> Редактировать
                </Button>

                {status === 'ACTIVE' && (
                    <Button 
                        variant="secondary" 
                        onClick={() => closeAd()} 
                        disabled={isClosing}
                        className="gap-2 text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-100"
                    >
                        <Power size={16} /> Закрыть
                    </Button>
                )}
            </div>

            <Button 
                variant="ghost" 
                onClick={() => {
                    if (confirm('Вы уверены?')) deleteAd()
                }}
                disabled={isDeleting}
                className="gap-2 text-red-400 hover:text-red-500 hover:bg-red-50"
            >
                <Trash2 size={16} /> Удалить объявление
            </Button>
        </div>
    )
}