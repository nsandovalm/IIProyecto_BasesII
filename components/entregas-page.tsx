"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { paquetes as paquetesData } from "@/lib/data"
import { Camera, CheckCircle, QrCode, Truck, XCircle } from "lucide-react"

// Esquema de validación para el formulario de entrega
const entregaFormSchema = z.object({
  estado: z.enum(["entregado", "fallido"], {
    required_error: "Por favor seleccione el estado de la entrega.",
  }),
  notasEntrega: z.string().optional(),
})

// Esquema de validación para el formulario de validación QR
const qrFormSchema = z.object({
  idEnvio: z.string().min(1, {
    message: "Por favor ingrese un ID de envío.",
  }),
})

export function EntregasPage() {
  const { toast } = useToast()
  const [paquetes, setPaquetes] = useState(paquetesData.filter((p) => p.estado === "en_transito"))
  const [selectedPaquete, setSelectedPaquete] = useState<(typeof paquetesData)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("en-transito")

  // Formulario para registrar entrega
  const entregaForm = useForm<z.infer<typeof entregaFormSchema>>({
    resolver: zodResolver(entregaFormSchema),
    defaultValues: {
      estado: "entregado",
      notasEntrega: "",
    },
  })

  // Formulario para validar QR
  const qrForm = useForm<z.infer<typeof qrFormSchema>>({
    resolver: zodResolver(qrFormSchema),
    defaultValues: {
      idEnvio: "",
    },
  })

  // Función para abrir el diálogo de entrega
  const handleOpenEntregaDialog = (paquete: (typeof paquetesData)[0]) => {
    setSelectedPaquete(paquete)
    setIsDialogOpen(true)
    entregaForm.reset({
      estado: "entregado",
      notasEntrega: "",
    })
  }

  // Función para validar QR
  const onValidateQR = (values: z.infer<typeof qrFormSchema>) => {
    setIsSubmitting(true)

    // Simular validación
    setTimeout(() => {
      const paquete = paquetes.find((p) => p.idEnvio === values.idEnvio)

      if (paquete) {
        setSelectedPaquete(paquete)
        setIsDialogOpen(true)
        entregaForm.reset({
          estado: "entregado",
          notasEntrega: "",
        })
        qrForm.reset()
        toast({
          title: "Paquete encontrado",
          description: `Se ha encontrado el paquete ${paquete.idEnvio}.`,
        })
      } else {
        toast({
          title: "Paquete no encontrado",
          description: "No se encontró ningún paquete con ese ID.",
          variant: "destructive",
        })
      }

      setIsSubmitting(false)
    }, 1000)
  }

  // Función para registrar entrega
  const onSubmitEntrega = (values: z.infer<typeof entregaFormSchema>) => {
    if (!selectedPaquete) return

    setIsSubmitting(true)

    // Simular envío a API
    setTimeout(() => {
      console.log({
        paqueteId: selectedPaquete.id,
        ...values,
        fechaEntrega: new Date().toISOString(),
      })

      // Actualizar estado local
      setPaquetes((prev) => prev.filter((p) => p.id !== selectedPaquete.id))

      setIsSubmitting(false)
      setIsDialogOpen(false)

      toast({
        title: values.estado === "entregado" ? "Entrega registrada" : "Entrega fallida registrada",
        description: `El paquete ${selectedPaquete.idEnvio} ha sido marcado como ${values.estado === "entregado" ? "entregado" : "fallido"}.`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Entregas</h1>
        <p className="text-muted-foreground">Valide y registre el estado de las entregas</p>
      </div>

      <Tabs defaultValue="en-transito" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en-transito">Paquetes en Tránsito</TabsTrigger>
          <TabsTrigger value="validar-qr">Validar QR</TabsTrigger>
        </TabsList>

        <TabsContent value="en-transito" className="space-y-4 pt-4">
          {paquetes.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground">No hay paquetes en tránsito</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paquetes.map((paquete) => (
                <Card key={paquete.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {paquete.idEnvio}
                    </CardTitle>
                    <CardDescription>{new Date(paquete.fecha).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{paquete.nombreCliente}</p>
                      <p className="text-sm text-muted-foreground">{paquete.direccionDestino}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>Peso: {paquete.peso} kg</span>
                        <span>Ruta: {paquete.rutaAsignada}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleOpenEntregaDialog(paquete)}>
                      Registrar Entrega
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="validar-qr" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Validar Paquete por QR</CardTitle>
              <CardDescription>Escanee el código QR o ingrese el ID del envío manualmente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg border-dashed">
                <QrCode className="h-12 w-12 mb-4 text-muted-foreground" />
                <Button variant="outline" className="mb-2">
                  <Camera className="mr-2 h-4 w-4" />
                  Escanear QR
                </Button>
                <p className="text-sm text-muted-foreground">O ingrese el ID manualmente</p>
              </div>

              <Form {...qrForm}>
                <form onSubmit={qrForm.handleSubmit(onValidateQR)} className="space-y-4">
                  <FormField
                    control={qrForm.control}
                    name="idEnvio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ID de Envío</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: ENV-001-2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Validando..." : "Validar Paquete"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para registrar entrega */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Entrega</DialogTitle>
            <DialogDescription>
              {selectedPaquete && `Paquete: ${selectedPaquete.idEnvio} - ${selectedPaquete.nombreCliente}`}
            </DialogDescription>
          </DialogHeader>

          <Form {...entregaForm}>
            <form onSubmit={entregaForm.handleSubmit(onSubmitEntrega)} className="space-y-4">
              <FormField
                control={entregaForm.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado de la Entrega</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entregado">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Entregado</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fallido">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Fallido</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={entregaForm.control}
                name="notasEntrega"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Entrega</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalles adicionales sobre la entrega"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Evidencia de Entrega</h3>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg border-dashed">
                  <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                  <Button variant="outline" type="button" size="sm">
                    Adjuntar Imagen
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Foto o firma del destinatario</p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
