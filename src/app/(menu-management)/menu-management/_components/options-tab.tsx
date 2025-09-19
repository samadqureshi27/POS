import React from "react";
import {OptionsTabProps} from "@/lib/types/menum";
import { X, Grip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const OptionsTab: React.FC<OptionsTabProps> = ({
    formData,
    updateFormData,
    handleFormFieldChange,
    menuOptions,
}) => {
    const handleAddOption = (optionName: string) => {
        if (optionName && !formData.OptionValue?.includes(optionName)) {
            updateFormData({
                OptionValue: [...(formData.OptionValue || []), optionName],
                OptionPrice: [...(formData.OptionPrice || []), 0],
            });
        }
    };

    const handleRemoveOption = (idx: number) => {
        const updatedValues = (formData.OptionValue || []).filter((_, i) => i !== idx);
        const updatedPrices = (formData.OptionPrice || []).filter((_, i) => i !== idx);
        updateFormData({
            OptionValue: updatedValues,
            OptionPrice: updatedPrices,
        });
    };

    return (
        <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-6">
            {/* Header Section */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Add-On Options
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                    Select menu item options that will appear as modifiers/add-ons in the POS system
                </p>

                <div className="flex items-center gap-2">
                    <Select onValueChange={(value) => handleAddOption(value)}>
                        <SelectTrigger className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                            <SelectValue placeholder="Select an add-on option..." />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            {menuOptions && menuOptions.length > 0 ? (
                                menuOptions
                                    .filter((option) => !formData.OptionValue?.includes(option.Name))
                                    .map((option) => (
                                        <SelectItem key={option.ID} value={option.Name} className="cursor-pointer">
                                            <div>
                                                <div className="font-medium">{option.Name}</div>
                                                {option.Description && (
                                                    <div className="text-xs text-gray-500">{option.Description}</div>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))
                            ) : (
                                <SelectItem key="no-data" value="" disabled>
                                    No menu options available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Selected Options Display */}
            {formData.OptionValue && formData.OptionValue.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 pb-2 border-b border-gray-100">
                        Selected Add-On Options ({formData.OptionValue.length})
                    </h4>

                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <div className="border border-gray-200 rounded-lg bg-gray-50/50">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="w-12 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">Option Name</th>
                                        <th className="w-16 p-3 text-center text-xs font-medium text-gray-500 uppercase"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[100px] overflow-y-auto bg-white">
                            <DragDropContext
                                onDragEnd={(result) => {
                                    const { source, destination } = result;
                                    if (!destination || source.index === destination.index) return;

                                    const newOptionValues = Array.from(formData.OptionValue || []);
                                    const [movedValue] = newOptionValues.splice(source.index, 1);
                                    newOptionValues.splice(destination.index, 0, movedValue);

                                    const newOptionPrices = Array.from(formData.OptionPrice || []);
                                    const [movedPrice] = newOptionPrices.splice(source.index, 1);
                                    newOptionPrices.splice(destination.index, 0, movedPrice);

                                    updateFormData({
                                        OptionValue: newOptionValues,
                                        OptionPrice: newOptionPrices,
                                    });
                                }}
                            >
                                <Droppable droppableId="option-values">
                                    {(provided) => (
                                        <table className="w-full border-collapse">
                                            <tbody ref={provided.innerRef} {...provided.droppableProps}>
                                                {(formData.OptionValue || []).map((option: string, idx: number) => {
                                                    // Find the menu option details to show its values
                                                    const menuOption = menuOptions.find(opt => opt.Name === option);
                                                    const optionValues = menuOption?.OptionValue || [];

                                                    return (
                                                        <Draggable key={idx} draggableId={`option-${idx}`} index={idx}>
                                                            {(provided, snapshot) => (
                                                                <tr
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    className={`hover:bg-gray-50 transition-colors ${
                                                                        snapshot.isDragging ? "bg-blue-50 shadow-lg" : ""
                                                                    } border-b border-gray-100 last:border-b-0`}
                                                                >
                                                                    <td
                                                                        className="p-3 text-center cursor-grab w-12"
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <Grip size={16} className="text-gray-400 mx-auto" />
                                                                    </td>
                                                                    <td className="p-3">
                                                                        <div className="font-medium text-gray-800 mb-1">{option}</div>
                                                                        <div className="text-xs text-gray-500 mb-2">Add-on modifier option</div>

                                                                        {/* Option Values/Variations */}
                                                                        {optionValues.length > 0 && (
                                                                            <div className="mt-2">
                                                                                <div className="text-xs font-medium text-gray-600 mb-1">Available Options:</div>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {optionValues.slice(0, 4).map((value: string, valueIdx: number) => (
                                                                                        <span
                                                                                            key={valueIdx}
                                                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                                                                                        >
                                                                                            {value}
                                                                                        </span>
                                                                                    ))}
                                                                                    {optionValues.length > 4 && (
                                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                                                                            +{optionValues.length - 4} more
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {optionValues.length === 0 && (
                                                                            <div className="mt-2">
                                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
                                                                                    No variations configured
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="p-3 text-center w-16">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleRemoveOption(idx)}
                                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors px-2 py-1 rounded h-auto w-auto"
                                                                        >
                                                                            <X size={16} />
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </tbody>
                                        </table>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {(formData.OptionValue || []).map((option: string, idx: number) => {
                            // Find the menu option details to show its values
                            const menuOption = menuOptions.find(opt => opt.Name === option);
                            const optionValues = menuOption?.OptionValue || [];

                            return (
                                <div key={idx} className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <Grip size={16} className="text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-800">{option}</div>
                                                <div className="text-xs text-gray-500">Add-on modifier option</div>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveOption(idx)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>

                                    {/* Option Values/Variations for Mobile */}
                                    {optionValues.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="text-xs font-medium text-gray-600 mb-2">Available Options:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {optionValues.slice(0, 3).map((value: string, valueIdx: number) => (
                                                    <span
                                                        key={valueIdx}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                                                    >
                                                        {value}
                                                    </span>
                                                ))}
                                                {optionValues.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200">
                                                        +{optionValues.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {optionValues.length === 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 border border-yellow-200">
                                                No variations configured
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!formData.OptionValue || formData.OptionValue.length === 0) && (
                <div className="text-center py-12 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">No add-on options selected</h4>
                    <p className="text-xs text-gray-500">
                        Select options from the dropdown above to add modifiers for this menu item
                    </p>
                </div>
            )}
        </div>
    );
};

export default OptionsTab;