import { useState, useEffect, useCallback } from 'react'

interface Departement {
  id: string
  nom: string
  code: string
  chef_lieu: string
  population: number
  superficie: number
  arrondissements: Array<{
    id: string
    nom: string
    code: string
    population: number
    superficie: number
  }>
}

export function useDepartements() {
  const [departements, setDepartements] = useState<Departement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDepartements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/departements')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des départements')
      }
      
      const data = await response.json()
      setDepartements(data)
    } catch (err) {
      console.error('Erreur lors du chargement des départements:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDepartements()
  }, [fetchDepartements])

  const getDepartementNames = useCallback(() => {
    return departements.map(dept => dept.nom)
  }, [departements])

  return {
    departements,
    departementNames: getDepartementNames(),
    loading,
    error,
    refetch: fetchDepartements
  }
} 