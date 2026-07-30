"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
  type Modifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

interface SortableListProps<T extends { _dndId: string }> {
  items: T[];
  onReorder: (next: T[]) => void;
  renderItem: (item: T, index: number, drag: DragHandleProps) => React.ReactNode;
  className?: string;
  strategy?: SortingStrategy;
  modifiers?: Modifier[];
}

function SortableItem<T extends { _dndId: string }>({
  item,
  index,
  renderItem,
}: {
  item: T;
  index: number;
  renderItem: SortableListProps<T>["renderItem"];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item._dndId,
  });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: reduceMotion ? undefined : transition,
        position: "relative",
        zIndex: isDragging ? 10 : undefined,
      }}
      layout={!reduceMotion}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: isDragging ? 0.6 : 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {renderItem(item, index, { attributes, listeners })}
    </motion.div>
  );
}

export function SortableList<T extends { _dndId: string }>({
  items,
  onReorder,
  renderItem,
  className,
  strategy = verticalListSortingStrategy,
  modifiers = [restrictToVerticalAxis],
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => item._dndId === active.id);
    const newIndex = items.findIndex((item) => item._dndId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={modifiers}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item._dndId)} strategy={strategy}>
        <div className={className}>
          <AnimatePresence initial={false}>
            {items.map((item, index) => (
              <SortableItem key={item._dndId} item={item} index={index} renderItem={renderItem} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
}
