// components/OptionValuesForm.tsx
import React from 'react';
import { Plus, X, Grip } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { MenuItemOptions } from '@/lib/types/interfaces';

interface OptionValuesFormProps {
  formData: Omit<MenuItemOptions, "ID">;
  onFormDataChange: (data: Omit<MenuItemOptions, "ID">) => void;
}

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

  const handleDragEnd = (result: DropResult) => {
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

  return (
    <div className="space-y-4 pb-4">
      {/* Mobile Card Layout */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Option Values</h3>
          <button
            type="button"
            onClick={addOptionPair}
            className="bg-black text-white px-3 py-2 rounded-sm text-sm flex items-center gap-2 hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} />
            Add Option
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}>
          {formData.OptionValue.map((opt, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Grip size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">Option {idx + 1}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeOptionPair(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Option Value
                  </label>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...formData.OptionValue];
                      updated[idx] = e.target.value;
                      onFormDataChange({
                        ...formData,
                        OptionValue: updated,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                    placeholder="Enter option value"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Option Price
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.OptionPrice[idx]}
                    onChange={(e) => {
                      const updated = [...formData.OptionPrice];
                      updated[idx] = Number(e.target.value.replace(/\D/g, "")) || 0;
                      onFormDataChange({
                        ...formData,
                        OptionPrice: updated,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block">
        {/* Fixed Header */}
        <div className="border border-gray-200 rounded-t-lg bg-gray-50">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-12 p-2 lg:p-3 text-center text-sm font-medium text-gray-700">
                  <button
                    type="button"
                    onClick={addOptionPair}
                    className="w-8 h-8 flex items-center justify-center text-black rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </th>
                <th className="p-2 lg:p-3 text-left text-sm font-medium text-gray-700">
                  Option Value
                </th>
                <th className="p-2 lg:p-3 text-center text-sm font-medium text-gray-700 w-24 lg:w-32">
                  Option Price
                </th>
                <th className="w-12 p-2 lg:p-3 text-center text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable Body */}
        <div className="border-l border-r border-b border-gray-200 rounded-b-lg max-h-60 lg:max-h-80 overflow-y-auto bg-white" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 #f1f5f9" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="option-values">
              {(provided) => (
                <table className="w-full border-collapse">
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {formData.OptionValue.map((opt, idx) => (
                      <Draggable
                        key={idx}
                        draggableId={`option-${idx}`}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 ${snapshot.isDragging
                              ? "bg-gray-100 shadow-lg"
                              : ""
                              } border-b border-gray-200`}
                          >
                            {/* Drag Handle */}
                            <td
                              className="p-2 lg:p-3 text-center cursor-grab w-12"
                              {...provided.dragHandleProps}
                            >
                              <Grip
                                size={18}
                                className="text-gray-500 mx-auto"
                              />
                            </td>

                            {/* Option Name */}
                            <td className="p-2 lg:p-3">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...formData.OptionValue];
                                  updated[idx] = e.target.value;
                                  onFormDataChange({
                                    ...formData,
                                    OptionValue: updated,
                                  });
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                                placeholder="Enter option value"
                              />
                            </td>

                            {/* Option Price */}
                            <td className="p-2 lg:p-3 text-center">
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={formData.OptionPrice[idx]}
                                onChange={(e) => {
                                  const updated = [...formData.OptionPrice];
                                  updated[idx] =
                                    Number(
                                      e.target.value.replace(/\D/g, "")
                                    ) || 0;
                                  onFormDataChange({
                                    ...formData,
                                    OptionPrice: updated,
                                  });
                                }}
                                className="w-16 lg:w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-center text-sm mx-auto"
                                placeholder="0"
                              />
                            </td>

                            {/* Delete Button */}
                            <td className="p-2 lg:p-3 text-center w-12">
                              <button
                                type="button"
                                onClick={() => removeOptionPair(idx)}
                                className="text-black px-2 py-1 rounded hover:text-gray-700"
                              >
                                <X size={20} />
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default OptionValuesForm;