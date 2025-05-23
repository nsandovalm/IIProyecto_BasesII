"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { paquetes as paquetesData, rutas, vehiculos } from "@/lib/data"

// Esquema de validación
const formSchema = z.object({
  ruta: z.string({
    required_error: "Por favor seleccione una ruta.",
  }),
  vehiculo: z.string({
    required_error: "Por favor seleccione un vehículo.",
  }),
})

export function AsignarRutaPage() {
  const { toast } = useToast()
  const [paquetes, setPaquetes] = useState(paquetesData.filter((p) => p.estado === "pendiente"))
  const [selectedPaquetes, setSelectedPaquetes] = useState<string[]>([])
  const [filteredPaquetes, setFilteredPaquetes] = useState(paquetes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruta: "",
      vehiculo: "",
    },
  })

  // Filtrar paquetes cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = paquetes.filter(
      (paquete) =>
        paquete.idEnvio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paquete.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paquete.direccionDestino.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPaquetes(filtered)
  }, [searchTerm, paquetes])

  // Manejar selección de paquetes
  const handleSelectPaquete = (id: string) => {
    setSelectedPaquetes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Seleccionar todos los paquetes
  const handleSelectAll = () => {
    if (selectedPaquetes.length === filteredPaquetes.length) {
      setSelectedPaquetes([])
    } else {
      setSelectedPaquetes(filteredPaquetes.map((p) => p.id))
    }
  }

  // Función para manejar el envío del formulario
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedPaquetes.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos un paquete para asignar.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simular envío a API
    setTimeout(() => {
      console.log({
        paquetes: selectedPaquetes,
        ruta: values.ruta,
        vehiculo: values.vehiculo,
      })

      // Actualizar estado local
      setPaquetes((prev) => prev.filter((p) => !selectedPaquetes.includes(p.id)))
      setSelectedPaquetes([])

      setIsSubmitting(false)
      form.reset()

      toast({
        title: "Ruta asignada",
        description: `${selectedPaquetes.length} paquetes han sido asignados a la ruta seleccionada.`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asignar Ruta</h1>
        <p className="text-muted-foreground">Asigne paquetes pendientes a rutas y vehículos disponibles</p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Formulario de asignación */}
        <div className="border rounded-lg p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ruta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruta</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una ruta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rutas
                            .filter((r) => r.activa)
                            .map((ruta) => (
                              <SelectItem key={ruta.id} value={ruta.id}>
                                {ruta.nombre} - {ruta.zona}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vehiculo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehículo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un vehículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehiculos
                            .filter((v) => v.disponible)
                            .map((vehiculo) => (
                              <SelectItem key={vehiculo.id} value={vehiculo.id}>
                                {vehiculo.tipo} - {vehiculo.placa} ({vehiculo.capacidad}kg)
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || selectedPaquetes.length === 0}>
                  {isSubmitting ? "Asignando..." : "Asignar Ruta"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Lista de paquetes pendientes */}
        <div className="border rounded-lg">
          <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <h2 className="text-lg font-semibold">Paquetes Pendientes</h2>
            <div className="w-full md:w-64">
              <Input
                placeholder="Buscar paquetes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t">
            <div className="relative w-full overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredPaquetes.length > 0 && selectedPaquetes.length === filteredPaquetes.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Seleccionar todos"
                      />
                    </TableHead>
                    <TableHead>ID Envío</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="hidden md:table-cell">Dirección</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha</TableHead>
                    <TableHead className="hidden md:table-cell">Peso (kg)</TableHead>
                    <TableHead className="hidden md:table-cell">Centro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPaquetes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No hay paquetes pendientes para asignar
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPaquetes.map((paquete) => (
                      <TableRow key={paquete.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPaquetes.includes(paquete.id)}
                            onCheckedChange={() => handleSelectPaquete(paquete.id)}
                            aria-label={`Seleccionar paquete ${paquete.idEnvio}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{paquete.idEnvio}</TableCell>
                        <TableCell>{paquete.nombreCliente}</TableCell>
                        <TableCell className="hidden md:table-cell">{paquete.direccionDestino}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(paquete.fecha).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{paquete.peso}</TableCell>
                        <TableCell className="hidden md:table-cell">{paquete.centroLogistico}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
