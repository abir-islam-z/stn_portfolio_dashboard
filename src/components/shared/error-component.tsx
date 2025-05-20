import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface ErrorComponentProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function ErrorComponent({
  title,
  message,
  onRetry,
}: ErrorComponentProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight neon-text">{title}</h1>
      <Card className="dashboard-card">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="mb-4 text-destructive">{message}</p>
            <Button onClick={onRetry}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
