import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface TenantSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const mockTenants = [
  { id: 'tenant-1', name: 'hospital_A' },
  { id: 'tenant-2', name: 'hospital_B' },
  { id: 'tenant-3', name: 'hospital_C' },
];

export const TenantSelector: React.FC<TenantSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Select tenant...",
  className = ""
}) => {

    // Load saved tenant from localStorage on first render
  useEffect(() => {
    const savedTenant = localStorage.getItem('selectedTenant');
    if (savedTenant && !value) {
      onValueChange(savedTenant);
    }
  }, [value, onValueChange]);

  const handleChange = (selected: string) => {
    // Save to localStorage
    localStorage.setItem('selectedTenant', selected);
    // Pass value to parent
    onValueChange(selected);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Building2 className="h-4 w-4" />
        Tenant
      </label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {mockTenants?.map((tenant) => (
            <SelectItem key={tenant.id} value={tenant.name}>
              {tenant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};