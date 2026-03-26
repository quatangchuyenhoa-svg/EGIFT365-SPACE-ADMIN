import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface InfoCardProps {
  title: string;
  description?: string;
  className?: string;
  rightContent?: React.ReactNode;
}

export function InfoCard({ title, description, className, rightContent }: InfoCardProps) {
  return (
    <Card
      className={`
        bg-card border border-border/60 shadow-md hover:shadow-lg
        dark:bg-[#1E1E1E]/90 dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]
        transition-all duration-300
        ${className || ''}
      `}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold underline">{title}</CardTitle>
            {description && (
              <CardDescription className="text-muted-foreground mt-2">
                {description}
              </CardDescription>
            )}
          </div>

          {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
        </div>
      </CardHeader>
    </Card>
  );
}
