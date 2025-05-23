"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { paquetes as paquetesData, centrosLogisticos } from "@/lib/data"
import { Calendar, Download, Eye, Search } from "lucide-react"

export function HistorialPage() {
  const searchParams = useSearchParams()
  const [paquetes, setPaquetes] = useState(paquetesData)
  const [filteredPaquetes, setFilteredPaquetes] = useState(paquetes)
  const [searchTerm, setSearchTerm] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")
  const [centroFilter, setCentroFilter] = useState<string>("todos")
  const [fechaFilter, setFechaFilter] = useState<string>("")
  const [selectedPaquete, setSelectedPaquete] = useState<(typeof paquetesData)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Aplicar filtros de URL al cargar la página
  useEffect(() => {
    const id = searchParams.get("id")
    const estado = searchParams.get("estado")

    if (id) {
      setSearchTerm(id)
    }

    if (estado) {
      setEstadoFilter(estado)
    }
  }, [searchParams])

  // Aplicar filtros cuando cambian los criterios
  useEffect(() => {
    let filtered = [...paquetes]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (paquete) =>
          paquete.idEnvio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paquete.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paquete.direccionDestino.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (estadoFilter !== "todos") {
      filtered = filtered.filter((paquete) => paquete.estado === estadoFilter)
    }

    // Filtrar por centro logístico
    if (centroFilter !== "todos") {
      filtered = filtered.filter((paquete) => paquete.centroLogistico === centroFilter)
    }

    // Filtrar por fecha
    if (fechaFilter) {
      filtered = filtered.filter((paquete) => paquete.fecha === fechaFilter)
    }

    setFilteredPaquetes(filtered)
  }, [searchTerm, estadoFilter, centroFilter, fechaFilter, paquetes])

  // Función para ver detalles del paquete
  const handleViewDetails = (paquete: (typeof paquetesData)[0]) => {
    setSelectedPaquete(paquete)
    setIsDialogOpen(true)
  }

  // Función para exportar datos
  const handleExport = () => {
    // En una implementación real, esto generaría un CSV o Excel
    alert("Exportando datos a CSV...")
  }

  // Función para obtener el texto del estado
  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "Pendiente"
      case "en_transito":
        return "En tránsito"
      case "entregado":
        return "Entregado"
      case "fallido":
        return "Fallido"
      default:
        return estado
    }
  }

  // Función para obtener la clase del estado
  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en_transito":
        return "bg-blue-100 text-blue-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      case "fallido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historial de Envíos</h1>
          <p className="text-muted-foreground">Consulte el historial completo de envíos y su estado</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Buscar</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ID, cliente o dirección"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Estado</label>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en_transito">En tránsito</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="fallido">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Centro Logístico</label>
            <Select value={centroFilter} onValueChange={setCentroFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los centros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los centros</SelectItem>
                {centrosLogisticos.map((centro) => (
                  <SelectItem key={centro.id} value={centro.id}>
                    {centro.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="pl-8"
                value={fechaFilter}
                onChange={(e) => setFechaFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="border rounded-lg">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Envío</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Dirección</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="hidden md:table-cell">Centro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaquetes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No se encontraron resultados
                  </TableCell>
                </TableRow>
              ) : (
                filteredPaquetes.map((paquete) => (
                  <TableRow key={paquete.id}>
                    <TableCell className="font-medium">{paquete.idEnvio}</TableCell>
                    <TableCell>{paquete.nombreCliente}</TableCell>
                    <TableCell className="hidden md:table-cell">{paquete.direccionDestino}</TableCell>
                    <TableCell>{new Date(paquete.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoClass(paquete.estado)}`}
                      >
                        {getEstadoText(paquete.estado)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{paquete.centroLogistico}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(paquete)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo de detalles */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles del Envío</DialogTitle>
            <DialogDescription>Información completa del paquete</DialogDescription>
          </DialogHeader>

          {selectedPaquete && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Envío</p>
                  <p>{selectedPaquete.idEnvio}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoClass(selectedPaquete.estado)}`}
                  >
                    {getEstadoText(selectedPaquete.estado)}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Cliente</p>
                  <p>{selectedPaquete.nombreCliente}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p>{selectedPaquete.direccionDestino}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha Registro</p>
                  <p>{new Date(selectedPaquete.fecha).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Peso</p>
                  <p>{selectedPaquete.peso} kg</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Centro Logístico</p>
                  <p>{selectedPaquete.centroLogistico}</p>
                </div>
                {selectedPaquete.rutaAsignada && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ruta</p>
                    <p>{selectedPaquete.rutaAsignada}</p>
                  </div>
                )}
                {selectedPaquete.vehiculoAsignado && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vehículo</p>
                    <p>{selectedPaquete.vehiculoAsignado}</p>
                  </div>
                )}
                {selectedPaquete.fechaEntrega && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha Entrega</p>
                    <p>{new Date(selectedPaquete.fechaEntrega).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedPaquete.notasEntrega && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Notas</p>
                    <p>{selectedPaquete.notasEntrega}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
