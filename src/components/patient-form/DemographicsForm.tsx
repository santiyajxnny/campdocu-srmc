
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface DemographicsFormProps {
  control: Control<any>;
}

const DemographicsForm: React.FC<DemographicsFormProps> = ({ control }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Patient Demographics</h2>
      
      <FormField 
        control={control} 
        name="name" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter patient's full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={control} 
        name="age" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter age" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
      
      <FormField 
        control={control} 
        name="sex" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sex</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient's sex" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
};

export default DemographicsForm;
