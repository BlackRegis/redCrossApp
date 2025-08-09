import { useState, useEffect, useCallback } from 'react'

interface CarteMembre {
  id: string
  numeroCarte: string
  dateEmission: string
  dateExpiration: string
  statut: string
  statutCalcule: string
  typeCarte: string
  createdAt: string
  updatedAt: string
  membre: {
    id: string
    nom: string
    prenom: string
    email: string
    telephone: string
    statut: string
    departement?: string
    arrondissement?: string
  }
}

interface ApiResponse {
  cartes: CarteMembre[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface UseCartesFilters {
  search: string
  departement: string
  statut: string
  typeCarte: string
  tab: string
  page: number
  limit: number
}

export function useCartes() {
  const [cartes, setCartes] = useState<CarteMembre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UseCartesFilters>({
    search: '',
    departement: 'all',
    statut: 'all',
    typeCarte: 'all',
    tab: 'toutes',
    page: 1,
    limit: 10
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1
  })

  const fetchCartes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        search: filters.search,
        departement: filters.departement,
        statut: filters.statut,
        typeCarte: filters.typeCarte,
        tab: filters.tab,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      })

      // Toujours récupérer toutes les cartes pour les statistiques globales
      // La pagination et le filtrage se fait côté client
      params.set('all', 'true')

      const response = await fetch(`/api/cartes?${params}`)
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des cartes')
      }
      
      const data: ApiResponse = await response.json()
      
      setCartes(data.cartes)
      setPagination({
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.page
      })
    } catch (err) {
      console.error('Erreur lors du chargement des cartes:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchCartes()
  }, [fetchCartes])

  const updateFilters = useCallback((newFilters: Partial<UseCartesFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Réinitialiser la page quand les filtres changent
    }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      departement: 'all',
      statut: 'all',
      typeCarte: 'all',
      tab: 'toutes',
      page: 1,
      limit: 10
    })
  }, [])

  return {
    cartes,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    setPage,
    clearFilters,
    refetch: fetchCartes
  }
} 