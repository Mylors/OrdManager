"use client"

import { Star, Clock, Check, Edit, Trash2, User, Calendar } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

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

interface OrdersListProps {
  orders: Order[]
  onToggleStatus: (id: string) => void
  onEdit: (order: Order) => void
  onDelete: (id: string) => void
  getPriorityColor: (priority: string) => string
  getPriorityEmoji: (priority: string) => string
  formatDate: (date: string) => string
  formatTime: (time: string) => string
  isOverdue: (date: string, time: string, status: string) => boolean
  emptyMessage: string
  emptyDescription: string
}

export default function OrdersList({
  orders,
  onToggleStatus,
  onEdit,
  onDelete,
  getPriorityColor,
  getPriorityEmoji,
  formatDate,
  formatTime,
  isOverdue,
  emptyMessage,
  emptyDescription,
}: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-12 h-12 text-pink-500 dark:text-pink-300" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500 dark:text-gray-400">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order, index) => {
        const overdue = isOverdue(order.deliveryDate, order.deliveryTime, order.status)
        return (
          <Card
            key={order.id}
            className={`group hover:scale-105 transition-all duration-300 hover:shadow-lg ${
              order.status === "completed"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : overdue
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : "bg-white dark:bg-gray-800 border-pink-200 dark:border-pink-800"
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "fadeInUp 0.5s ease-out forwards",
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle
                  className={`text-lg font-bold ${
                    order.status === "completed"
                      ? "text-green-700 dark:text-green-300 line-through"
                      : overdue
                        ? "text-red-700 dark:text-red-300"
                        : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {order.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Badge className={`${getPriorityColor(order.priority)} text-xs`}>
                    {getPriorityEmoji(order.priority)}
                  </Badge>
                  {overdue && order.status === "pending" && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">⚠️</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.description && (
                <p
                  className={`text-sm ${
                    order.status === "completed"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {order.description}
                </p>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{order.customerName}</span>
                </div>

                {order.deliveryDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600 dark:text-gray-400">{formatDate(order.deliveryDate)}</span>
                  </div>
                )}

                {order.deliveryTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600 dark:text-gray-400">{formatTime(order.deliveryTime)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={order.status === "completed" ? "secondary" : "default"}
                    onClick={() => onToggleStatus(order.id)}
                    className={`${
                      order.status === "completed"
                        ? "bg-yellow-200 hover:bg-yellow-300 text-yellow-800 dark:bg-yellow-800 dark:hover:bg-yellow-700 dark:text-yellow-200"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    } transition-all duration-300`}
                  >
                    {order.status === "completed" ? (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        Pendiente
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Completar
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(order)}
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30 transition-all duration-300"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(order.id)}
                    className="bg-red-400 hover:bg-red-500 transition-all duration-300"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
