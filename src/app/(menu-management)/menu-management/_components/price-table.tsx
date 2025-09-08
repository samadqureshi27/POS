import React from "react";
import { Plus, Grip, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface MenuItem {
  ID: number;
  Name: string;
  Price: number;
  Category: string;
  StockQty: string;
  Status: "Active" | "Inactive";
  status: ("Active" | "Inactive")[];
  Description?: string;
  MealType?: string;
  Priority?: number;
  MinimumQuantity?: number;
  ShowOnMenu?: "Active" | "Inactive";
  Featured?: "Active" | "Inactive";
  StaffPick?: "Active" | "Inactive";
  DisplayType?: string;
  Displaycat?: string;
  SpecialStartDate?: string;
  SpecialEndDate?: string;
  SpecialPrice?: number;
  OptionValue?: string[];
  OptionPrice?: number[];
  MealValue?: string[];
  MealPrice?: number[];
  PName?: string[];
  PPrice?: number[];
  OverRide?: ("Active" | "Inactive")[];
  ShowOnMain?: "Active" | "Inactive";
  SubTBE?: "Active" | "Inactive";
  Deal?: "Active" | "Inactive";
  Special?: "Active" | "Inactive";
}

interface PriceTabProps {
  formData: Omit<MenuItem, "ID">;
  setFormData: React.Dispatch<React.SetStateAction<Omit<MenuItem, "ID">>>;
}

const PriceTab: React.FC<PriceTabProps> = ({ formData, setFormData }) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="border border-gray-200 rounded-t-lg bg-gray-50">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-12 p-2 text-center text-sm font-medium text-gray-700">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        PName: [...(formData.PName || []), ""],
                        PPrice: [...(formData.PPrice || []), 0],
                      })
                    }
                    className="w-8 h-8 flex items-center justify-center text-black rounded-sm hover:bg-gray-200 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="w-32 p-3 text-center text-sm font-medium text-gray-700">Price</th>
                <th className="w-12 p-3 text-center text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="border-l border-r border-b border-gray-200 rounded-b-lg min-h-[217px] overflow-y-auto bg-white">
          <DragDropContext
            onDragEnd={(result) => {
              const { source, destination } = result;
              if (!destination || source.index === destination.index) return;

              const newPValue = Array.from(formData.PName || []);
              const [movedValue] = newPValue.splice(source.index, 1);
              newPValue.splice(destination.index, 0, movedValue);

              const newPPrice = Array.from(formData.PPrice || []);
              const [movedPrice] = newPPrice.splice(source.index, 1);
              newPPrice.splice(destination.index, 0, movedPrice);

              setFormData({
                ...formData,
                PName: newPValue,
                PPrice: newPPrice,
              });
            }}
          >
            <Droppable droppableId="p-values">
              {(provided) => (
                <table className="w-full border-collapse">
                  <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {(formData.PName || []).map((opt, idx) => (
                      <Draggable key={idx} draggableId={`p-${idx}`} index={idx}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`hover:bg-gray-50 ${
                              snapshot.isDragging ? "bg-gray-100 shadow-lg" : ""
                            } border-b border-gray-200`}
                          >
                            <td
                              className="p-3 text-center cursor-grab w-12"
                              {...provided.dragHandleProps}
                            >
                              <Grip size={18} className="text-gray-500 mx-auto" />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...(formData.PName || [])];
                                  updated[idx] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    PName: updated,
                                  });
                                }}
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm"
                              />
                            </td>
                            <td className="p-3 text-center">
                              <input
                                type="number"
                                value={(formData.PPrice || [])[idx] || 0}
                                onChange={(e) => {
                                  const updated = [...(formData.PPrice || [])];
                                  updated[idx] = Number(e.target.value) || 0;
                                  setFormData({
                                    ...formData,
                                    PPrice: updated,
                                  });
                                }}
                                className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1] text-sm text-center"
                              />
                            </td>
                            <td className="p-3 text-center w-12">
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedValues = (formData.PName || []).filter(
                                    (_, i) => i !== idx
                                  );
                                  const updatedPrices = (formData.PPrice || []).filter(
                                    (_, i) => i !== idx
                                  );
                                  setFormData({
                                    ...formData,
                                    PName: updatedValues,
                                    PPrice: updatedPrices,
                                  });
                                }}
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

      {/* Mobile Add Button */}
      <div className="md:hidden mb-4">
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              PName: [...(formData.PName || []), ""],
              PPrice: [...(formData.PPrice || []), 0],
            })
          }
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-black border-2 border-dashed border-gray-300 rounded-sm hover:bg-gray-50 transition-colors"
        >
          <Plus size={18} />
          Add Price Item
        </button>
      </div>

      {/* Mobile Card View for Price Tab */}
      <div className="md:hidden space-y-4">
        {(formData.PName || []).map((opt, idx) => (
          <div key={idx} className="border border-gray-200 rounded-sm p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <Grip size={18} className="text-gray-500" />
              <button
                type="button"
                onClick={() => {
                  const updatedValues = (formData.PName || []).filter((_, i) => i !== idx);
                  const updatedPrices = (formData.PPrice || []).filter((_, i) => i !== idx);
                  setFormData({
                    ...formData,
                    PName: updatedValues,
                    PPrice: updatedPrices,
                  });
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const updated = [...(formData.PName || [])];
                    updated[idx] = e.target.value;
                    setFormData({
                      ...formData,
                      PName: updated,
                    });
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
                  placeholder="Price item name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                <input
  type="number"
  step="0.01"
  value={(formData.PPrice || [])[idx] || 0}
  onChange={(e) => {
    const updated = [...(formData.PPrice || [])];
    updated[idx] = Number(e.target.value) || 0;
    setFormData({
      ...formData,
      PPrice: updated,
    });
  }}
  className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d9d9e1]"
  placeholder="Enter price"
/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTab;
