
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface OutcomeFormProps {
  control: Control<any>;
}

const OutcomeForm: React.FC<OutcomeFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Outcome</h2>
      
      <FormField 
        control={control} 
        name="outcome" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Outcome</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="glasses">Glass Prescription</SelectItem>
                <SelectItem value="referred">Referred to Hospital</SelectItem>
                <SelectItem value="followup">Follow-up Required</SelectItem>
                <SelectItem value="normal">Normal - No Treatment</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select the appropriate outcome for this patient
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default OutcomeForm;
