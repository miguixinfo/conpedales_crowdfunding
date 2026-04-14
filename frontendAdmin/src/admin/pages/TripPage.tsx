import React, { useEffect, useState } from 'react';
import { tripApi } from '../services/api';
import { Bike, Save } from 'lucide-react';

interface Trip {
  id: number;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  diasEstimados: number | null;
  kmTotal: number;
  kmRecorridos: number;
  activo: boolean;
}

export default function TripPage() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    subtitulo: '',
    descripcion: '',
    fechaInicio: '',
    diasEstimados: 0,
    kmTotal: 0,
    kmRecorridos: 0,
    activo: true,
  });

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    try {
      const response = await tripApi.get(1);
      const tripData = response.data.data;
      setTrip(tripData);
      setFormData({
        titulo: tripData.titulo || '',
        subtitulo: tripData.subtitulo || '',
        descripcion: tripData.descripcion || '',
        fechaInicio: tripData.fechaInicio || '',
        diasEstimados: tripData.diasEstimados || 0,
        kmTotal: tripData.kmTotal || 0,
        kmRecorridos: tripData.kmRecorridos || 0,
        activo: tripData.activo,
      });
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...formData,
        subtitulo: formData.subtitulo || null,
        descripcion: formData.descripcion || null,
        fechaInicio: formData.fechaInicio || null,
      };
      await tripApi.update(1, data);
      alert('Viaje actualizado correctamente');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Error al guardar los cambios');
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Editar Viaje</h1>
        <div className="flex items-center gap-2">
          {trip?.activo && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              Activo
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título del Viaje
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subtítulo
            </label>
            <input
              type="text"
              value={formData.subtitulo}
              onChange={(e) =>
                setFormData({ ...formData, subtitulo: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={formData.fechaInicio}
                onChange={(e) =>
                  setFormData({ ...formData, fechaInicio: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Días Estimados
              </label>
              <input
                type="number"
                value={formData.diasEstimados}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    diasEstimados: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kilómetros Totales
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.kmTotal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kmTotal: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kilómetros Recorridos
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.kmRecorridos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    kmRecorridos: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) =>
                setFormData({ ...formData, activo: e.target.checked })
              }
              className="w-5 h-5 text-primary-600 rounded"
            />
            <label htmlFor="activo" className="text-sm text-slate-700">
              Viaje activo
            </label>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
