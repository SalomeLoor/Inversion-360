import { Home, FileText, History } from "lucide-react";

export const OptionsMenu = [
  {
    btn_Name: "Principal",
    rutas_padre: "/inversor/principal",
    icono: Home,
    rol_permitido: 'usuario'
  },
  {
    btn_Name: "Mis Propuestas",
    rutas_padre: "/inversor/propuestas",
    icono: FileText,
    rol_permitido: 'usuario'
  },
  {
    btn_Name: "Historial de Propuestas",
    rutas_padre: "/inversor/historial",
    icono: History,
    rol_permitido: 'asesor'
  },
];