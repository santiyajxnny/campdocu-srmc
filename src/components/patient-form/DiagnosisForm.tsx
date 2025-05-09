
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface DiagnosisFormProps {
  control: Control<any>;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Ocular Diagnosis</h2>
      
      <FormField 
        control={control} 
        name="ocularDiagnosis" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnosis</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Myopia, Presbyopia" {...field} />
            </FormControl>
            <FormDescription>
              Enter ocular conditions, refractive errors, or other findings
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default DiagnosisForm;
