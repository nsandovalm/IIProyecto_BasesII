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
import { paquetes as paquetesData } from "@/lib/data"
import { fetchCentros } from "@/app/services/nodes.servis"
import { fetchVehiculos } from "@/app/services/vehiculos.service"
import { fetchRutas } from "@/app/services/rutas.service"
import { fetchShipments } from "@/app/services/shipments.service"


interface Shipment {
  shipment_id: number;
  cedula: string;
  qr_code: string;
  status: string;
  origin: string | null;
  destination: string | null;
  created_at: string;  // fecha como string, por ej. "24/05/2025"
  amount: string;      // aunque es numérico, en el JSON está como string
}


type Vehiculo = {
  id: number;
  tipo: string;
  placa: string;
  conductor: string;
};

type Ruta = {
  id: number;
  nombre: string;
  descripcion: string;
};

// Esquema de validación
const formSchema = z.object({
  centrosLogistico: z.string({
    required_error: "Por favor seleccione un centro logístico.",
  }),
  ruta: z.string({
    required_error: "Por favor seleccione una ruta.",
  }),
  vehiculo: z.string({
    required_error: "Por favor seleccione un vehículo.",
  }),
})

export function AsignarRutaPage() {
  const { toast } = useToast()
  const [paquetes, setPaquetes] = useState<Shipment[]>([])
  const [selectedCentro, setSelectedCentro] = useState("")
  const [selectedPaquetes, setSelectedPaquetes] = useState<string[]>([])
  const [filteredPaquetes, setFilteredPaquetes] = useState<Shipment[]>(paquetes)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [centrosLogisticos, setCentrosLogisticos] = useState<{ node_id: string; name: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCentros();
      form.setValue("centrosLogistico", data[0]?.name || "")
      setCentrosLogisticos(data);
    };
    fetchData();
  }, [])

  const handleCentroChange = (value: string) => {
    setSelectedCentro(value)
    const centroSeleccionado = centrosLogisticos.find(c => c.name === value);

    if (centroSeleccionado) {
      const nodeId = centroSeleccionado.node_id;
      fetchVehiculos(nodeId).then(data => {
        setVehiculos(data);
      });
      fetchRutas(nodeId).then(data => {
        setRutas(data);
      });
    }
  }

  // Inicializar formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      centrosLogistico: "",
      ruta: "",
      vehiculo: "",
    },
  })

  // Filtrar paquetes cuando cambia el término de búsqueda
  useEffect(() => {
    async function cargarShipmentsPendientes() {
      try {
        const allShipments = await fetchShipments();
        const filtered = allShipments.filter(
          (paquete: Shipment) =>
            paquete.shipment_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            paquete.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (paquete.destination && paquete.destination.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        setFilteredPaquetes(filtered)
      } catch (error) {
        console.error('Error cargando shipments pendientes:', error);
        return [];
      }
    }



    cargarShipmentsPendientes();
  }, [searchTerm, paquetes])

  const handleSelectPaquete = (id: string) => {
    setSelectedPaquetes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  // Seleccionar todos los paquetes
  const handleSelectAll = () => {
    if (selectedPaquetes.length === filteredPaquetes.length) {
      setSelectedPaquetes([])
    } else {
      setSelectedPaquetes(filteredPaquetes.map((p) => p.shipment_id.toString()))
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
      setPaquetes(() => filteredPaquetes.filter((p) => !selectedPaquetes.includes(p.shipment_id.toString())))
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="centrosLogistico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centro Logístico</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value) // actualiza el valor del formulario
                            handleCentroChange(value) // tu lógica personalizada
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un centro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {centrosLogisticos.map((centro) => (
                              <SelectItem key={centro.node_id} value={centro.name}>
                                {centro.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          {rutas.map((ruta) => (
                            <SelectItem key={ruta.id} value={ruta.nombre}>
                              {ruta.nombre}
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
                            .filter((v) => v.tipo)
                            .map((vehiculo) => (
                              <SelectItem key={vehiculo.id} value={vehiculo.placa}>
                                {vehiculo.tipo} - {vehiculo.placa} ({vehiculo.conductor})
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
                      <TableRow key={paquete.shipment_id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPaquetes.includes(paquete.shipment_id.toString())}
                            onCheckedChange={() => handleSelectPaquete(paquete.shipment_id.toString())}
                            aria-label={`Seleccionar paquete ${paquete.shipment_id}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{paquete.shipment_id}</TableCell>
                        <TableCell>{paquete.cedula}</TableCell>
                        <TableCell className="hidden md:table-cell">{paquete.destination}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {paquete.created_at}
                        </TableCell>
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
