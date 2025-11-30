import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Status } from "@/types/data";

interface SearchFilterProps {
  onSearchChange: (search: string) => void;
  onStatusFilter: (status: Status | "All") => void;
}
/*
 * this is the search filter component that is used to filter the processes based on the search query and status globally
 */
export function SearchFilter({
  onSearchChange,
  onStatusFilter,
}: SearchFilterProps) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search processes, subprocesses, or tasks..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2 sm:w-48">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select onValueChange={onStatusFilter} defaultValue="All">
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Needs Fix">Needs Fix</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
