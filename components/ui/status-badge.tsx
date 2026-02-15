import { Badge } from "@/components/ui/badge";
import { CheckIcon, HourglassIcon } from "@/components/ui/status-icons";

interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    switch (status) {
        case "Uploaded":
            return (
                <Badge className="bg-[#F0FDF4] text-[#016630] hover:bg-[#F0FDF4] border border-[#B9F8CF] rounded-[6px]">
                    <CheckIcon className="mr-1" />
                    Uploaded
                </Badge>
            );
        case "Pending":
            return (
                <Badge className="bg-[#FFF8F1] text-[#B43403] hover:bg-[#FFF8F1] border border-[#FCD9BD] rounded-[6px]  ">
                    <HourglassIcon className="mr-1" />
                    Processing
                </Badge>
            );
        case "Error":
            return (
                <Badge className="bg-[#FEF0F2] text-[#C70036] hover:bg-[#FEF0F2] border border-[#FFCCD3] rounded-[6px]  ">
                    <HourglassIcon className="mr-1" color="#DC2626" />
                    Failed
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}