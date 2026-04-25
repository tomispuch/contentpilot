import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: negocio }, { data: suscripcion }, { data: publicaciones }] = await Promise.all([
    supabase.from('negocios').select('*').eq('user_id', user.id).single(),
    supabase.from('suscripciones').select('*').eq('user_id', user.id).single(),
    supabase.from('publicaciones')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return (
    <>
      <TopBar title={`Hola${negocio?.nombre ? ', ' + negocio.nombre : ''}`} />
      <DashboardClient
        negocio={negocio}
        suscripcion={suscripcion}
        publicaciones={publicaciones ?? []}
      />
    </>
  )
}
