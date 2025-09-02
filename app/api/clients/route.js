// Base de données des clients (temporaire)
let clientsDB = {
  'johanna-pokemon-site.web.app': {
    businessName: 'Johanna PokéCollection',
    sector: 'collection-pokemon',
    enabledModules: ['produits', 'avis-vinted', 'actualites'],
    credentials: { username: 'johanna', password: 'pokemon2025' },
    theme: 'pokemon'
  },
  'garage-martin.web.app': {
    businessName: 'Garage Martin',
    sector: 'garage', 
    enabledModules: ['vehicules', 'services', 'rdv'],
    credentials: { username: 'martin', password: 'garage2025' },
    theme: 'automotive'
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const site = searchParams.get('site')
  
  const client = clientsDB[site] || {
    businessName: 'Site Demo',
    sector: 'garage',
    enabledModules: ['vehicules', 'services'],
    credentials: { username: 'test', password: 'test' },
    theme: 'default'
  }
  
  return Response.json(client)
}

export async function PUT(request) {
  const { site, updates } = await request.json()
  
  if (clientsDB[site]) {
    clientsDB[site] = { ...clientsDB[site], ...updates }
    return Response.json({ success: true, config: clientsDB[site] })
  }
  
  return Response.json({ error: 'Client not found' }, { status: 404 })
}
