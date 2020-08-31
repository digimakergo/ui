import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import './digimaker-ui.css';
const style = {
  //border: '1px dashed gray',
  //padding: '0.5rem 1rem',
  //marginBottom: '.5rem',
  // backgroundColor: '#ffe9e9',
  cursor: 'move',
}

export interface CardProps {
  id: any
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}

interface DragItem {
  index: number
  id: string
  type: string
}
export const Card: React.FC<any> = ({ id, canDrag, index, moveCard, dropCard, children, ...props }) => {
  const ref = useRef<HTMLTableRowElement>(null)
  const [, drop] = useDrop({
    accept: 'card',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index


      // // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // // Only perform the move when the mouse has crossed half of the items height
      // // When dragging downwards, only move when the cursor is below 50%
      // // When dragging upwards, only move when the cursor is above 50%
      //
      // // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      //
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
    drop(item: DragItem, monitor: DropTargetMonitor){
      dropCard();
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'card', id, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag(monitor){
      return canDrag;
    }
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <tr ref={ref} style={{ ...style, opacity }} {...props}>
      {children}
    </tr>
  )
}
