# 🛡️ Configuration Sécurité MonAssistant Pro

## Système Multi-Client Implémenté

### 1. Identification par Domaine
- **localhost** → `demo`
- **garage-martin.fr** → `garage-martin`
- **pizza-luigi.fr** → `pizza-luigi`

### 2. Isolation des Données
Chaque client voit uniquement ses propres données grâce au `client_id`.

## 🔐 Configuration Supabase RLS (Production)

### Étapes à suivre dans Supabase SQL Editor :

```sql
-- 1. Activer RLS sur la table vehicles
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- 2. Créer la politique d'isolation
CREATE POLICY "Isolation par client" ON vehicles
  FOR ALL 
  USING (client_id = 'demo' OR client_id = current_setting('app.client_id', true))
  WITH CHECK (client_id = 'demo' OR client_id = current_setting('app.client_id', true));

-- 3. Répéter pour les autres tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolation par client reviews" ON reviews
  FOR ALL 
  USING (client_id = 'demo' OR client_id = current_setting('app.client_id', true))
  WITH CHECK (client_id = 'demo' OR client_id = current_setting('app.client_id', true));

-- 4. Pour les actualités
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolation par client actualites" ON actualites
  FOR ALL 
  USING (client_id = 'demo' OR client_id = current_setting('app.client_id', true))
  WITH CHECK (client_id = 'demo' OR client_id = current_setting('app.client_id', true));

-- 5. Pour les posts sociaux
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Isolation par client posts" ON posts
  FOR ALL 
  USING (client_id = 'demo' OR client_id = current_setting('app.client_id', true))
  WITH CHECK (client_id = 'demo' OR client_id = current_setting('app.client_id', true));
```

## 🚀 Évolutions Futures

### Système de Licence
- Vérification de domaine autorisé
- Limitation des fonctionnalités par plan
- Expiration de licence

### Authentification
- Login client avec JWT
- Rôles et permissions
- API Keys pour intégrations

## 📋 Tests Multi-Client

1. **Test localhost** : Données `demo`
2. **Test domaine personnalisé** : Modifier `/etc/hosts` pour simuler
3. **Vérification isolation** : Chaque client ne voit que ses données
