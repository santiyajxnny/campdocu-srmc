
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface HistoryFormProps {
  control: Control<any>;
}

const HistoryForm: React.FC<HistoryFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">History Collection</h2>
      
      <FormField 
        control={control} 
        name="history" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medical History</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter patient's medical history, complaints, etc." 
                className="min-h-[200px]" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Include any relevant medical conditions, ocular history, systemic diseases, etc.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default HistoryForm;
