import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Props = {
  onChange: (value: string) => void;
  sortOption: string;
};

const SORT_OPTIONS = [
  {
    label: "Best match",
    value: "bestMatch",
  },
  {
    label: "Delivery price",
    value: "deliveryPrice",
  },
  {
    label: "Estimated delivery time",
    value: "estimatedDeliveryTime",
  },
];

const SortOptionDropdown = ({ onChange, sortOption }: Props) => {
  const selectedSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label || SORT_OPTIONS[0].label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer border border-gray-500 rounded-md px-4 py-2 text-sm font-medium text-gray-700"
      >
        Sort by: {selectedSortLabel}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {
          SORT_OPTIONS.map((option) => (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => onChange(option.value)}
              key={option.value}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptionDropdown;