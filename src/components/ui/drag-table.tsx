"use client";

import React, { ReactNode } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Grip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DragTableColumn {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, item: any, index: number) => ReactNode;
}

interface DragTableProps {
  data: any[];
  columns: DragTableColumn[];
  onReorder: (result: DropResult) => void;
  onDelete?: (index: number) => void;
  onUpdate?: (index: number, field: string, value: any) => void;
  droppableId: string;
  className?: string;
  showDelete?: boolean;
  emptyMessage?: string;
}

export const DragTable: React.FC<DragTableProps> = ({
  data,
  columns,
  onReorder,
  onDelete,
  onUpdate,
  droppableId,
  className = "",
  showDelete = true,
  emptyMessage = "No items to display"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-sm bg-white overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50/50 border-b border-gray-200">
        <div className="grid gap-4 p-3" style={{ gridTemplateColumns: `40px ${columns.map(col => col.width || 'minmax(0, 1fr)').join(' ')} ${showDelete ? '40px' : ''}` }}>
          <div className="text-center text-xs font-medium text-gray-500 uppercase"></div>
          {columns.map((column) => (
            <div key={column.key} className="text-left text-xs font-medium text-gray-500 uppercase">
              {column.label}
            </div>
          ))}
          {showDelete && <div className="text-center text-xs font-medium text-gray-500 uppercase"></div>}
        </div>
      </div>

      {/* Draggable Content */}
      <DragDropContext onDragEnd={onReorder}>
        <Droppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[60px] ${snapshot.isDraggingOver ? 'bg-blue-50/30' : ''}`}
            >
              {data.map((item, index) => (
                <Draggable key={`${droppableId}-${index}`} draggableId={`${droppableId}-${index}`} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                        snapshot.isDragging ? 'bg-blue-50 shadow-lg z-50' : ''
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                        zIndex: snapshot.isDragging ? 1000 : 'auto'
                      }}
                    >
                      <div className="grid gap-4 p-3" style={{ gridTemplateColumns: `40px ${columns.map(col => col.width || 'minmax(0, 1fr)').join(' ')} ${showDelete ? '40px' : ''}` }}>
                        {/* Drag Handle */}
                        <div
                          className="flex items-center justify-center cursor-grab active:cursor-grabbing"
                          {...provided.dragHandleProps}
                        >
                          <Grip size={16} className="text-gray-400" />
                        </div>

                        {/* Data Columns */}
                        {columns.map((column) => (
                          <div key={column.key} className="flex items-center">
                            {column.render ? (
                              column.render(item[column.key], item, index)
                            ) : onUpdate ? (
                              <Input
                                type="text"
                                value={item[column.key] || ""}
                                onChange={(e) => onUpdate(index, column.key, e.target.value)}
                                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                              />
                            ) : (
                              <span className="text-sm text-gray-700">{item[column.key]}</span>
                            )}
                          </div>
                        ))}

                        {/* Delete Button */}
                        {showDelete && onDelete && (
                          <div className="flex items-center justify-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors p-2 h-auto w-auto"
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default DragTable;