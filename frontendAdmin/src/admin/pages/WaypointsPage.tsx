import React, { useEffect, useState } from 'react';
import { waypointsApi } from '../services/api';
import { MapPin, Plus, Pencil, Trash2, Check, Clock, Circle } from 'lucide-react';

interface Waypoint {
  id: number;
  latitud: number;
  longitud: number;
  nombre: string;
  pais: string;
  orden: number;
  kmAcumulado: number;
  estado: 'PENDIENTE' | 'ACTUAL' | 'COMPLETADO';
}

export default function WaypointsPage() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWaypoint, setEditingWaypoint] = useState<Waypoint | null>(null);
  const [formData, setFormData] = useState({
    latitud: 0,
    longitud: 0,
    nombre: '',
    pais: '',
    orden: 1,
    kmAcumulado: 0,
    estado: 'PENDIENTE' as 'PENDIENTE' | 'ACTUAL' | 'COMPLETADO',
  });

  useEffect(() => {
    loadWaypoints();
  }, []);

  const loadWaypoints = async () => {
    try {
      const response = await waypointsApi.getAll();
      setWaypoints(response.data.data || []);
    } catch (error) {
      console.error('Error loading waypoints:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (waypoint?: Waypoint) => {
    if (waypoint) {
      setEditingWaypoint(waypoint);
      setFormData({
        latitud: waypoint.latitud,
        longitud: waypoint.longitud,
        nombre: waypoint.nombre,
        pais: waypoint.pais,
        orden: waypoint.orden,
        kmAcumulado: waypoint.kmAcumulado,
        estado: waypoint.estado,
      });
    } else {
      setEditingWaypoint(null);
      setFormData({
        latitud: 0,
        longitud: 0,
        nombre: '',
        pais: '',
        orden: waypoints.length + 1,
        kmAcumulado: 0,
        estado: 'PENDIENTE',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWaypoint) {
        await waypointsApi.update(editingWaypoint.id, formData);
      } else {
        await waypointsApi.create(formData);
      }
      setShowModal(false);
      loadWaypoints();
    } catch (error) {
      console.error('Error saving waypoint:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este waypoint?')) {
      try {
        await waypointsApi.delete(id);
        loadWaypoints();
      } catch (error) {
        console.error('Error deleting waypoint:', error);
      }
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return <Check size={16} className="text-green-500" />;
      case 'ACTUAL':
        return <Circle size={16} className="text-primary-500 fill-primary-500" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return 'bg-green-100 text-green-700';
      case 'ACTUAL':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-slate-100 text-slate-700';
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
        <h1 className="text-2xl font-bold text-slate-800">Waypoints</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nuevo Waypoint
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  País
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Coordenadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Km Acumulado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {waypoints.map((waypoint) => (
                <tr key={waypoint.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {waypoint.orden}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span className="font-medium text-slate-800">
                        {waypoint.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {waypoint.pais}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                    {waypoint.latitud.toFixed(4)}, {waypoint.longitud.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {waypoint.kmAcumulado.toFixed(2)} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(
                        waypoint.estado
                      )}`}
                    >
                      {getStatusIcon(waypoint.estado)}
                      {waypoint.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => openModal(waypoint)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(waypoint.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {waypoints.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay waypoints registrados
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingWaypoint ? 'Editar Waypoint' : 'Nuevo Waypoint'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  value={formData.pais}
                  onChange={(e) =>
                    setFormData({ ...formData, pais: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Latitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitud: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Longitud
                  </label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitud}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitud: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Orden
                  </label>
                  <input
                    type="number"
                    value={formData.orden}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orden: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Km Acumulado
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.kmAcumulado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        kmAcumulado: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estado: e.target.value as 'PENDIENTE' | 'ACTUAL' | 'COMPLETADO',
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="ACTUAL">Actual</option>
                  <option value="COMPLETADO">Completado</option>
                </select>
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
                  {editingWaypoint ? 'Guardar Cambios' : 'Crear Waypoint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
