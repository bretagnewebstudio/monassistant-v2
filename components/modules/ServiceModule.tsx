'use client'

export default function ServiceModule() {
  const services = [
    { name: 'Vidange', price: 59, duration: '30 min' },
    { name: 'Révision complète', price: 149, duration: '2h' },
    { name: 'Freins AV', price: 199, duration: '1h30' },
  ]
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">🔧 Services Réparation</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Service</th>
              <th className="px-6 py-3 text-left">Prix</th>
              <th className="px-6 py-3 text-left">Durée</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="px-6 py-4">{s.name}</td>
                <td className="px-6 py-4 text-green-600 font-bold">{s.price}€</td>
                <td className="px-6 py-4">{s.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
