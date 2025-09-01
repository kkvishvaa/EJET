import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
}

export default function FeatureCard({ icon, title, description, gradient = "from-primary to-accent" }: FeatureCardProps) {
  return (
    <Card className="text-center shadow-sm border border-border hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
