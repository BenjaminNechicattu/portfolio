/**
 * Utility functions for festive New Year features
 * Active from December 20 to January 5 every year
 */

export const isFestiveSeasonActive = (): boolean => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (0 = January, 11 = December)
  const day = now.getDate();

  // December 20-31 OR January 1-5
  return (month === 11 && day >= 20) || (month === 0 && day <= 5);
};

export const getNewYearDate = (): Date => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const month = now.getMonth();
  
  // If we're in December, target next year's New Year
  // If we're in January 1-5, we still show next year's date but mark as arrived
  const targetYear = month === 11 ? currentYear + 1 : currentYear;
  
  return new Date(targetYear, 0, 1, 0, 0, 0); // January 1st, 00:00:00
};

export const getTimeUntilNewYear = () => {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  
  // If we're in January 1-5, New Year has already arrived
  if (month === 0 && day <= 5) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasArrived: true };
  }
  
  const newYear = getNewYearDate();
  const diff = newYear.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasArrived: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, hasArrived: false };
};
