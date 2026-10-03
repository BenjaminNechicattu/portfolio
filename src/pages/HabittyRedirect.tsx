import { useEffect } from "react";

const HabittyRedirect = () => {
  useEffect(() => {
    window.location.replace("/habitty/index.html");
  }, []);

  return null;
};

export default HabittyRedirect;
