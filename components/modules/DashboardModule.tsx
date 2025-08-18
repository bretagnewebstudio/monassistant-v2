'use client'

export default function DashboardModule() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📊 Tableau de Bord</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-gray-500">Véhicules en stock</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-green-600">3</div>
          <div className="text-gray-500">RDV aujourd'hui</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-yellow-600">12,450€</div>
          <div className="text-gray-500">CA du mois</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl font-bold text-purple-600">156</div>
          <div className="text-gray-500">Clients actifs</div>
        </div>
      </div>
    </div>
  )
}
