import { useQuery } from '@tanstack/react-query';
import { modificationsAPI } from '@services/api/modifications';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, ChevronRight } from 'lucide-react';

const ValidationQueue = () => {
  const navigate = useNavigate();

  const { data: pendingData, isLoading } = useQuery({
    queryKey: ['modifications', 'pending'],
    queryFn: () => modificationsAPI.getPendingModifications(),
    refetchInterval: 30000, // Refresh every 30s
  });

  const pendingCount = pendingData?.data?.length || 0;

  if (isLoading || pendingCount === 0) {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/modifications')}
      className="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-all group"
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <ShieldCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>

        {/* Content */}
        <div className="text-left">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-400">
              Modifications à valider
            </p>
            <span className="px-2 py-0.5 text-xs font-bold text-white bg-yellow-600 rounded-full">
              {pendingCount}
            </span>
          </div>
          <p className="text-xs text-yellow-700 dark:text-yellow-500">
            {pendingCount === 1 
              ? '1 modification en attente' 
              : `${pendingCount} modifications en attente`
            }
          </p>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-yellow-600 dark:text-yellow-400 group-hover:translate-x-1 transition-transform" />
    </button>
  );
};

export default ValidationQueue;