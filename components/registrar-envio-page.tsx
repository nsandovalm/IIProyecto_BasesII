"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { centrosLogisticos } from "@/lib/data"

// Esquema de validación
const formSchema = z.object({
  idEnvio: z.string().min(5, {
    message: "El ID de envío debe tener al menos 5 caracteres.",
  }),
  nombreCliente: z.string().min(2, {
    message: "El nombre del cliente debe tener al menos 2 caracteres.",
  }),
  direccionDestino: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  peso: z.coerce.number().positive({
    message: "El peso debe ser un número positivo.",
  }),
  centroLogistico: z.string({
    required_error: "Por favor seleccione un centro logístico.",
  }),
})

export function RegistrarEnvioPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Inicializar formulario con react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idEnvio: `ENV-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}-${new Date().getFullYear()}`,
      nombreCliente: "",
      direccionDestino: "",
      peso: 0,
      centroLogistico: "CD-001",
    },
  })

  // Función para manejar el envío del formulario
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simular envío a API
    setTimeout(() => {
      console.log(values)
      setIsSubmitting(false)

      toast({
        title: "Paquete registrado",
        description: `El paquete ${values.idEnvio} ha sido registrado correctamente.`,
      })

      // Resetear formulario y generar nuevo ID
      form.reset({
        idEnvio: `ENV-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}-${new Date().getFullYear()}`,
        nombreCliente: "",
        direccionDestino: "",
        peso: 0,
        centroLogistico: "CD-001",
      })

      // Opcional: redirigir a otra página
      // router.push('/asignar-ruta')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Envío</h1>
        <p className="text-muted-foreground">Complete el formulario para registrar un nuevo paquete en el sistema</p>
      </div>

      <div className="border rounded-lg p-4 md:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="idEnvio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de Envío</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormDescription>ID generado automáticamente</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="centroLogistico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Centro Logístico</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un centro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centrosLogisticos.map((centro) => (
                          <SelectItem key={centro.id} value={centro.id}>
                            {centro.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Centro desde donde se enviará el paquete</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombreCliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="direccionDestino"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Dirección de Destino</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dirección completa de entrega" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registrando..." : "Registrar Paquete"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
