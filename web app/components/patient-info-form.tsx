"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PatientInfo {
  name: string;
  age: string;
  gender: string;
}

interface PatientInfoFormProps {
  patientInfo: PatientInfo;
  onPatientInfoChange: (info: PatientInfo) => void;
  onSubmit: () => void;
  onReset?: () => void;
  isAnalyzing: boolean;
  hasImage: boolean;
}

export function PatientInfoForm({
  patientInfo,
  onPatientInfoChange,
  onSubmit,
  onReset,
  isAnalyzing,
  hasImage,
}: PatientInfoFormProps) {
  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    onPatientInfoChange({
      ...patientInfo,
      [field]: value,
    });
  };

  const isFormValid =
    patientInfo.name.trim() &&
    patientInfo.age.trim() &&
    patientInfo.gender &&
    hasImage;

  return (
    <div>
      <Card className=" py-8 ">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Enter patient's full name"
                value={patientInfo.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientAge">Age</Label>
              <Input
                id="patientAge"
                type="number"
                placeholder="Enter patient's age"
                value={patientInfo.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                min="0"
                max="150"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patientGender">Gender</Label>
            <Select
              value={patientInfo.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient's gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-8 py-6 items-center justify-center">
        <Button onClick={onReset} variant="outline" className="flex-1">
          Upload Different Image
        </Button>
        <Button
          onClick={onSubmit}
          className="w-full bg-teal-600 hover:bg-teal-700 flex-1"
          disabled={!isFormValid || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin mr-2">⭘</span>
              Analyzing Patient Image...
            </>
          ) : (
            "Analyze Patient Image"
          )}
        </Button>
      </div>
    </div>
  );
}
