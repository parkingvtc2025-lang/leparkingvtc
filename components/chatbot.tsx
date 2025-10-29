"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isStickyNavVisible, setIsStickyNavVisible] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour! Bienvenue chez Le Parking VTC. Comment puis-je vous aider?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      setIsStickyNavVisible(window.scrollY > window.innerHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const botResponses: { [key: string]: string } = {
        prix: "Nos tarifs varient selon le véhicule et la durée de location. Contactez-nous pour un devis personnalisé!",
        reservation: "Vous pouvez réserver directement via notre site ou nous appeler au +33 6 12 34 56 78",
        vehicule: "Nous proposons une large gamme de véhicules premium pour vos besoins VTC.",
        livraison: "Nous livrons dans toute la région. Quel est votre lieu de destination?",
        default:
          "Merci pour votre question! Pour plus d'informations, veuillez nous contacter directement ou consulter notre site.",
      }

      let response = botResponses.default
      const lowerInput = input.toLowerCase()

      if (lowerInput.includes("prix") || lowerInput.includes("tarif")) {
        response = botResponses.prix
      } else if (lowerInput.includes("reservation") || lowerInput.includes("réserver")) {
        response = botResponses.reservation
      } else if (lowerInput.includes("vehicule") || lowerInput.includes("voiture")) {
        response = botResponses.vehicule
      } else if (lowerInput.includes("livraison") || lowerInput.includes("livrer")) {
        response = botResponses.livraison
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 500)
  }

  return (
    <>
      {/* Chatbot Button - Positioned bottom-right, lower position, hidden when sticky nav visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-32 right-6 z-40 p-3 sm:p-4 bg-foreground text-background rounded-full shadow-lg hover:scale-110 transition-all duration-500 animate-pulse ${
          isStickyNavVisible ? "opacity-0 translate-y-20 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
        aria-label="Open chatbot"
      >
        {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed bottom-48 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-96 bg-background border border-border/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-500 ${
            isStickyNavVisible ? "opacity-0 translate-y-20 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          {/* Header */}
          <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm sm:text-base">Le Parking VTC</h3>
              <p className="text-xs opacity-80">En ligne</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.sender === "user"
                      ? "bg-foreground text-background rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-foreground rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-border/20 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 px-3 py-2 bg-secondary rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
