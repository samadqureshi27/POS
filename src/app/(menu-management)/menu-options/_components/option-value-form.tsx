// components/OptionValuesForm.tsx
import React from 'react';
import { Plus, X, Grip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DragTable from '@/components/ui/drag-table';
import { MenuItemOptions, OptionValuesFormProps } from '@/lib/types/menuItemOptions';

const OptionValuesForm: React.FC<OptionValuesFormProps> = ({ formData, onFormDataChange }) => {
  const addOptionPair = () => {
    onFormDataChange({
      ...formData,
      OptionValue: [...formData.OptionValue, ""],
      OptionPrice: [...formData.OptionPrice, 0],
    });
  };

  const removeOptionPair = (index: number) => {
    onFormDataChange({
      ...formData,
      OptionValue: formData.OptionValue.filter((_, i) => i !== index),
      OptionPrice: formData.OptionPrice.filter((_, i) => i !== index),
    });
  };

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const newOptionValue = Array.from(formData.OptionValue);
    const [movedValue] = newOptionValue.splice(source.index, 1);
    newOptionValue.splice(destination.index, 0, movedValue);

    const newOptionPrice = Array.from(formData.OptionPrice);
    const [movedPrice] = newOptionPrice.splice(source.index, 1);
    newOptionPrice.splice(destination.index, 0, movedPrice);

    onFormDataChange({
      ...formData,
      OptionValue: newOptionValue,
      OptionPrice: newOptionPrice,
    });
  };

  const updateValue = (index: number, value: string) => {
    const updated = [...formData.OptionValue];
    updated[index] = value;
    onFormDataChange({
      ...formData,
      OptionValue: updated,
    });
  };

  const updatePrice = (index: number, value: number) => {
    const updated = [...formData.OptionPrice];
    updated[index] = value;
    onFormDataChange({
      ...formData,
      OptionPrice: updated,
    });
  };

  // Prepare data for DragTable
  const tableData = formData.OptionValue.map((value: string, idx: number) => ({
    value: value,
    price: formData.OptionPrice[idx] || 0,
    index: idx
  }));

  const tableColumns = [
    {
      key: 'value',
      label: 'Value Name',
      width: 'minmax(200px, 1fr)',
      render: (value: string, item: any, index: number) => (
        <Input
          type="text"
          value={value}
          onChange={(e) => updateValue(index, e.target.value)}
          placeholder="Option value (e.g., Small, Medium, Large)"
          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
        />
      )
    },
    {
      key: 'price',
      label: 'Price',
      width: '120px',
      render: (value: number, item: any, index: number) => (
        <Input
          type="number"
          step="0.01"
          min="0"
          value={value}
          onChange={(e) => updatePrice(index, Number(e.target.value) || 0)}
          className="w-full text-center transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 min-w-0"
          placeholder="0.00"
        />
      )
    }
  ];

  const hasOptions = formData.OptionValue && formData.OptionValue.length > 0;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Fixed Header Section - Non-scrollable */}
      <div className="flex-shrink-0 space-y-4 p-6 bg-white">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Option Values
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Add specific choices customers can select for this option with their respective prices
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOptionPair}
          className="flex items-center gap-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 hover:bg-blue-50"
        >
          <Plus size={16} />
          Add Option Value
        </Button>
      </div>

      {/* Scrollable Content Area with Fixed Height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {hasOptions ? (
          <div className="h-full flex flex-col">
            {/* Section Header - Sticky */}
            <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
              <h4 className="text-sm font-medium text-gray-700">
                Option Values ({formData.OptionValue.length})
              </h4>
            </div>

            {/* Scrollable Options List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
              {/* Desktop Table Layout */}
              <div className="hidden lg:block h-full">
                <div className="overflow-x-auto h-full">
                  <div className="min-w-full">
                    <DragTable
                      data={tableData}
                      columns={tableColumns}
                      onReorder={handleDragEnd}
                      onDelete={removeOptionPair}
                      droppableId="option-values"
                      emptyMessage="No option values added"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="lg:hidden space-y-3">
                {formData.OptionValue.map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex-shrink-0 mt-0.5">
                          <Grip size={16} className="text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            Option Value #{idx + 1}
                          </div>
                          <div className="text-xs text-gray-500">Customer choice option</div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOptionPair(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="min-w-0">
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Value Name
                        </Label>
                        <Input
                          type="text"
                          value={opt}
                          onChange={(e) => updateValue(idx, e.target.value)}
                          placeholder="Option name"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
                        />
                      </div>
                      <div className="min-w-0">
                        <Label className="text-xs font-medium text-gray-700 mb-1 block">
                          Price
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.OptionPrice[idx]}
                          onChange={(e) => updatePrice(idx, Number(e.target.value) || 0)}
                          placeholder="0.00"
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 w-full min-w-0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Empty State - Centered in available space */
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 max-w-sm w-full">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">No option values added</h4>
              <p className="text-xs text-gray-500 px-4">
                Add option values to provide choices for customers when selecting this option
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionValuesForm;