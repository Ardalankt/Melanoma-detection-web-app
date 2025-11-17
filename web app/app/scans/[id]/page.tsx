"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getScanById, deleteScan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import { ArrowLeft, Calendar, CheckCircle2, Info, Trash2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

export default function ScanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchScan = async () => {
      try {
        setLoading(true);
        const { scan } = await getScanById(id as string);
        setScan(scan);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to load scan details",
          variant: "destructive",
        });
        router.push("/dashboard?tab=history");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      fetchScan();
    }
  }, [id, isAuthenticated, authLoading, router, toast]);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this patient record? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await deleteScan(id as string);
      toast({
        title: "Success",
        description: "Patient record deleted successfully",
      });
      router.push("/dashboard?tab=history");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete scan",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="gap-1" disabled>
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-64 w-64 rounded-lg" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!scan) {
    return null;
  }

  const scanDate = new Date(scan.createdAt);
  const formattedDate = scanDate.toLocaleDateString();
  const formattedTime = scanDate.toLocaleTimeString();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <Link href="/dashboard?tab=history">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                Patient Analysis Report
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>
                    {formattedDate} at {formattedTime}
                  </span>
                </div>
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={getRiskBadgeColor(scan.result.riskLevel)}
            >
              {scan.result.prediction}
            </Badge>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium">Patient Information</h3>
            <div className="text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 font-medium">{scan.patient.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Age:</span>
                <span className="ml-2 font-medium">{scan.patient.age}</span>
              </div>
              <div>
                <span className="text-gray-500">Gender:</span>
                <span className="ml-2 font-medium">{scan.patient.gender}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative h-64 w-64 overflow-hidden rounded-lg border">
              <Image
                src={getImageUrl(scan.imagePath) || "/placeholder.svg"}
                alt="Analyzed skin image"
                fill
                className="object-cover"
                onError={(e) => {
                  console.error("Detail image failed to load:", scan.imagePath);
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-lg font-medium mb-1">Analysis Details</h3>
                <div className="text-sm">
                  <div>
                    <span className="text-gray-500">Result:</span>
                    <span className="ml-2 font-medium">
                      {scan.result.prediction}
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-500">Confidence:</span>
                    <span className="ml-2 font-medium">
                      {scan.result.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This is a preliminary assessment only. Please consult with a
                  dermatologist for a proper diagnosis of any skin condition.
                </AlertDescription>
              </Alert>

              {scan.result.details && (
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Additional Details:
                  </h4>
                  <p className="text-sm text-gray-600">{scan.result.details}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Clinical Recommendations</h3>
            <ul className="space-y-2">
              {scan.recommendations.map(
                (recommendation: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{recommendation}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {scan.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Notes</h3>
              <p className="text-sm text-gray-600">{scan.notes}</p>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={() => window.print()}>
              Print Patient Report
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleting ? "Deleting..." : "Delete Patient Record"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
