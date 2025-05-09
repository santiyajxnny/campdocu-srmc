
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Control } from "react-hook-form";

interface VisionFormProps {
  control: Control<any>;
}

const VisionForm: React.FC<VisionFormProps> = ({ control }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Vision Check</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <div className="text-left font-medium">Right Eye (OD)</div>
          <div className="text-left font-medium">Left Eye (OS)</div>
        </div>

        {/* Distant Vision */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="flex items-center">
            <Label className="font-medium">Distant</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1 bg-sky-300 hover:bg-sky-200">
                  ?
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>Distant vision typically measured in 6/X format (metric) or 20/X format (US). Enter numerator/denominator.</p>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Right Eye Distant Vision */}
          <div className="flex items-center gap-2">
            <FormField 
              control={control}
              name="distantVisionRight" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="6" className="w-16 text-center" {...field} />
                      <span className="mx-1">/</span>
                      <Input placeholder="6" className="w-16 text-center" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>

          {/* Left Eye Distant Vision */}
          <div className="flex items-center gap-2">
            <FormField 
              control={control}
              name="distantVisionLeft" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="6" className="w-16 text-center" {...field} />
                      <span className="mx-1">/</span>
                      <Input placeholder="6" className="w-16 text-center" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
        </div>

        {/* Near Vision */}
        <div className="grid grid-cols-3 gap-2 items-center">
          <div className="flex items-center">
            <Label className="font-medium">Near</Label>
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1 bg-sky-300 hover:bg-sky-200">
                  ?
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>Near vision typically measured in N format (N5, N6, etc). Enter N value/distance.</p>
              </HoverCardContent>
            </HoverCard>
          </div>

          {/* Right Eye Near Vision */}
          <div className="flex items-center gap-2">
            <FormField 
              control={control}
              name="nearVisionRight" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="N" className="w-16 text-center" {...field} />
                      <span className="mx-1">/</span>
                      <Input placeholder="cm" className="w-16 text-center" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>

          {/* Left Eye Near Vision */}
          <div className="flex items-center gap-2">
            <FormField 
              control={control}
              name="nearVisionLeft" 
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="flex items-center">
                      <Input placeholder="N" className="w-16 text-center" {...field} />
                      <span className="mx-1">/</span>
                      <Input placeholder="cm" className="w-16 text-center" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionForm;
