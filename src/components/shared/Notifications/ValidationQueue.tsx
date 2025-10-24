import { useModifications } from '@/hooks/useModifications'
import { ShieldCheckIcon } from '@heroicons/react/24/solid'

export default function ValidationQueue() {
  const { pendingModifications } = useModifications()

  if (pendingModifications.length === 0) return null

  return (
    <div className="p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-md">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-100">
          {pendingModifications.length} modification(s) en attente de validation
        </span>
      </div>
    </div>
  )
}
