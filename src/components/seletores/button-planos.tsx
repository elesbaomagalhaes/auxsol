"use client"

import { useState } from "react"
import { ClipboardList, HourglassIcon } from "lucide-react"

type EmploymentType = "int" | "tec"

export function EmploymentTypeSelector() {
  const [selectedType, setSelectedType] = useState<EmploymentType>("int")

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-medium text-gray-700 mb-4">Escolha seu plano</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
        <button
          onClick={() => setSelectedType("int")}
          className={`flex items-center p-4 rounded-lg border ${
            selectedType === "int" ? "border-gray-500 bg-gray-50" : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <ClipboardList
              className={`mr-3 h-5 w-5 ${selectedType === "int" ? "text-gray-600" : "text-gray-500"}`}
            />
            <span className={`text-lg ${selectedType === "int" ? "text-green-600" : "text-gray-700"}`}>
              Integrador
            </span>
          </div>
          <div
            className={`h-5 w-5 rounded-full border ${
              selectedType === "int" ? "border-green-600 bg-green-600" : "border-gray-300"
            }`}
          >
            {selectedType === "int" && (
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => setSelectedType("tec")}
          className={`flex items-center p-4 rounded-lg border ${
            selectedType === "tec" ? "border-gray-500 bg-gray-50" : "border-green-200 bg-white hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center flex-1">
            <HourglassIcon
              className={`mr-3 h-5 w-5 ${selectedType === "tec" ? "text-gray-600" : "text-gray-500"}`}
            />
            <span className={`text-lg ${selectedType === "tec" ? "text-green-600" : "text-gray-700"}`}>
              Técnico
            </span>
          </div>
          
          <div
            className={`h-5 w-5 rounded-full border ${
              selectedType === "tec" ? "border-green-600 bg-green-600" : "border-gray-300"
            }`}
          >
            {selectedType === "tec" && (
              <div className="h-full w-full flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
