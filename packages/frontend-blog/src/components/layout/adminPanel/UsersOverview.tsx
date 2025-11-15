import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User as UserType } from "@prisma/client";
import getStartofWeek from "@/utils/getStartofWeek";
import { useMemo } from "react";

type UsersOverviewPropTypes = {
  allUsers: UserType[] | [];
};

const UsersOverview = ({ allUsers }: UsersOverviewPropTypes) => {
  const usersThisWeek = useMemo(() => {
    const startofWeek = getStartofWeek(new Date());
    return allUsers.filter((user) => new Date(user.createdAt) >= startofWeek);
  }, [allUsers]);

  const newUsersCount = usersThisWeek.length;

  return (
    <Card className="fade-in delay-3">
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{allUsers && allUsers.length}</p>
        <Badge variant="secondary" className="mt-2">
          +{newUsersCount} new this week
        </Badge>
      </CardContent>
    </Card>
  );
};

export default UsersOverview;
