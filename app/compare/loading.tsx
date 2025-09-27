export default function CompareLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="space-y-4">
              {/* Table Header */}
              <div className="flex gap-4">
                <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="w-64 h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>

              {/* Table Rows */}
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-64 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
