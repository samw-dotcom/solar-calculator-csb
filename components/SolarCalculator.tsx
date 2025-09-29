import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

export function SolarCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [utility, setUtility] = useState("");
  const [monthlyBill, setMonthlyBill] = useState("");
  const [hasEV, setHasEV] = useState(false);
  const [results, setResults] = useState<{
    systemSize: number;
    priceRange: { min: number; max: number };
    lifetimeSavings: { min: number; max: number };
    homeValueIncrease: { min: number; max: number };
  } | null>(null);

  const calculateSolar = () => {
    const bill = parseFloat(monthlyBill);
    if (!zipCode || !utility || !bill || bill <= 0) return;

    // Industry-standard calculations
    const avgElectricityRate = 0.25; // $/kWh average
    const monthlyUsage = bill / avgElectricityRate; // kWh per month
    const evUsage = hasEV ? 400 : 0; // Additional 400 kWh/month for EV
    const totalMonthlyUsage = monthlyUsage + evUsage;
    const annualUsage = totalMonthlyUsage * 12;
    
    // System size: 130 kWh/month per kW production
    const systemSize = Math.round((totalMonthlyUsage / 130) * 10) / 10;
    
    // Price range: $2.50-$4.00/watt
    const priceMin = Math.round(systemSize * 1000 * 2.5);
    const priceMax = Math.round(systemSize * 1000 * 4.0);
    
    // Lifetime savings (25 years, 3% annual electricity rate increase)
    const annualSavings = annualUsage * avgElectricityRate;
    const lifetimeSavingsMin = Math.round(annualSavings * 20); // Conservative
    const lifetimeSavingsMax = Math.round(annualSavings * 25); // Optimistic
    
    // Home value increase: Fixed range based on industry data
    // Solar adds approximately 4.1% to home values, typically $39,500-$79,000 range
    // Scale within this range based on system size, with smaller systems toward lower end
    const sizeRatio = Math.min(systemSize / 8, 1); // Normalize to 8kW max for scaling
    const homeValueMin = 39500; // Always start at $39,500
    const homeValueMax = Math.round(39500 + (79000 - 39500) * sizeRatio); // Scale up to $79,000
    const finalHomeValueMax = Math.max(homeValueMax, 45000); // Ensure meaningful range

    setResults({
      systemSize,
      priceRange: { min: priceMin, max: priceMax },
      lifetimeSavings: { min: lifetimeSavingsMin, max: lifetimeSavingsMax },
      homeValueIncrease: { min: homeValueMin, max: finalHomeValueMax }
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Solar Savings Calculator</CardTitle>
          <CardDescription>
            Get an estimate of your potential solar savings and system requirements
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipcode">ZIP Code</Label>
              <Input
                id="zipcode"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder=""
                maxLength={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="utility">Utility Company</Label>
              <Select value={utility} onValueChange={setUtility}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your utility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sce">SCE</SelectItem>
                  <SelectItem value="ladwp">LADWP</SelectItem>
                  <SelectItem value="sdge">SDG&E</SelectItem>
                  <SelectItem value="pge">PG&E</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly-bill">Average Monthly Electric Bill ($)</Label>
            <Input
              id="monthly-bill"
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(e.target.value)}
              placeholder=""
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ev-car"
              checked={hasEV}
              onCheckedChange={setHasEV}
            />
            <Label htmlFor="ev-car">I have an electric vehicle</Label>
          </div>

          <Button 
            onClick={calculateSolar} 
            className="w-full"
            disabled={!zipCode || !utility || !monthlyBill}
          >
            Calculate Solar Savings
          </Button>

          {results && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Estimated Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {results.systemSize} kW
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated System Size
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(results.priceRange.min)} - {formatCurrency(results.priceRange.max)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Price Range
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(results.lifetimeSavings.min)} - {formatCurrency(results.lifetimeSavings.max)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Lifetime Savings
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(results.homeValueIncrease.min)} - {formatCurrency(results.homeValueIncrease.max)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Estimated Home Value Increase
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Legal Disclaimers */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Important Disclaimers</h4>
              <div className="space-y-2">
                <p>
                  <strong>Estimates Only:</strong> All calculations provided are estimates based on industry-standard formulas and assumptions. Actual results may vary significantly based on specific site conditions, local regulations, equipment selection, installation quality, weather patterns, and individual usage habits.
                </p>
                
                <p>
                  <strong>Professional Consultation Required:</strong> These estimates should not be used as the sole basis for investment decisions. Professional site assessment, detailed engineering analysis, and consultation with certified solar installers are essential before making any solar investment.
                </p>
                
                <p>
                  <strong>Financial Assumptions:</strong> Savings calculations assume current electricity rates, system performance, and various market conditions that may change over time. Federal, state, and local incentives are subject to change and may affect actual costs and savings.
                </p>
                
                <p>
                  <strong>No Warranty:</strong> This calculator provides general estimates only and comes with no warranty, express or implied. We disclaim all liability for decisions made based on these estimates.
                </p>
                
                <p>
                  <strong>Actual Performance Varies:</strong> Solar system performance depends on numerous factors including but not limited to: roof orientation, shading, local weather conditions, system maintenance, equipment degradation, and changes in electricity usage patterns.
                </p>
                
                <p>
                  <strong>Home Value Estimates:</strong> Home value increase calculations are based on industry studies showing solar installations typically add 4.1% to home values. Actual home value impact varies significantly by location, local market conditions, home characteristics, system quality, age of installation, and buyer preferences. Real estate appraisals may differ from these estimates.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}