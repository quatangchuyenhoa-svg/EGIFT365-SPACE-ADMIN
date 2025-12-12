import '@/app/globals.css';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-68px)] items-center justify-center p-6 bg-gradient-to-br from-muted/30 via-background to-muted/30">
      <Card className="relative w-full max-w-md overflow-hidden border border-border/50 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/40 text-destructive shadow-inner">
            <TriangleAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-semibold text-foreground">
            Page not found
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1">
            The page you are looking for doesn’t exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            className="mt-4 w-full bg-primary text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-[2px]"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      </Card>
    </div>
  );
}
