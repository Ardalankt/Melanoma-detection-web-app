"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Info, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";

interface AnalysisResultProps {
  scan: any;
  onReset: () => void;
}

export function AnalysisResult({ scan, onReset }: AnalysisResultProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Get the prediction text directly from the API response
  const result = scan.result.prediction;
  const resultText =
    result === "Melanoma"
      ? "High Risk (Potential Melanoma)"
      : "Low Risk (Benign)";
  const isHighRisk = scan.result.riskLevel === "high";

  return (
    <div className="space-y-6">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Patient Information</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Name:</span> {scan.patient.name}
          </div>
          <div>
            <span className="text-gray-500">Age:</span> {scan.patient.age}
          </div>
          <div>
            <span className="text-gray-500">Gender:</span> {scan.patient.gender}
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex justify-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-lg border">
            <Image
              src={getImageUrl(scan.imagePath) || "/placeholder.svg"}
              alt="Analyzed skin image"
              fill
              className="object-cover"
              onError={(e) => {
                console.error("Image failed to load:", scan.imagePath);
                // Fallback to placeholder if image fails to load
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-medium">Analysis Result:</h3>
              <span
                className={`text-xl font-bold ${getRiskColor(scan.result.riskLevel)}`}
              >
                {resultText}
              </span>
            </div>

            <div className="text-sm">
              <span className="text-gray-500">Confidence:</span>
              <span className="ml-2 font-medium">
                {scan.result.confidence}%
              </span>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This is a preliminary assessment only. Please consult with a
                dermatologist for a proper diagnosis of any skin condition.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Clinical Recommendations</h3>
        <ul className="space-y-2">
          {scan.recommendations.map((recommendation: string, index: number) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <span className="text-sm">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onReset} variant="outline">
          Analyze Another Patient
        </Button>
        <Link href={`/scans/${scan._id}`}>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Download className="mr-2 h-4 w-4" />
            View Full Report
          </Button>
        </Link>
      </div>
    </div>
  );
}
