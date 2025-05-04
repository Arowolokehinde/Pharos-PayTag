import { FC } from "react";
import { Clock, Activity as ActivityIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Activity {
    id: string;
    title: string;
    description: string;
    time: string;
}

interface RecentActivitiesCardProps {
    recentActivities: Activity[];
}

export const RecentActivitiesCard: FC<RecentActivitiesCardProps> = ({
    recentActivities
}) => {
    return (
        <Card className="overflow-hidden border-0 shadow-md">
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-teal-500 to-green-500"></div>

            <CardHeader className="flex flex-row items-start gap-3 bg-white dark:bg-slate-950">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center text-white">
                    <ActivityIcon className="h-5 w-5" />
                </div>
                <div>
                    <CardTitle className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">Recent Activities</CardTitle>
                    <CardDescription>Latest actions and updates</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="bg-white dark:bg-slate-900 pt-4">
                <div className="space-y-5">
                    {recentActivities.map((activity, index) => (
                        <div key={activity.id} className="flex">
                            <div className="mr-4 flex flex-col items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-500 text-white">
                                    <Clock className="h-5 w-5" />
                                </div>
                                {index < recentActivities.length - 1 && (
                                    <div className="h-full w-px bg-slate-200 dark:bg-slate-700"></div>
                                )}
                            </div>
                            <div className={index < recentActivities.length - 1 ? "pb-5" : ""}>
                                <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{activity.description}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};