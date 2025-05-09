
// Helper function to format refraction values in the standard optical notation
export const formatRefractionValue = (
  isPositiveSph: boolean, 
  sphValue: string, 
  isPositiveCyl: boolean, 
  cylValue: string, 
  axis: string
): string => {
  if (!sphValue && !cylValue && !axis) return "";
  
  // Format sphere value with sign
  const sphSign = isPositiveSph ? "+" : "-";
  const sphereFormatted = sphValue ? `${sphSign}${sphValue}DS` : "";
  
  // Only include cylinder and axis if both are present
  let cylinderFormatted = "";
  if (cylValue) {
    const cylSign = isPositiveCyl ? "+" : "-";
    if (axis) {
      cylinderFormatted = `/${cylSign}${cylValue}DCx${axis}`;
    } else {
      cylinderFormatted = `/${cylSign}${cylValue}DC`;
    }
  }
  
  return `${sphereFormatted}${cylinderFormatted}`;
};
