import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react"

import { cn } from "@/lib/utils"

type Side = "left" | "right"

type Position = {
  x: number
  y: number
}

type FloatingBubbleProps = {
  children: ReactNode
  className?: string
  /** 气泡直径（px） */
  size?: number
  /** 吸附到左右边缘时的边距（px） */
  edgeOffset?: number
  /** 距顶部的最小边距（px） */
  topInset?: number
  /** 距底部的最小边距，不含 safe-area（px） */
  bottomInset?: number
  defaultSide?: Side
  /** 初始位置：从 bottomInset 向上偏移（px） */
  defaultOffsetY?: number
  onClick?: () => void
}

const DRAG_THRESHOLD = 6

function getSafeAreaBottom() {
  if (typeof window === "undefined") return 0
  return Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(
      "env(safe-area-inset-bottom)"
    ) || "0"
  )
}

function getBounds(
  size: number,
  edgeOffset: number,
  topInset: number,
  bottomInset: number
) {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const safeBottom = getSafeAreaBottom()

  return {
    minX: edgeOffset,
    maxX: viewportWidth - edgeOffset - size,
    minY: topInset,
    maxY: viewportHeight - bottomInset - safeBottom - size,
    viewportWidth,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function snapX(
  x: number,
  size: number,
  edgeOffset: number,
  viewportWidth: number
) {
  const centerX = x + size / 2
  return centerX < viewportWidth / 2
    ? edgeOffset
    : viewportWidth - edgeOffset - size
}

export function FloatingBubble({
  children,
  className,
  size = 56,
  edgeOffset = 20,
  topInset = 16,
  bottomInset = 90,
  defaultSide = "right",
  defaultOffsetY = 30,
  onClick,
}: FloatingBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    moved: false,
  })

  // 使用惰性初始化避免在 effect 里同步 setState（会触发 React 的“级联渲染”警告）
  const [position, setPosition] = useState<Position | null>(() => {
    if (typeof window === "undefined") return null

    const { minX, maxX, minY, maxY, viewportWidth } = getBounds(
      size,
      edgeOffset,
      topInset,
      bottomInset
    )

    const x =
      defaultSide === "left" ? edgeOffset : viewportWidth - edgeOffset - size
    const y = clamp(maxY - defaultOffsetY, minY, maxY)

    return {
      x: clamp(x, minX, maxX),
      y,
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setPosition((current) => {
        if (!current) return current

        const { minX, maxX, minY, maxY, viewportWidth } = getBounds(
          size,
          edgeOffset,
          topInset,
          bottomInset
        )

        return {
          x: clamp(
            snapX(current.x, size, edgeOffset, viewportWidth),
            minX,
            maxX
          ),
          y: clamp(current.y, minY, maxY),
        }
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [bottomInset, edgeOffset, size, topInset])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!position) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    }
    setIsDragging(true)
    setIsPressed(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const deltaX = event.clientX - dragState.current.startX
    const deltaY = event.clientY - dragState.current.startY

    if (
      !dragState.current.moved &&
      Math.hypot(deltaX, deltaY) >= DRAG_THRESHOLD
    ) {
      dragState.current.moved = true
      setIsPressed(false)
    }

    const { minX, maxX, minY, maxY } = getBounds(
      size,
      edgeOffset,
      topInset,
      bottomInset
    )

    setPosition({
      x: clamp(dragState.current.originX + deltaX, minX, maxX),
      y: clamp(dragState.current.originY + deltaY, minY, maxY),
    })
  }

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !position) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const { minY, maxY, viewportWidth } = getBounds(
      size,
      edgeOffset,
      topInset,
      bottomInset
    )

    const snapped = {
      x: snapX(position.x, size, edgeOffset, viewportWidth),
      y: clamp(position.y, minY, maxY),
    }

    setPosition(snapped)
    setIsDragging(false)
    setIsPressed(false)

    if (!dragState.current.moved) {
      navigator.vibrate?.(10)
      onClick?.()
    }
  }

  if (!position) return null

  return (
    <div
      ref={bubbleRef}
      role="button"
      tabIndex={0}
      aria-label="悬浮操作"
      className={cn(
        "fixed z-40 touch-none select-none",
        !isDragging && "transition-[left,top] duration-300 ease-out",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onClick?.()
        }
      }}
    >
      <div
        className={cn(
          "size-full transition-transform duration-150 ease-out",
          isPressed && "scale-90"
        )}
      >
        {children}
      </div>
    </div>
  )
}
