"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar, History, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getScanHistory } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { getImageUrl } from "@/lib/utils";
import { DateRangePicker } from "@/components/date-range-picker";

interface ScanHistoryProps {
  initialScans?: any[];
}

export function ScanHistory({ initialScans = [] }: ScanHistoryProps) {
  const { toast } = useToast();
  const [scans, setScans] = useState(initialScans);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("risk-confidence");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchScans();
  }, [page, riskFilter, sortOrder, dateRange]);

  const fetchScans = async () => {
    try {
      setLoading(true);

      // In a real app, these filters would be passed to the API
      // For now, we'll simulate filtering on the client side
      const { scans: allScans } = await getScanHistory();

      // Apply filters
      let filteredScans = [...allScans];

      // Risk level filter
      if (riskFilter !== "all") {
        filteredScans = filteredScans.filter(
          (scan) => scan.result.riskLevel === riskFilter
        );
      }

      // Date range filter
      if (dateRange.from) {
        filteredScans = filteredScans.filter((scan) => {
          const scanDate = new Date(scan.createdAt);
          return scanDate >= dateRange.from!;
        });
      }

      if (dateRange.to) {
        filteredScans = filteredScans.filter((scan) => {
          const scanDate = new Date(scan.createdAt);
          return scanDate <= dateRange.to!;
        });
      }

      // Search query (simple implementation)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredScans = filteredScans.filter(
          (scan) =>
            scan.result.prediction.toLowerCase().includes(query) ||
            scan.result.details?.toLowerCase().includes(query) ||
            (scan.patient?.name || scan.patientName || "")
              .toLowerCase()
              .includes(query) ||
            scan.notes?.toLowerCase().includes(query)
        );
      }

      // Sort - prioritize by risk level and confidence
      filteredScans.sort((a, b) => {
        switch (sortOrder) {
          case "risk-confidence":
            // First sort by risk level (high risk first)
            if (a.result.riskLevel !== b.result.riskLevel) {
              return a.result.riskLevel === "high" ? -1 : 1;
            }
            // Then by confidence (higher confidence first)
            return b.result.confidence - a.result.confidence;

          case "confidence-desc":
            return b.result.confidence - a.result.confidence;

          case "confidence-asc":
            return a.result.confidence - b.result.confidence;

          case "newest":
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;

          case "oldest":
            const dateA2 = new Date(a.createdAt).getTime();
            const dateB2 = new Date(b.createdAt).getTime();
            return dateA2 - dateB2;

          default:
            return 0;
        }
      });

      // Calculate pagination
      const total = Math.ceil(filteredScans.length / itemsPerPage);
      setTotalPages(total || 1);

      // Adjust page if it's out of bounds after filtering
      const adjustedPage = page > total ? 1 : page;
      if (page !== adjustedPage) {
        setPage(adjustedPage);
      }

      // Paginate
      const start = (adjustedPage - 1) * itemsPerPage;
      const paginatedScans = filteredScans.slice(start, start + itemsPerPage);

      setScans(paginatedScans);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchScans();
  };

  const clearFilters = () => {
    setRiskFilter("all");
    setSortOrder("risk-confidence");
    setDateRange({ from: undefined, to: undefined });
    setSearchQuery("");
    setPage(1);
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

  const getResultText = (scan: any) => {
    if (scan.result.riskLevel === "high") {
      return "High Risk (Potential Melanoma)";
    } else {
      return "Low Risk (Benign)";
    }
  };

  if (loading && scans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p>Loading scan history...</p>
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <History className="mx-auto h-12 w-12 opacity-50 mb-4" />
        <h3 className="text-lg font-medium mb-2">No patient records found</h3>
        <p>
          Patient records will appear here after you perform clinical analyses.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patient records..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showFilters && (
        <Card className="border-dashed">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk (Melanoma)</SelectItem>
                    <SelectItem value="low">Low Risk (Benign)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="risk-confidence">
                      Risk Level & Confidence
                    </SelectItem>
                    <SelectItem value="confidence-desc">
                      Highest Confidence
                    </SelectItem>
                    <SelectItem value="confidence-asc">
                      Lowest Confidence
                    </SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <DateRangePicker date={dateRange} onDateChange={setDateRange} />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {scans.map((scan, index) => (
          <div
            key={scan._id}
            className="flex flex-col sm:flex-row border rounded-lg p-4 gap-4"
          >
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-md border">
              <Image
                src={getImageUrl(scan.imagePath) || "/placeholder.svg"}
                alt="Scan image"
                fill
                className="object-cover"
                onError={(e) => {
                  console.error(
                    "History image failed to load:",
                    scan.imagePath
                  );
                  // Fallback to placeholder if image fails to load
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Result:</h4>
                  <Badge
                    variant="outline"
                    className={getRiskBadgeColor(scan.result.riskLevel)}
                  >
                    {getResultText(scan)}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    <span>{scan.result.confidence}%</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(scan.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <div className="font-medium">
                  Patient: {scan.patient?.name || scan.patientName || "N/A"}
                </div>
                <div>
                  Age: {scan.patient?.age || scan.patientAge || "N/A"}, Gender:{" "}
                  {scan.patient?.gender || scan.patientGender || "N/A"}
                </div>
                {scan.result.details && (
                  <p className="line-clamp-1 mt-1">{scan.result.details}</p>
                )}
              </div>
              <div className="mt-2">
                <Link href={`/scans/${scan._id}`}>
                  <Button variant="outline" size="sm">
                    View Patient Report
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
