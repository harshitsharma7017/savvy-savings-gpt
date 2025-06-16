
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES, useCurrency } from "@/contexts/CurrencyContext";
import { DollarSign } from "lucide-react";

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = CURRENCIES.find(c => c.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DollarSign className="h-4 w-4 text-slate-600" />
      <Select value={currency.code} onValueChange={handleCurrencyChange}>
        <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-slate-200">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-slate-200 shadow-lg">
          {CURRENCIES.map((curr) => (
            <SelectItem key={curr.code} value={curr.code} className="hover:bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{curr.symbol}</span>
                <span className="text-sm text-slate-600">{curr.code}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
