"use client"

import { useState, useEffect } from "react"
import { Plus, Heart, Moon, Sun, Check, Clock, Timer, Package } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import OrdersList from "./OrdersList"
import "../styles/global.css"

interface Order {
  id: string
  title: string
  description: string
  customerName: string
  deliveryDate: string
  deliveryTime: string
  status: "pending" | "completed"
  createdAt: string
  priority: "low" | "medium" | "high"
}

export default function KawaiiOrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    customerName: "",
    deliveryDate: "",
    deliveryTime: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  // Simular localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("kawaii-orders-manager")
      const savedDarkMode = localStorage.getItem("kawaii-dark-mode")

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders))
      } else {
        // Datos de ejemplo
        const exampleOrders: Order[] = [
          {
            id: "1",
            title: "Pastel de unicornio 🦄",
            description: "Pastel de vainilla con decoración de unicornio en colores pastel, 3 pisos",
            customerName: "María González",
            deliveryDate: "2024-01-20",
            deliveryTime: "15:30",
            status: "pending",
            createdAt: new Date().toISOString(),
            priority: "high",
          },
          {
            id: "2",
            title: "Cupcakes kawaii 🧁",
            description: "12 cupcakes con caritas adorables y colores pastel",
            customerName: "Ana Rodríguez",
            deliveryDate: "2024-01-18",
            deliveryTime: "10:00",
            status: "completed",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            priority: "medium",
          },
          {
            id: "3",
            title: "Galletas decoradas 🍪",
            description: "24 galletas con diseños de animalitos kawaii",
            customerName: "Carlos López",
            deliveryDate: "2024-01-22",
            deliveryTime: "14:00",
            status: "pending",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            priority: "low",
          },
        ]
        setOrders(exampleOrders)
        localStorage.setItem("kawaii-orders-manager", JSON.stringify(exampleOrders))
      }

      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kawaii-orders-manager", JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kawaii-dark-mode", JSON.stringify(darkMode))
      if (darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [darkMode])

  const resetForm = () => {
    setNewOrder({
      title: "",
      description: "",
      customerName: "",
      deliveryDate: "",
      deliveryTime: "",
      priority: "medium",
    })
    setEditingOrder(null)
  }

  const addOrder = () => {
    if (!newOrder.title.trim() || !newOrder.customerName.trim()) return

    const order: Order = {
      id: editingOrder ? editingOrder.id : Date.now().toString(),
      title: newOrder.title,
      description: newOrder.description,
      customerName: newOrder.customerName,
      deliveryDate: newOrder.deliveryDate,
      deliveryTime: newOrder.deliveryTime,
      status: editingOrder ? editingOrder.status : "pending",
      createdAt: editingOrder ? editingOrder.createdAt : new Date().toISOString(),
      priority: newOrder.priority,
    }

    if (editingOrder) {
      setOrders((prev) => prev.map((o) => (o.id === editingOrder.id ? order : o)))
    } else {
      setOrders((prev) => [order, ...prev])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const editOrder = (order: Order) => {
    setEditingOrder(order)
    setNewOrder({
      title: order.title,
      description: order.description,
      customerName: order.customerName,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime,
      priority: order.priority,
    })
    setIsDialogOpen(true)
  }

  const toggleOrderStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: order.status === "pending" ? "completed" : "pending" } : order,
      ),
    )
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
      case "medium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getPriorityEmoji = (priority: string) => {
    switch (priority) {
      case "high":
        return "🌟"
      case "medium":
        return "💫"
      case "low":
        return "✨"
      default:
        return "💫"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sin fecha"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "Sin hora"
    return timeString
  }

  const isOverdue = (deliveryDate: string, deliveryTime: string, status: string) => {
    if (status === "completed" || !deliveryDate) return false
    const now = new Date()
    const delivery = new Date(`${deliveryDate}T${deliveryTime || "23:59"}`)
    return delivery < now
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const completedOrders = orders.filter((order) => order.status === "completed")

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900"
          : "bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50"
      }`}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-pink-200 dark:border-pink-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center animate-pulse">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Kawaii Orders Manager ✨
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona tus pedidos con amor y ternura</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-purple-500" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 border-pink-200 dark:border-pink-800 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-pink-600 dark:text-pink-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-pink-700 dark:text-pink-300">{orders.length}</p>
                  <p className="text-sm text-pink-600 dark:text-pink-400">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-800 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{pendingOrders.length}</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedOrders.length}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Completados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 border-red-200 dark:border-red-800 hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-200 dark:bg-red-800 rounded-full flex items-center justify-center">
                  <Timer className="w-6 h-6 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {pendingOrders.filter((o) => isOverdue(o.deliveryDate, o.deliveryTime, o.status)).length}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">Atrasados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Sections */}
        <div className="space-y-8">
          {/* Pending Orders */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Pedidos Pendientes ({pendingOrders.length})
              </h2>
            </div>
            <OrdersList
              orders={pendingOrders}
              onToggleStatus={toggleOrderStatus}
              onEdit={editOrder}
              onDelete={deleteOrder}
              getPriorityColor={getPriorityColor}
              getPriorityEmoji={getPriorityEmoji}
              formatDate={formatDate}
              formatTime={formatTime}
              isOverdue={isOverdue}
              emptyMessage="¡No hay pedidos pendientes! 🎉"
              emptyDescription="Todos los pedidos están completados"
            />
          </section>

          {/* Completed Orders */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Pedidos Completados ({completedOrders.length})
              </h2>
            </div>
            <OrdersList
              orders={completedOrders}
              onToggleStatus={toggleOrderStatus}
              onEdit={editOrder}
              onDelete={deleteOrder}
              getPriorityColor={getPriorityColor}
              getPriorityEmoji={getPriorityEmoji}
              formatDate={formatDate}
              formatTime={formatTime}
              isOverdue={isOverdue}
              emptyMessage="Aún no hay pedidos completados ✨"
              emptyDescription="Los pedidos completados aparecerán aquí"
            />
          </section>
        </div>
      </main>

      {/* Floating Action Button */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            resetForm()
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          >
            <Plus className="w-10 h-10" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-pink-200 dark:border-pink-800 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {editingOrder ? "Editar Pedido Kawaii ✏️" : "Nuevo Pedido Kawaii ✨"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Título del pedido *
                </Label>
                <Input
                  id="title"
                  placeholder="Ej: Pastel de unicornio 🦄"
                  value={newOrder.title}
                  onChange={(e) => setNewOrder((prev) => ({ ...prev, title: e.target.value }))}
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe los detalles del pedido... 💕"
                  value={newOrder.description}
                  onChange={(e) => setNewOrder((prev) => ({ ...prev, description: e.target.value }))}
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="customerName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre del cliente *
                </Label>
                <Input
                  id="customerName"
                  placeholder="Ej: María González"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder((prev) => ({ ...prev, customerName: e.target.value }))}
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deliveryDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Fecha de entrega
                  </Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder((prev) => ({ ...prev, deliveryDate: e.target.value }))}
                    className="border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Hora de entrega
                  </Label>
                  <Input
                    id="deliveryTime"
                    type="time"
                    value={newOrder.deliveryTime}
                    onChange={(e) => setNewOrder((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                    className="border-pink-200 dark:border-pink-800 focus:border-pink-400 dark:focus:border-pink-600"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Prioridad</Label>
                <div className="flex gap-2">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <Button
                      key={priority}
                      variant={newOrder.priority === priority ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewOrder((prev) => ({ ...prev, priority }))}
                      className={`${
                        newOrder.priority === priority
                          ? priority === "high"
                            ? "bg-pink-500 hover:bg-pink-600"
                            : priority === "medium"
                              ? "bg-purple-500 hover:bg-purple-600"
                              : "bg-green-500 hover:bg-green-600"
                          : "border-pink-200 dark:border-pink-800"
                      }`}
                    >
                      {getPriorityEmoji(priority)}{" "}
                      {priority === "low" ? "Baja" : priority === "medium" ? "Media" : "Alta"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={addOrder}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                disabled={!newOrder.title.trim() || !newOrder.customerName.trim()}
              >
                <Heart className="w-4 h-4 mr-2" />
                {editingOrder ? "Guardar Cambios" : "Crear Pedido"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-pink-200 dark:border-pink-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
