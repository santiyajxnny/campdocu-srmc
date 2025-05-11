import React, { useState } from "react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RefractionInput } from "@/components/ui/refraction-input";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { formatRefractionValue } from "@/utils/refractionUtils";
import { Control, UseFormWatch } from "react-hook-form";

interface RefractionFormProps {
  control: Control<any>;
  watch: UseFormWatch<any>;
}

const RefractionForm: React.FC<RefractionFormProps> = ({ control, watch }) => {
  // State for the sign toggles
  const [rightSphPositive, setRightSphPositive] = useState(true);
  const [rightCylPositive, setRightCylPositive] = useState(false);
  const [leftSphPositive, setLeftSphPositive] = useState(true);
  const [leftCylPositive, setLeftCylPositive] = useState(false);
  
  const [acceptanceRightSphPositive, setAcceptanceRightSphPositive] = useState(true);
  const [acceptanceRightCylPositive, setAcceptanceRightCylPositive] = useState(false);
  const [acceptanceLeftSphPositive, setAcceptanceLeftSphPositive] = useState(true);
  const [acceptanceLeftCylPositive, setAcceptanceLeftCylPositive] = useState(false);
  
  // New state for Add Given section
  const [addGivenRightSphPositive, setAddGivenRightSphPositive] = useState(true);
  const [addGivenRightCylPositive, setAddGivenRightCylPositive] = useState(false);
  const [addGivenLeftSphPositive, setAddGivenLeftSphPositive] = useState(true);
  const [addGivenLeftCylPositive, setAddGivenLeftCylPositive] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-2">Refraction Values</h2>
      
      {/* Dry Refraction Section */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-4">Dry Refraction</h3>
        
        {/* Labels Row */}
        <div className="grid grid-cols-2 gap-6 mb-2">
          <div className="text-center font-medium">Right Eye (OD)</div>
          <div className="text-center font-medium">Left Eye (OS)</div>
        </div>
        
        {/* Input Fields Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Right Eye Group */}
          <div className="rounded-md border bg-background p-4">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center text-sm font-medium">Sph</div>
              <div className="text-center text-sm font-medium">Cyl</div>
              <div className="text-center text-sm font-medium">Axis</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Sphere Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={rightSphPositive}
                  onPressedChange={setRightSphPositive}
                  className="w-8"
                >
                  {rightSphPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="rightEyeSph"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cylinder Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={rightCylPositive}
                  onPressedChange={setRightCylPositive}
                  className="w-8"
                >
                  {rightCylPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="rightEyeCyl"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Axis Input */}
              <FormField
                control={control}
                name="rightEyeAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RefractionInput
                        type="number" 
                        placeholder="180" 
                        max="180"
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Formatted Display - Removed additional notes field */}
            <div className="mt-4 p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
              {formatRefractionValue(
                rightSphPositive,
                watch("rightEyeSph") || "", 
                rightCylPositive,
                watch("rightEyeCyl") || "", 
                watch("rightEyeAxis") || ""
              ) || "Example: +1.00DS/-0.50DCx180"}
            </div>
          </div>
          
          {/* Left Eye Group */}
          <div className="rounded-md border bg-background p-4">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center text-sm font-medium">Sph</div>
              <div className="text-center text-sm font-medium">Cyl</div>
              <div className="text-center text-sm font-medium">Axis</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Sphere Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={leftSphPositive}
                  onPressedChange={setLeftSphPositive}
                  className="w-8"
                >
                  {leftSphPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="leftEyeSph"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cylinder Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={leftCylPositive}
                  onPressedChange={setLeftCylPositive}
                  className="w-8"
                >
                  {leftCylPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="leftEyeCyl"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Axis Input */}
              <FormField
                control={control}
                name="leftEyeAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RefractionInput
                        type="number" 
                        placeholder="180"
                        max="180"
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Formatted Display - Removed additional notes field */}
            <div className="mt-4 p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
              {formatRefractionValue(
                leftSphPositive,
                watch("leftEyeSph") || "", 
                leftCylPositive,
                watch("leftEyeCyl") || "", 
                watch("leftEyeAxis") || ""
              ) || "Example: +1.00DS/-0.50DCx180"}
            </div>
          </div>
        </div>
        
        {/* Acceptance Section */}
        <h3 className="text-lg font-medium mt-8 mb-4">Acceptance</h3>
        
        {/* Input Fields Grid - Acceptance */}
        <div className="grid grid-cols-2 gap-6">
          {/* Right Eye Group - Acceptance */}
          <div className="rounded-md border bg-background p-4">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center text-sm font-medium">Sph</div>
              <div className="text-center text-sm font-medium">Cyl</div>
              <div className="text-center text-sm font-medium">Axis</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Sphere Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={acceptanceRightSphPositive}
                  onPressedChange={setAcceptanceRightSphPositive}
                  className="w-8"
                >
                  {acceptanceRightSphPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="acceptanceRightSph"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cylinder Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={acceptanceRightCylPositive}
                  onPressedChange={setAcceptanceRightCylPositive}
                  className="w-8"
                >
                  {acceptanceRightCylPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="acceptanceRightCyl"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Axis Input */}
              <FormField
                control={control}
                name="acceptanceRightAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RefractionInput
                        type="number" 
                        placeholder="180"
                        max="180"
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Formatted Display and Additional Input - Keeping notes for acceptance section */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
                {formatRefractionValue(
                  acceptanceRightSphPositive,
                  watch("acceptanceRightSph") || "", 
                  acceptanceRightCylPositive,
                  watch("acceptanceRightCyl") || "", 
                  watch("acceptanceRightAxis") || ""
                ) || "Example: +1.00DS/-0.50DCx180"}
              </div>
              <FormField
                control={control}
                name="acceptanceRightRefractionNote"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Additional notes"
                        className="h-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Left Eye Group - Acceptance */}
          <div className="rounded-md border bg-background p-4">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center text-sm font-medium">Sph</div>
              <div className="text-center text-sm font-medium">Cyl</div>
              <div className="text-center text-sm font-medium">Axis</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Sphere Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={acceptanceLeftSphPositive}
                  onPressedChange={setAcceptanceLeftSphPositive}
                  className="w-8"
                >
                  {acceptanceLeftSphPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="acceptanceLeftSph"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cylinder Input with toggle */}
              <div className="flex items-center gap-1">
                <Toggle 
                  variant="sign"
                  size="compact"
                  pressed={acceptanceLeftCylPositive}
                  onPressedChange={setAcceptanceLeftCylPositive}
                  className="w-8"
                >
                  {acceptanceLeftCylPositive ? "+" : "-"}
                </Toggle>
                <FormField
                  control={control}
                  name="acceptanceLeftCyl"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <RefractionInput
                          step="0.25"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Axis Input */}
              <FormField
                control={control}
                name="acceptanceLeftAxis"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RefractionInput
                        type="number" 
                        placeholder="180"
                        max="180"
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Formatted Display and Additional Input - Keeping notes for acceptance section */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
                {formatRefractionValue(
                  acceptanceLeftSphPositive,
                  watch("acceptanceLeftSph") || "", 
                  acceptanceLeftCylPositive,
                  watch("acceptanceLeftCyl") || "", 
                  watch("acceptanceLeftAxis") || ""
                ) || "Example: +1.00DS/-0.50DCx180"}
              </div>
              <FormField
                control={control}
                name="acceptanceLeftRefractionNote"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Additional notes"
                        className="h-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Given Section */}
      <h3 className="text-lg font-medium mt-8 mb-4">Add Given</h3>
      
      {/* Input Fields Grid - Add Given */}
      <div className="grid grid-cols-2 gap-6">
        {/* Right Eye Group - Add Given */}
        <div className="rounded-md border bg-background p-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-center text-sm font-medium">Sph</div>
            <div className="text-center text-sm font-medium">Cyl</div>
            <div className="text-center text-sm font-medium">Axis</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Sphere Input with toggle */}
            <div className="flex items-center gap-1">
              <Toggle 
                variant="sign"
                size="compact"
                pressed={addGivenRightSphPositive}
                onPressedChange={setAddGivenRightSphPositive}
                className="w-8"
              >
                {addGivenRightSphPositive ? "+" : "-"}
              </Toggle>
              <FormField
                control={control}
                name="addGivenRightSph"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <RefractionInput
                        step="0.25"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Cylinder Input with toggle */}
            <div className="flex items-center gap-1">
              <Toggle 
                variant="sign"
                size="compact"
                pressed={addGivenRightCylPositive}
                onPressedChange={setAddGivenRightCylPositive}
                className="w-8"
              >
                {addGivenRightCylPositive ? "+" : "-"}
              </Toggle>
              <FormField
                control={control}
                name="addGivenRightCyl"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <RefractionInput
                        step="0.25"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Axis Input */}
            <FormField
              control={control}
              name="addGivenRightAxis"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RefractionInput
                      type="number" 
                      placeholder="180"
                      max="180"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Formatted Display and Additional Input - Keeping notes for add given section */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
              {formatRefractionValue(
                addGivenRightSphPositive,
                watch("addGivenRightSph") || "", 
                addGivenRightCylPositive,
                watch("addGivenRightCyl") || "", 
                watch("addGivenRightAxis") || ""
              ) || "Example: +1.00DS/-0.50DCx180"}
            </div>
            <FormField
              control={control}
              name="addGivenRightRefractionNote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Additional notes"
                      className="h-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Left Eye Group - Add Given */}
        <div className="rounded-md border bg-background p-4">
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-center text-sm font-medium">Sph</div>
            <div className="text-center text-sm font-medium">Cyl</div>
            <div className="text-center text-sm font-medium">Axis</div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* Sphere Input with toggle */}
            <div className="flex items-center gap-1">
              <Toggle 
                variant="sign"
                size="compact"
                pressed={addGivenLeftSphPositive}
                onPressedChange={setAddGivenLeftSphPositive}
                className="w-8"
              >
                {addGivenLeftSphPositive ? "+" : "-"}
              </Toggle>
              <FormField
                control={control}
                name="addGivenLeftSph"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <RefractionInput
                        step="0.25"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Cylinder Input with toggle */}
            <div className="flex items-center gap-1">
              <Toggle 
                variant="sign"
                size="compact"
                pressed={addGivenLeftCylPositive}
                onPressedChange={setAddGivenLeftCylPositive}
                className="w-8"
              >
                {addGivenLeftCylPositive ? "+" : "-"}
              </Toggle>
              <FormField
                control={control}
                name="addGivenLeftCyl"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <RefractionInput
                        step="0.25"
                        min="0"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Axis Input */}
            <FormField
              control={control}
              name="addGivenLeftAxis"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RefractionInput
                      type="number" 
                      placeholder="180"
                      max="180"
                      min="0"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          {/* Formatted Display and Additional Input - Keeping notes for add given section */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 bg-slate-50 rounded border flex items-center justify-center text-sm">
              {formatRefractionValue(
                addGivenLeftSphPositive,
                watch("addGivenLeftSph") || "", 
                addGivenLeftCylPositive,
                watch("addGivenLeftCyl") || "", 
                watch("addGivenLeftAxis") || ""
              ) || "Example: +1.00DS/-0.50DCx180"}
            </div>
            <FormField
              control={control}
              name="addGivenLeftRefractionNote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Additional notes"
                      className="h-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefractionForm;
