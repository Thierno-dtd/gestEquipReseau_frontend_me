interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
  }
  
  const Loading = ({ size = 'md', text, fullScreen = false }: LoadingProps) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };
  
    const spinner = (
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin`}
        />
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    );
  
    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
          {spinner}
        </div>
      );
    }
  
    return (
      <div className="flex items-center justify-center p-8">
        {spinner}
      </div>
    );
  };
  
  export default Loading;