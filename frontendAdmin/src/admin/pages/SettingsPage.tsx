import React, { useEffect, useState } from 'react';
import { publicApi, settingsApi, metricsApi } from '../services/api';
import { Settings, Save, Globe, Mountain, Calendar, Euro } from 'lucide-react';

interface Setting {
  clave: string;
  valor: string;
  descripcion: string | null;
  editable: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    diasViaje: '',
    desnivel: '',
    paises: '',
    precioPorKm: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await publicApi.getSettings();
      const settingsData = response.data.data || [];
      setSettings(settingsData);

      const settingsMap: Record<string, string> = {};
      settingsData.forEach((s: Setting) => {
        settingsMap[s.clave] = s.valor;
      });

      setFormData({
        diasViaje: settingsMap['diasViaje'] || '',
        desnivel: settingsMap['desnivel'] || '',
        paises: settingsMap['paises'] || '',
        precioPorKm: settingsMap['precioPorKm'] || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await metricsApi.update(1, {
        diasViaje: formData.diasViaje,
        desnivel: formData.desnivel,
        paises: formData.paises,
      });

      await settingsApi.update('precioPorKm', {
        valor: formData.precioPorKm,
      });

      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Días de Viaje',
      value: formData.diasViaje || '0',
      icon: Calendar,
      bg: 'bg-blue-500',
    },
    {
      label: 'Desnivel Acumulado',
      value: `${formData.desnivel || '0'}m`,
      icon: Mountain,
      bg: 'bg-green-500',
    },
    {
      label: 'Países Visitados',
      value: formData.paises || '0',
      icon: Globe,
      bg: 'bg-purple-500',
    },
    {
      label: 'Precio por Km',
      value: `${formData.precioPorKm || '0'}€`,
      icon: Euro,
      bg: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Settings size={20} />
            Métricas del Viaje
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Días de Viaje Transcurridos
              </label>
              <input
                type="number"
                value={formData.diasViaje}
                onChange={(e) =>
                  setFormData({ ...formData, diasViaje: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Desnivel Acumulado (m)
              </label>
              <input
                type="number"
                value={formData.desnivel}
                onChange={(e) =>
                  setFormData({ ...formData, desnivel: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Países Visitados
              </label>
              <input
                type="number"
                value={formData.paises}
                onChange={(e) =>
                  setFormData({ ...formData, paises: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Precio por Kilómetro (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precioPorKm}
                onChange={(e) =>
                  setFormData({ ...formData, precioPorKm: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
