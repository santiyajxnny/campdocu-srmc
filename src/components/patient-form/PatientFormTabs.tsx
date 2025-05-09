
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DemographicsForm from "./DemographicsForm";
import HistoryForm from "./HistoryForm";
import VisionForm from "./VisionForm";
import RefractionForm from "./RefractionForm";
import DiagnosisForm from "./DiagnosisForm";
import OutcomeForm from "./OutcomeForm";
import { Control, UseFormWatch } from "react-hook-form";
import { PatientFormValues } from "./schemas";

interface PatientFormTabsProps {
  control: Control<PatientFormValues>;
  watch: UseFormWatch<PatientFormValues>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  completedTabs: string[];
}

const PatientFormTabs: React.FC<PatientFormTabsProps> = ({ 
  control, 
  watch,
  activeTab, 
  setActiveTab, 
  completedTabs 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
        <TabsTrigger 
          value="demographics" 
          className={completedTabs.includes("demographics") ? "border-b-2 border-green-500" : ""}
        >
          Demographics
        </TabsTrigger>
        <TabsTrigger 
          value="history" 
          className={completedTabs.includes("history") ? "border-b-2 border-green-500" : ""}
        >
          History
        </TabsTrigger>
        <TabsTrigger 
          value="vision" 
          className={completedTabs.includes("vision") ? "border-b-2 border-green-500" : ""}
        >
          Vision
        </TabsTrigger>
        <TabsTrigger 
          value="refraction" 
          className={completedTabs.includes("refraction") ? "border-b-2 border-green-500" : ""}
        >
          Refraction
        </TabsTrigger>
        <TabsTrigger 
          value="diagnosis" 
          className={completedTabs.includes("diagnosis") ? "border-b-2 border-green-500" : ""}
        >
          Diagnosis
        </TabsTrigger>
        <TabsTrigger 
          value="outcome" 
          className={completedTabs.includes("outcome") ? "border-b-2 border-green-500" : ""}
        >
          Outcome
        </TabsTrigger>
      </TabsList>
      
      {/* Demographics Tab */}
      <TabsContent value="demographics">
        <DemographicsForm control={control} />
      </TabsContent>

      {/* History Tab */}
      <TabsContent value="history">
        <HistoryForm control={control} />
      </TabsContent>

      {/* Vision Tab */}
      <TabsContent value="vision">
        <VisionForm control={control} />
      </TabsContent>

      {/* Refraction Tab */}
      <TabsContent value="refraction">
        <RefractionForm control={control} watch={watch} />
      </TabsContent>

      {/* Diagnosis Tab */}
      <TabsContent value="diagnosis">
        <DiagnosisForm control={control} />
      </TabsContent>

      {/* Outcome Tab */}
      <TabsContent value="outcome">
        <OutcomeForm control={control} />
      </TabsContent>
    </Tabs>
  );
};

export default PatientFormTabs;
