/**
 * Hook for managing students
 * Uses React Query with service layer
 */
import { useMemo } from "react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  listStudentsService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
  type StudentRow,
  type CreateStudentInput,
  type UpdateStudentInput,
} from "@/lib/services/student.services"

type UseStudentsResult = {
  students: StudentRow[]
  loading: boolean
  error: string | null
  refetch: () => Promise<unknown>
  createStudent: (data: CreateStudentInput) => Promise<StudentRow | null>
  updateStudent: (id: string, data: UpdateStudentInput) => Promise<StudentRow | null>
  deleteStudent: (id: string) => Promise<boolean>
}

export function useStudents(school?: string): UseStudentsResult {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["students", school].filter(Boolean), [school])

  const studentsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await listStudentsService(school)
      return result.students
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentInput) => createStudentService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentInput }) =>
      updateStudentService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteStudentService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
    onError: (error: Error) => {
      console.error('Delete student error:', error)
    },
  })

  const error = useMemo(() => {
    return (
      (studentsQuery.error as Error | undefined)?.message ??
      (createMutation.error as Error | undefined)?.message ??
      (updateMutation.error as Error | undefined)?.message ??
      (deleteMutation.error as Error | undefined)?.message ??
      null
    )
  }, [
    studentsQuery.error,
    createMutation.error,
    updateMutation.error,
    deleteMutation.error,
  ])

  return {
    students: studentsQuery.data ?? [],
    loading: studentsQuery.isPending || studentsQuery.isRefetching,
    error,
    refetch: studentsQuery.refetch,
    createStudent: async (data) => {
      const result = await createMutation.mutateAsync(data)
      return result.student ?? null
    },
    updateStudent: async (id, data) => {
      const result = await updateMutation.mutateAsync({ id, data })
      return result.student ?? null
    },
    deleteStudent: async (id) => {
      await deleteMutation.mutateAsync({ id })
      return true
    },
  }
}
