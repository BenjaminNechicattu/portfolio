import { useEffect, useRef, useState } from 'react';

interface DragState {
  isDragging: boolean;
  ring: string | null;
  startAngle: number;
  currentAngle: number;
}

const ModernClock = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(new Date());
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    ring: null,
    startAngle: 0,
    currentAngle: 0,
  });
  const [offsets, setOffsets] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    day: 0,
    month: 0,
    date: 0,
  });

  // Ring radius constants for interaction detection
  const RING_RADII = {
    date: { min: 240, max: 270 },
    month: { min: 210, max: 240 },
    day: { min: 180, max: 210 },
    hours: { min: 150, max: 180 },
    minutes: { min: 120, max: 150 },
    seconds: { min: 90, max: 120 },
  };

  // Update actual time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reset offsets when dragging stops
  useEffect(() => {
    if (!dragState.isDragging && dragState.ring) {
      const timer = setTimeout(() => {
        setOffsets({
          hours: 0,
          minutes: 0,
          seconds: 0,
          day: 0,
          month: 0,
          date: 0,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dragState.isDragging, dragState.ring]);

  const getAngleFromPoint = (centerX: number, centerY: number, x: number, y: number): number => {
    return Math.atan2(y - centerY, x - centerX);
  };

  const getRingFromDistance = (distance: number): string | null => {
    if (distance > RING_RADII.date.min && distance < RING_RADII.date.max) return 'date';
    if (distance > RING_RADII.month.min && distance < RING_RADII.month.max) return 'month';
    if (distance > RING_RADII.day.min && distance < RING_RADII.day.max) return 'day';
    if (distance > RING_RADII.hours.min && distance < RING_RADII.hours.max) return 'hours';
    if (distance > RING_RADII.minutes.min && distance < RING_RADII.minutes.max) return 'minutes';
    if (distance > RING_RADII.seconds.min && distance < RING_RADII.seconds.max) return 'seconds';
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    const ring = getRingFromDistance(distance);

    if (ring) {
      const angle = getAngleFromPoint(centerX, centerY, x, y);
      setDragState({
        isDragging: true,
        ring,
        startAngle: angle,
        currentAngle: angle,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !dragState.ring) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const angle = getAngleFromPoint(centerX, centerY, x, y);

    const angleDiff = angle - dragState.startAngle;

    setOffsets((prev) => ({
      ...prev,
      [dragState.ring as string]: angleDiff,
    }));

    setDragState((prev) => ({
      ...prev,
      currentAngle: angle,
    }));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

    const ring = getRingFromDistance(distance);

    if (ring) {
      const angle = getAngleFromPoint(centerX, centerY, x, y);
      setDragState({
        isDragging: true,
        ring,
        startAngle: angle,
        currentAngle: angle,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!dragState.isDragging || !dragState.ring || e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const angle = getAngleFromPoint(centerX, centerY, x, y);

    const angleDiff = angle - dragState.startAngle;

    setOffsets((prev) => ({
      ...prev,
      [dragState.ring as string]: angleDiff,
    }));

    setDragState((prev) => ({
      ...prev,
      currentAngle: angle,
    }));
  };

  const handleTouchEnd = () => {
    setDragState({
      isDragging: false,
      ring: null,
      startAngle: 0,
      currentAngle: 0,
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      ring: null,
      startAngle: 0,
      currentAngle: 0,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get current time values
    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const day = time.getDay();
    const month = time.getMonth();
    const date = time.getDate();

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#1a1a1a' : '#f5f5f5';
    const textColor = isDark ? '#e0e0e0' : '#2a2a2a';
    const ringColor = isDark ? '#2a2a2a' : '#d0d0d0';
    const highlightColor = isDark ? '#4ade80' : '#22c55e';

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Helper function to draw a ring
    const drawRing = (
      radius: number,
      items: string[],
      currentIndex: number,
      offset: number,
      highlightCurrent: boolean = true
    ) => {
      const anglePerItem = (Math.PI * 2) / items.length;
      
      items.forEach((item, index) => {
        const angle = index * anglePerItem - Math.PI / 2 + offset;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);

        if (highlightCurrent && index === currentIndex) {
          ctx.fillStyle = highlightColor;
          ctx.font = 'bold 16px Arial';
        } else {
          ctx.fillStyle = isDark ? '#606060' : '#888888';
          ctx.font = '13px Arial';
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item, 0, 0);
        ctx.restore();
      });

      // Draw ring circle
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Draw outermost ring - Date (1-31)
    const dates = Array.from({ length: 31 }, (_, i) => String(i + 1));
    drawRing(255, dates, date - 1, offsets.date);

    // Draw month ring
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    drawRing(225, months, month, offsets.month);

    // Draw day of week ring
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    drawRing(195, days, day, offsets.day);

    // Draw hours ring (12, 1, 2, 3, ..., 11)
    const hourLabels = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i));
    // Convert hours (0-11) to index: hour 0 (12 AM) -> index 0, hour 1 -> index 1, etc.
    const hourIndex = hours === 0 ? 0 : hours;
    drawRing(165, hourLabels, hourIndex, offsets.hours);

    // Draw minutes ring (0-59, show every 5)
    const minuteLabels = Array.from({ length: 12 }, (_, i) => String(i * 5));
    drawRing(135, minuteLabels, Math.floor(minutes / 5), offsets.minutes);

    // Draw seconds ring (0-59, show every 5)
    const secondLabels = Array.from({ length: 12 }, (_, i) => String(i * 5));
    drawRing(105, secondLabels, Math.floor(seconds / 5), offsets.seconds);

    // Draw center circle
    ctx.fillStyle = isDark ? '#2a2a2a' : '#d0d0d0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
    ctx.fill();

    // Draw clock hands
    const hoursAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180) + offsets.hours;
    const minutesAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180) + offsets.minutes;

    // Hour hand
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(hoursAngle) * 45,
      centerY + Math.sin(hoursAngle) * 45
    );
    ctx.stroke();

    // Minute hand
    ctx.strokeStyle = textColor;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(minutesAngle) * 65,
      centerY + Math.sin(minutesAngle) * 65
    );
    ctx.stroke();

    // Center dot
    ctx.fillStyle = highlightColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fill();
  }, [time, offsets]);

  return (
    <div className="flex justify-center items-center py-8">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="cursor-pointer"
        style={{ touchAction: 'none' }}
        aria-label="Interactive clock with draggable rings showing current time. Click and drag any ring to rotate it."
        role="img"
      />
    </div>
  );
};

export default ModernClock;
