import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTimeUntilNewYear } from '@/utils/festive';
import { Sparkles } from 'lucide-react';

const NewYearCountdown = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNewYear());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNewYear());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    navigate('/newyear');
  };

  if (timeLeft.hasArrived) {
    return (
      <div 
        onClick={handleClick}
        className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse"
      >
        <div className="flex items-center gap-2 justify-center">
          <Sparkles className="w-5 h-5" />
          <span className="font-bold text-lg">🎉 Happy New Year! Click to Celebrate 🎉</span>
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2 text-center items-center">
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.days}</span>
            <span className="text-xs opacity-80">Days</span>
          </div>
          <span className="text-2xl font-bold opacity-60">:</span>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs opacity-80">Hours</span>
          </div>
          <span className="text-2xl font-bold opacity-60">:</span>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.minutes}</span>
            <span className="text-xs opacity-80">Minutes</span>
          </div>
          <span className="text-2xl font-bold opacity-60">:</span>
          <div className="flex flex-col">
            <span className="text-3xl font-bold">{timeLeft.seconds}</span>
            <span className="text-xs opacity-80">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewYearCountdown;
