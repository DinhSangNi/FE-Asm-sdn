import { Loader2 } from 'lucide-react';

type Props = {
  className?: string;
};

export default function Spinner({ className }: Props) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  );
}
