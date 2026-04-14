import React, { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import {
  Heart,
  Route,
  MapPin,
  TrendingUp,
  Calendar,
  Mountain,
  Globe,
} from 'lucide-react';

interface DashboardStats {
  totalDonado: number;
  totalDonaciones: number;
  kmRecorridos: number;
  kmMeta: number;
  etapasCompletadas: number;
  totalEtapas: number;
  paisesVisitados: number;
  diasTranscurridos: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tripRes, stagesRes, donationsRes, settingsRes] = await Promise.all([
        publicApi.getTrip(),
        publicApi.getStages(),
        publicApi.getDonations(),
        publicApi.getSettings(),
      ]);

      const trip = tripRes.data.data;
      const stages = stagesRes.data.data || [];
      const donations = donationsRes.data.data || [];
      const settings = settingsRes.data.data || [];

      const settingsMap: Record<string, string> = {};
      settings.forEach((s: any) => {
        settingsMap[s.clave] = s.valor;
      });

      const totalDonado = donations.reduce(
        (sum: number, d: any) => sum + Number(d.monto),
        0
      );

      const etapasCompletadas = stages.filter((s: any) => s.completada).length;

      setStats({
        totalDonado,
        totalDonaciones: donations.length,
        kmRecorridos: Number(trip.kmRecorridos) || 0,
        kmMeta: Number(trip.kmTotal) || 0,
        etapasCompletadas,
        totalEtapas: stages.length,
        paisesVisitados: parseInt(settingsMap['paises'] || '0'),
        diasTranscurridos: parseInt(settingsMap['diasViaje'] || '0'),
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const progress = stats ? (stats.kmRecorridos / stats.kmMeta) * 100 : 0;

  const statCards = [
    {
      label: 'Total Donado',
      value: `${stats?.totalDonado.toFixed(2)} €`,
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      label: 'Donaciones',
      value: stats?.totalDonaciones || 0,
      icon: Heart,
      color: 'bg-rose-500',
    },
    {
      label: 'Km Recorridos',
      value: `${stats?.kmRecorridos} / ${stats?.kmMeta} km`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Etapas Completadas',
      value: `${stats?.etapasCompletadas} / ${stats?.totalEtapas}`,
      icon: Route,
      color: 'bg-blue-500',
    },
    {
      label: 'Países Visitados',
      value: stats?.paisesVisitados || 0,
      icon: Globe,
      color: 'bg-purple-500',
    },
    {
      label: 'Días de Viaje',
      value: stats?.diasTranscurridos || 0,
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-slate-800">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Progreso del Viaje</h2>
          <span className="text-sm text-slate-500">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {stats?.kmRecorridos} km recorrido de {stats?.kmMeta} km objetivo
        </p>
      </div>
    </div>
  );
}
