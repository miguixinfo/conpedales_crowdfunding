import React, { useEffect, useState } from 'react';
import { previousTripsApi } from '../services/api';
import { History, Plus, Pencil, Trash2 } from 'lucide-react';

interface PreviousTrip {
  id: number;
  titulo: string;
  anio: number;
  distancia: number;
  descripcion: string | null;
  icono: string | null;
}

export default function PreviousTripsPage() {
  const [trips, setTrips] = useState<PreviousTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<PreviousTrip | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    anio: new Date().getFullYear(),
    distancia: 0,
    descripcion: '',
    icono: '',
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const response = await previousTripsApi.getAll();
      setTrips(response.data.data || []);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (trip?: PreviousTrip) => {
    if (trip) {
      setEditingTrip(trip);
      setFormData({
        titulo: trip.titulo,
        anio: trip.anio,
        distancia: trip.distancia,
        descripcion: trip.descripcion || '',
        icono: trip.icono || '',
      });
    } else {
      setEditingTrip(null);
      setFormData({
        titulo: '',
        anio: new Date().getFullYear(),
        distancia: 0,
        descripcion: '',
        icono: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        descripcion: formData.descripcion || null,
        icono: formData.icono || null,
      };

      if (editingTrip) {
        await previousTripsApi.update(editingTrip.id, data);
      } else {
        await previousTripsApi.create(data);
      }
      setShowModal(false);
      loadTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      try {
        await previousTripsApi.delete(id);
        loadTrips();
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
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
        <h1 className="text-2xl font-bold text-slate-800">Viajes Anteriores</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nuevo Viaje
        </button>
      </div>

      <div className="grid gap-4">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {trip.titulo}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="font-medium">{trip.anio}</span>
                    <span>{trip.distancia} km</span>
                  </div>
                  {trip.descripcion && (
                    <p className="text-sm text-slate-600 mt-2">{trip.descripcion}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(trip)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {trips.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            No hay viajes anteriores registrados
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingTrip ? 'Editar Viaje' : 'Nuevo Viaje'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Año
                  </label>
                  <input
                    type="number"
                    value={formData.anio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anio: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Distancia (km)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.distancia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        distancia: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Icono
                </label>
                <select
                  value={formData.icono}
                  onChange={(e) =>
                    setFormData({ ...formData, icono: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccionar icono</option>
                  <option value="bike">Bicicleta</option>
                  <option value="mountain">Montaña</option>
                  <option value="road">Carretera</option>
                </select>
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
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  {editingTrip ? 'Guardar Cambios' : 'Crear Viaje'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
