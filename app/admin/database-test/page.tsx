import TestDbConnection from "@/scripts/test-db-connection"

export default function DatabaseTestPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Database Connection Test</h1>
      </div>

      <div className="py-8">
        <TestDbConnection />
      </div>
    </div>
  )
}
