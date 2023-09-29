import { createContext, useContext, useState } from "react";

type Props = {
  children?: React.ReactNode;
};

const Context = createContext<ITimesContext>({} as ITimesContext);

interface ITimesContext {
  sliderValue: number | null;
  setSliderValue: (value: number | null) => void;
}

export const TimeContext = ({ children }: Props) => {
  const [sliderValue, setSliderValue] = useState<number | null>(10);

  return (
    <Context.Provider
      value={{
        sliderValue,
        setSliderValue,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTime = () => {
  return useContext(Context);
};
