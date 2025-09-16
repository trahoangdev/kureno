"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Loader2, Plus, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock payment methods (in a real app, this would come from an API)
const mockPaymentMethods = [
  {
    id: "1",
    type: "credit_card",
    cardBrand: "Visa",
    lastFour: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    isDefault: true,
  },
  {
    id: "2",
    type: "credit_card",
    cardBrand: "Mastercard",
    lastFour: "5555",
    expiryMonth: "08",
    expiryYear: "2024",
    isDefault: false,
  },
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [defaultPaymentId, setDefaultPaymentId] = useState(
    mockPaymentMethods.find((method) => method.isDefault)?.id || "",
  )
  const { toast } = useToast()

  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvc: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleDefaultChange = (value: string) => {
    setDefaultPaymentId(value)
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === value,
      })),
    )
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    })
  }

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      // Extract expiry month and year from MM/YY format
      const [expiryMonth, expiryYear] = newCardDetails.expiryDate.split("/")

      const newCard = {
        id: `new-${Date.now()}`,
        type: "credit_card",
        cardBrand: getCardBrand(newCardDetails.cardNumber),
        lastFour: newCardDetails.cardNumber.slice(-4),
        expiryMonth,
        expiryYear: `20${expiryYear}`,
        isDefault: paymentMethods.length === 0,
      }

      setPaymentMethods((prev) => [...prev, newCard])
      if (paymentMethods.length === 0) {
        setDefaultPaymentId(newCard.id)
      }

      setNewCardDetails({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvc: "",
      })

      setIsProcessing(false)
      setIsAddingCard(false)

      toast({
        title: "Card added successfully",
        description: "Your new payment method has been added.",
      })
    }, 1500)
  }

  const handleRemoveCard = (id: string) => {
    setPaymentMethods((prev) => {
      const updatedMethods = prev.filter((method) => method.id !== id)

      // If we removed the default method, set a new default
      if (id === defaultPaymentId && updatedMethods.length > 0) {
        updatedMethods[0].isDefault = true
        setDefaultPaymentId(updatedMethods[0].id)
      }

      return updatedMethods
    })

    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    })
  }

  // Helper function to determine card brand from number
  const getCardBrand = (cardNumber: string): string => {
    const firstDigit = cardNumber.charAt(0)
    if (firstDigit === "4") return "Visa"
    if (firstDigit === "5") return "Mastercard"
    if (firstDigit === "3") return "American Express"
    if (firstDigit === "6") return "Discover"
    return "Credit Card"
  }

  // Helper function to format card number with spaces
  const formatCardNumber = (value: string): string => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
  }

  // Helper function to format expiry date as MM/YY
  const formatExpiryDate = (value: string): string => {
    value = value.replace(/\D/g, "")
    if (value.length > 2) {
      return `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods for future purchases</CardDescription>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="py-8 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No payment methods</h3>
            <p className="mt-1 text-muted-foreground">You haven't added any payment methods to your account yet.</p>
            <Button className="mt-4" onClick={() => setIsAddingCard(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <>
            <RadioGroup value={defaultPaymentId} onValueChange={handleDefaultChange} className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center cursor-pointer">
                      <div className="ml-2">
                        <p className="font-medium">
                          {method.cardBrand} •••• {method.lastFour}
                          {method.isDefault && <span className="ml-2 text-xs text-muted-foreground">(Default)</span>}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth}/{method.expiryYear.slice(-2)}
                        </p>
                      </div>
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCard(method.id)}
                    disabled={paymentMethods.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove card</span>
                  </Button>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-6">
              <Button onClick={() => setIsAddingCard(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Card
              </Button>
            </div>
          </>
        )}

        <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Enter your card details to add a new payment method</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCard}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    name="cardholderName"
                    placeholder="John Doe"
                    value={newCardDetails.cardholderName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCardDetails.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value)
                      setNewCardDetails((prev) => ({ ...prev, cardNumber: formatted }))
                    }}
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={newCardDetails.expiryDate}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value)
                        setNewCardDetails((prev) => ({ ...prev, expiryDate: formatted }))
                      }}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      value={newCardDetails.cvc}
                      onChange={handleInputChange}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddingCard(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Add Card"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
