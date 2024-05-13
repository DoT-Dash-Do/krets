import React from 'react'
import { Card,CardContent,CardDescription,CardTitle } from '@/components/ui/card'
export default function NotFound() {
  return (
    <Card>
        <CardTitle>
            404 Not Found
        </CardTitle>
        <CardContent>
            <img src='osaka.gif'></img>
        </CardContent>
        <CardDescription>
            The page you are trying to find either does not exists or you donot have rights to the page
        </CardDescription>
    </Card>
  )
}
