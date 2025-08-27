import { DateRange } from "../../models";
import MainButton from "../buttons/main-button";
import { useDashboard } from "../../context";
import { toast } from "react-hot-toast";

const Header = () => {
  const { state, dispatch } = useDashboard();
  const currentDateRange = state.selectedDateRange;

  const handleDateRangeChange = (range: DateRange) => {
    dispatch({ type: "SET_DATE_RANGE", payload: range });

    const rangeLabels = {
      [DateRange.SEVEN_DAYS]: "7 days",
      [DateRange.FOURTEEN_DAYS]: "14 days",
      [DateRange.THIRTY_DAYS]: "30 days",
    };

    toast.success(`Date range updated to ${rangeLabels[range]}`, {
      duration: 2000,
      position: "top-right",
    });
  };

  const dateRangeOptions = [
    { label: "7d", value: DateRange.SEVEN_DAYS },
    { label: "14d", value: DateRange.FOURTEEN_DAYS },
    { label: "30d", value: DateRange.THIRTY_DAYS },
  ];

  return (
    <header className="bg-white backdrop-blur-[10px] py-2 px-3 shadow-sm  sticky top-0  z-10 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="font-bold text-3xl hidden min-[750px]:block">
            SupplySight
          </h1>
        </div>

        <div className="flex items-center gap-[10px]">
          {dateRangeOptions.map((option) => (
            <MainButton
              key={option.value}
              isActive={currentDateRange === option.value}
              onClick={() => handleDateRangeChange(option.value)}
            >
              {option.label}
            </MainButton>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
