import React, { useEffect, useState } from 'react';
import { donationsApi } from '../services/api';
import { Heart, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface Donation {
  id: number;
  nombre: string;
  monto: number;
  comentario: string | null;
  email: string | null;
  telefono: string | null;
  fecha: string;
  contactoRequerido: boolean;
  kmFinanciados: number;
}

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const response = await donationsApi.getAll();
      setDonations(response.data.data || []);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalDonado = donations.reduce((sum, d) => sum + d.monto, 0);

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
        <h1 className="text-2xl font-bold text-slate-800">Donaciones</h1>
        <div className="bg-primary-50 px-4 py-2 rounded-lg">
          <span className="text-primary-700 font-semibold">
            Total: {totalDonado.toFixed(2)}€
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Km Financiados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Comentario
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(donation.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-pink-100 rounded-full">
                        <Heart size={14} className="text-pink-600" />
                      </div>
                      <span className="font-medium text-slate-800">
                        {donation.nombre}
                      </span>
                      {donation.contactoRequerido && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">
                          Contacto
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-green-600">
                      {donation.monto.toFixed(2)}€
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {donation.kmFinanciados.toFixed(2)} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {donation.email && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail size={14} className="text-slate-400" />
                          {donation.email}
                        </div>
                      )}
                      {donation.telefono && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Phone size={14} className="text-slate-400" />
                          {donation.telefono}
                        </div>
                      )}
                      {!donation.email && !donation.telefono && (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 max-w-xs truncate">
                      {donation.comentario || '-'}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {donations.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            No hay donaciones registradas
          </div>
        )}
      </div>
    </div>
  );
}
