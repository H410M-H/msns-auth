import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import Link from "next/link"
import { School } from "lucide-react"

// improved homepage
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="w-full space-y-4">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <School className="h-12 w-12 text-primary animate-bounce" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Learning Management System
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
              Next-generation educational platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full h-11">
              <Link href="/sign-in" className="text-lg">
                Get Started
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full h-11">
              <Link href="/about" className="text-lg">
                Learn More
              </Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground/70">
            Empower your educational journey
          </CardFooter>
        </Card>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          {['Interactive Lessons', 'Progress Tracking', 'Collaboration'].map((feature) => (
            <div key={feature} className="p-4 bg-background rounded-lg border shadow-sm">
              <p className="text-sm font-medium text-primary">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

