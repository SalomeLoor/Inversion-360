export interface AssetAllocation {
  code: string;
  desc: string;
  risk: string;
  type: string;
  pct: number;
  amount: number;
}

export interface Proposal {
  id: string;
  clientId: string;
  clientName: string;
  age: number;
  monthlyIncome: number;
  profile: string;
  objetivo: string;
  inversion: number;
  horizonte: string;
  tolerancia: string;
  generado: string;
  status: "Pendiente" | "Aprobada" | "Rechazada";
  score: number;
  rulesVersion: string;
  justificationIA: string;
  assets: AssetAllocation[];
  advisorComments?: string;
  reviewedAt?: string;
  revisedAssets?: AssetAllocation[];
  reviewedBy?: string;
  decisionType?: "Aprobada sin Cambios" | "Modificada y Aprobada" | "Rechazada";
}

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "26b6e6d7",
    clientId: "13131",
    clientName: "Juan Pérez",
    age: 23,
    monthlyIncome: 2300,
    profile: "Agresivo",
    objetivo: "COMPRAR CASA",
    inversion: 500,
    horizonte: "MEDIO",
    tolerancia: "ALTA",
    generado: "2026-07-11 20:23:55",
    status: "Pendiente",
    score: 12,
    rulesVersion: "v1.0.0",
    justificationIA: "[Inversiones IA - Simulación]: Portafolio diseñado para maximizar el crecimiento patrimonial asumiendo riesgos de mercado locales. Se concentra en Renta Variable de emisores líderes (45% en Corporación Favorita y 15% en Banco Pichincha), capturando altos rendimientos por dividendos e incrementos de valor. Se asigna un 15% a Bonos soberanos ecuatorianos (EC-GOV-BOND) para complementar el rendimiento con renta fija de alto cupón y riesgo país, manteniendo liquidez al mínimo (5% DPF).",
    assets: [
      { code: "EC-CASH", desc: "Depósito a Plazo Fijo (DPF) Bancos Ecuador", risk: "Bajo", type: "LIQUIDEZ", pct: 5, amount: 25 },
      { code: "EC-MUTUAL-FUND", desc: "Fondo de Inversión Local Administrado", risk: "Medio", type: "RENTA FIJA", pct: 10, amount: 50 },
      { code: "EC-REIT", desc: "Fideicomiso Inmobiliario Local (Bienes Raíces UIO/GYE)", risk: "Medio", type: "ALTERNATIVOS", pct: 10, amount: 50 },
      { code: "EC-FAVORITA", desc: "Acciones Corporación Favorita C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 45, amount: 225 },
      { code: "EC-PICHINCHA", desc: "Acciones Banco Pichincha C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 15, amount: 75 },
      { code: "EC-GOV-BOND", desc: "Bonos del Estado Ecuatoriano", risk: "Alto", type: "RENTA FIJA", pct: 15, amount: 75 }
    ]
  },
  {
    id: "9f3a12ce",
    clientId: "82741",
    clientName: "María Rodríguez",
    age: 35,
    monthlyIncome: 1800,
    profile: "Moderado",
    objetivo: "FONDO DE EMERGENCIA",
    inversion: 300,
    horizonte: "CORTO",
    tolerancia: "MEDIA",
    generado: "2026-07-12 11:05:12",
    status: "Pendiente",
    score: 8,
    rulesVersion: "v1.0.0",
    justificationIA: "[Inversiones IA - Simulación]: Portafolio enfocado en preservar capital y proveer liquidez a corto plazo. Asigna un 40% a instrumentos de liquidez y renta fija de bajo riesgo, con un 20% en fideicomisos y un 10% en acciones líderes para capturar retornos moderados sin sobreexponer el capital.",
    assets: [
      { code: "EC-CASH", desc: "Depósito a Plazo Fijo (DPF) Bancos Ecuador", risk: "Bajo", type: "LIQUIDEZ", pct: 30, amount: 90 },
      { code: "EC-MUTUAL-FUND", desc: "Fondo de Inversión Local Administrado", risk: "Medio", type: "RENTA FIJA", pct: 30, amount: 90 },
      { code: "EC-REIT", desc: "Fideicomiso Inmobiliario Local (Bienes Raíces UIO/GYE)", risk: "Medio", type: "ALTERNATIVOS", pct: 20, amount: 60 },
      { code: "EC-FAVORITA", desc: "Acciones Corporación Favorita C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 10, amount: 30 },
      { code: "EC-PICHINCHA", desc: "Acciones Banco Pichincha C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 5, amount: 15 },
      { code: "EC-GOV-BOND", desc: "Bonos del Estado Ecuatoriano", risk: "Alto", type: "RENTA FIJA", pct: 5, amount: 15 }
    ]
  },
  {
    id: "7c81d40b",
    clientId: "92831",
    clientName: "Carlos Mendoza",
    age: 55,
    monthlyIncome: 4200,
    profile: "Conservador",
    objetivo: "JUBILACIÓN",
    inversion: 800,
    horizonte: "LARGO",
    tolerancia: "BAJA",
    generado: "2026-07-02 16:40:00",
    status: "Pendiente",
    score: 4,
    rulesVersion: "v1.0.0",
    justificationIA: "[Inversiones IA - Simulación]: Portafolio ultra-conservador diseñado para la preservación estricta de capital ante la cercanía de la jubilación. Concentra un 60% en DPFs y Fondos Mutuos de bajo riesgo, y un 25% en bonos gubernamentales ecuatorianos. La exposición a renta variable es mínima (15% en total).",
    assets: [
      { code: "EC-CASH", desc: "Depósito a Plazo Fijo (DPF) Bancos Ecuador", risk: "Bajo", type: "LIQUIDEZ", pct: 40, amount: 320 },
      { code: "EC-MUTUAL-FUND", desc: "Fondo de Inversión Local Administrado", risk: "Medio", type: "RENTA FIJA", pct: 20, amount: 160 },
      { code: "EC-REIT", desc: "Fideicomiso Inmobiliario Local (Bienes Raíces UIO/GYE)", risk: "Medio", type: "ALTERNATIVOS", pct: 25, amount: 200 },
      { code: "EC-FAVORITA", desc: "Acciones Corporación Favorita C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 5, amount: 40 },
      { code: "EC-PICHINCHA", desc: "Acciones Banco Pichincha C.A.", risk: "Alto", type: "RENTA VARIABLE", pct: 5, amount: 40 },
      { code: "EC-GOV-BOND", desc: "Bonos del Estado Ecuatoriano", risk: "Alto", type: "RENTA FIJA", pct: 5, amount: 40 }
    ]
  }
];
