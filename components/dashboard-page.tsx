"use client"

import { useState, useEffect } from "react"
import { Package, Truck, CheckSquare, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { paquetes } from "@/lib/data"
import Link from "next/link"

export function DashboardPage() {
  const [stats, setStats] = useState({
    pendientes: 0,
    enTransito: 0,
    entregados: 0,
    fallidos: 0,
  })

  const [recentPackages, setRecentPackages] = useState(paquetes.slice(0, 5))

  useEffect(() => {
    // Calcular estadísticas
    const pendientes = paquetes.filter((p) => p.estado === "pendiente").length
    const enTransito = paquetes.filter((p) => p.estado === "en_transito").length
    const entregados = paquetes.filter((p) => p.estado === "entregado").length
    const fallidos = paquetes.filter((p) => p.estado === "fallido").length

    setStats({
      pendientes,
      enTransito,
      entregados,
      fallidos,
    })

    // Ordenar paquetes por fecha (más recientes primero)
    const sorted = [...paquetes].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 5)

    setRecentPackages(sorted)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
        <p className="text-muted-foreground">Resumen de operaciones de mensajería y logística</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paquetes Pendientes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendientes}</div>
            <p className="text-xs text-muted-foreground">Paquetes por asignar</p>
          </CardContent>
          <CardFooter>
            <Link href="/registrar-envio" className="w-full">
              <Button variant="outline" className="w-full">
                Registrar nuevo
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enTransito}</div>
            <p className="text-xs text-muted-foreground">Paquetes en ruta</p>
          </CardContent>
          <CardFooter>
            <Link href="/entregas" className="w-full">
              <Button variant="outline" className="w-full">
                Ver entregas
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregados</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.entregados}</div>
            <p className="text-xs text-muted-foreground">Entregas exitosas</p>
          </CardContent>
          <CardFooter>
            <Link href="/historial" className="w-full">
              <Button variant="outline" className="w-full">
                Ver historial
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fallidos}</div>
            <p className="text-xs text-muted-foreground">Entregas fallidas</p>
          </CardContent>
          <CardFooter>
            <Link href="/historial?estado=fallido" className="w-full">
              <Button variant="outline" className="w-full">
                Ver detalles
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Packages */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Envíos Recientes</h2>
        <div className="rounded-md border">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-medium">
              <div>ID Envío</div>
              <div>Cliente</div>
              <div>Fecha</div>
              <div>Estado</div>
              <div></div>
            </div>
          </div>
          <div className="divide-y">
            {recentPackages.map((paquete) => (
              <div key={paquete.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="font-medium">{paquete.idEnvio}</div>
                  <div>{paquete.nombreCliente}</div>
                  <div>{new Date(paquete.fecha).toLocaleDateString()}</div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        paquete.estado === "pendiente"
                          ? "bg-yellow-100 text-yellow-800"
                          : paquete.estado === "en_transito"
                            ? "bg-blue-100 text-blue-800"
                            : paquete.estado === "entregado"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {paquete.estado === "pendiente"
                        ? "Pendiente"
                        : paquete.estado === "en_transito"
                          ? "En tránsito"
                          : paquete.estado === "entregado"
                            ? "Entregado"
                            : "Fallido"}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/historial?id=${paquete.id}`}>
                        <span>Detalles</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
