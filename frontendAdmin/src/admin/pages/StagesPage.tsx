import React, { useEffect, useState } from 'react';
import { stagesApi } from '../services/api';
import { Route, Plus, Pencil, Trash2, Check, X } from 'lucide-react';

interface Stage {
  id: number;
  numero: number;
  titulo: string;
  fecha: string | null;
  km: number;
  desnivel: number | null;
  tiempo: string | null;
  resumen: string | null;
  enCurso: boolean;
  completada: boolean;
}

export default function StagesPage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStage, setEditingStage] = useState<Stage | null>(null);
  const [formData, setFormData] = useState({
    numero: 1,
    titulo: '',
    fecha: '',
    km: 0,
    desnivel: 0,
    tiempo: '',
    resumen: '',
    enCurso: false,
    completada: false,
  });

  useEffect(() => {
    loadStages();
  }, []);

  const loadStages = async () => {
    try {
      const response = await stagesApi.getAll();
      setStages(response.data.data || []);
    } catch (error) {
      console.error('Error loading stages:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (stage?: Stage) => {
    if (stage) {
      setEditingStage(stage);
      setFormData({
        numero: stage.numero,
        titulo: stage.titulo,
        fecha: stage.fecha || '',
        km: stage.km,
        desnivel: stage.desnivel || 0,
        tiempo: stage.tiempo || '',
        resumen: stage.resumen || '',
        enCurso: stage.enCurso,
        completada: stage.completada,
      });
    } else {
      setEditingStage(null);
      setFormData({
        numero: stages.length + 1,
        titulo: '',
        fecha: '',
        km: 0,
        desnivel: 0,
        tiempo: '',
        resumen: '',
        enCurso: false,
        completada: false,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        fecha: formData.fecha || null,
        desnivel: formData.desnivel || null,
        tiempo: formData.tiempo || null,
        resumen: formData.resumen || null,
      };

      if (editingStage) {
        await stagesApi.update(editingStage.id, data);
      } else {
        await stagesApi.create(data);
      }
      setShowModal(false);
      loadStages();
    } catch (error) {
      console.error('Error saving stage:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta etapa?')) {
      try {
        await stagesApi.delete(id);
        loadStages();
      } catch (error) {
        console.error('Error deleting stage:', error);
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
        <h1 className="text-2xl font-bold text-slate-800">Etapas</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Nueva Etapa
        </button>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              stage.completada
                ? 'border-slate-200'
                : stage.enCurso
                ? 'border-primary-300 ring-2 ring-primary-100'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    stage.completada
                      ? 'bg-green-500'
                      : stage.enCurso
                      ? 'bg-primary-500'
                      : 'bg-slate-300'
                  }`}
                >
                  {stage.completada ? <Check size={24} /> : stage.numero}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {stage.titulo}
                    </h3>
                    {stage.enCurso && (
                      <span className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded">
                        En Curso
                      </span>
                    )}
                    {stage.completada && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                        Completada
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    {stage.fecha && (
                      <span>Fecha: {new Date(stage.fecha).toLocaleDateString('es-ES')}</span>
                    )}
                    <span>{stage.km} km</span>
                    {stage.desnivel && <span>{stage.desnivel}m desnivel</span>}
                    {stage.tiempo && <span>{stage.tiempo}</span>}
                  </div>
                  {stage.resumen && (
                    <p className="text-sm text-slate-600 mt-2">{stage.resumen}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal(stage)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(stage.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {stages.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay etapas registradas
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                {editingStage ? 'Editar Etapa' : 'Nueva Etapa'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Número
                  </label>
                  <input
                    type="number"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kilómetros
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.km}
                    onChange={(e) =>
                      setFormData({ ...formData, km: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

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
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tiempo Estimado
                  </label>
                  <input
                    type="text"
                    value={formData.tiempo}
                    onChange={(e) =>
                      setFormData({ ...formData, tiempo: e.target.value })
                    }
                    placeholder="ej: 3h 30m"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Desnivel (m)
                  </label>
                  <input
                    type="number"
                    value={formData.desnivel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        desnivel: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.enCurso}
                      onChange={(e) =>
                        setFormData({ ...formData, enCurso: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-slate-700">En Curso</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.completada}
                      onChange={(e) =>
                        setFormData({ ...formData, completada: e.target.checked })
                      }
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm text-slate-700">Completada</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Resumen
                </label>
                <textarea
                  value={formData.resumen}
                  onChange={(e) =>
                    setFormData({ ...formData, resumen: e.target.value })
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
                  {editingStage ? 'Guardar Cambios' : 'Crear Etapa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
