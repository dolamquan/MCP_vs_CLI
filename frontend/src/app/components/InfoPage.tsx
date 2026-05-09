import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type InfoPageProps = {
  title: string;
  description: string;
};

export function InfoPage({ title, description }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/[0.02] border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-base text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link to="/">
            <Button className="bg-green-500 hover:bg-green-600 text-black">
              Back Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 hover:bg-white/10">
              Open Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
