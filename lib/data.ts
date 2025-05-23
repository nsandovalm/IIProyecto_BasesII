// Tipos de datos
export interface Paquete {
  id: string
  idEnvio: string
  nombreCliente: string
  direccionDestino: string
  fecha: string
  peso: number
  estado: "pendiente" | "en_transito" | "entregado" | "fallido"
  centroLogistico: string
  rutaAsignada?: string
  vehiculoAsignado?: string
  fechaEntrega?: string
  notasEntrega?: string
  imagenFirma?: string
}

export interface Ruta {
  id: string
  nombre: string
  zona: string
  activa: boolean
}

export interface Vehiculo {
  id: string
  placa: string
  tipo: string
  capacidad: number
  disponible: boolean
}

export interface CentroLogistico {
  id: string
  nombre: string
  direccion: string
}

// Datos de ejemplo
export const paquetes: Paquete[] = [
  {
    id: "1",
    idEnvio: "ENV-001-2023",
    nombreCliente: "María González",
    direccionDestino: "Calle Principal 123, Ciudad",
    fecha: "2023-05-15",
    peso: 2.5,
    estado: "pendiente",
    centroLogistico: "CD-001",
  },
  {
    id: "2",
    idEnvio: "ENV-002-2023",
    nombreCliente: "Juan Pérez",
    direccionDestino: "Av. Central 456, Ciudad",
    fecha: "2023-05-15",
    peso: 1.8,
    estado: "en_transito",
    centroLogistico: "CD-001",
    rutaAsignada: "R-001",
    vehiculoAsignado: "V-002",
  },
  {
    id: "3",
    idEnvio: "ENV-003-2023",
    nombreCliente: "Carlos Rodríguez",
    direccionDestino: "Plaza Mayor 789, Ciudad",
    fecha: "2023-05-14",
    peso: 3.2,
    estado: "entregado",
    centroLogistico: "CD-002",
    rutaAsignada: "R-002",
    vehiculoAsignado: "V-001",
    fechaEntrega: "2023-05-15",
    notasEntrega: "Entregado en recepción",
  },
  {
    id: "4",
    idEnvio: "ENV-004-2023",
    nombreCliente: "Ana Martínez",
    direccionDestino: "Calle Secundaria 321, Ciudad",
    fecha: "2023-05-14",
    peso: 1.5,
    estado: "fallido",
    centroLogistico: "CD-001",
    rutaAsignada: "R-001",
    vehiculoAsignado: "V-003",
    fechaEntrega: "2023-05-15",
    notasEntrega: "Dirección incorrecta",
  },
  {
    id: "5",
    idEnvio: "ENV-005-2023",
    nombreCliente: "Luis Sánchez",
    direccionDestino: "Av. Principal 654, Ciudad",
    fecha: "2023-05-13",
    peso: 4.7,
    estado: "entregado",
    centroLogistico: "CD-002",
    rutaAsignada: "R-003",
    vehiculoAsignado: "V-002",
    fechaEntrega: "2023-05-14",
    notasEntrega: "Entregado al destinatario",
  },
  {
    id: "6",
    idEnvio: "ENV-006-2023",
    nombreCliente: "Elena Torres",
    direccionDestino: "Calle Nueva 987, Ciudad",
    fecha: "2023-05-15",
    peso: 2.3,
    estado: "pendiente",
    centroLogistico: "CD-001",
  },
  {
    id: "7",
    idEnvio: "ENV-007-2023",
    nombreCliente: "Roberto Díaz",
    direccionDestino: "Plaza Central 234, Ciudad",
    fecha: "2023-05-15",
    peso: 1.9,
    estado: "pendiente",
    centroLogistico: "CD-002",
  },
  {
    id: "8",
    idEnvio: "ENV-008-2023",
    nombreCliente: "Carmen López",
    direccionDestino: "Av. Secundaria 567, Ciudad",
    fecha: "2023-05-14",
    peso: 3.5,
    estado: "en_transito",
    centroLogistico: "CD-001",
    rutaAsignada: "R-002",
    vehiculoAsignado: "V-001",
  },
]

export const rutas: Ruta[] = [
  {
    id: "R-001",
    nombre: "Ruta Norte",
    zona: "Zona Norte",
    activa: true,
  },
  {
    id: "R-002",
    nombre: "Ruta Centro",
    zona: "Zona Centro",
    activa: true,
  },
  {
    id: "R-003",
    nombre: "Ruta Sur",
    zona: "Zona Sur",
    activa: true,
  },
  {
    id: "R-004",
    nombre: "Ruta Este",
    zona: "Zona Este",
    activa: false,
  },
]

export const vehiculos: Vehiculo[] = [
  {
    id: "V-001",
    placa: "ABC-123",
    tipo: "Furgoneta",
    capacidad: 500,
    disponible: true,
  },
  {
    id: "V-002",
    placa: "DEF-456",
    tipo: "Camión pequeño",
    capacidad: 1500,
    disponible: true,
  },
  {
    id: "V-003",
    placa: "GHI-789",
    tipo: "Motocicleta",
    capacidad: 50,
    disponible: true,
  },
  {
    id: "V-004",
    placa: "JKL-012",
    tipo: "Camión grande",
    capacidad: 3000,
    disponible: false,
  },
]

export const centrosLogisticos: CentroLogistico[] = [
  {
    id: "CD-001",
    nombre: "Centro Principal",
    direccion: "Av. Industrial 123, Ciudad",
  },
  {
    id: "CD-002",
    nombre: "Centro Secundario",
    direccion: "Calle Comercial 456, Ciudad",
  },
]
