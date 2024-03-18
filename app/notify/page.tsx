"use client";
import { useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { Database } from "@/types/supabasetype";
import DateFormatter from "@/components/date";

export default function Notify() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const notificationID = searchParams.get("id");
  const [notifications, setNotifications] = useState<any>({});

  useEffect(() => {
    updateUnreadNotification();
    getNotification();
  }, []);

  const getNotification = async () => {
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select()
      .eq("id", notificationID);

    if (error) {
      console.log(error);
      return;
    }

    if (notifications.length > 0) {
      setNotifications(notifications[0]);
    }
  };

  const updateUnreadNotification = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user === null) return;

    const timeStamp = new Date().toISOString();
    await supabase
      .from("notificationmanager")
      .update({ read_at: timeStamp })
      .eq("uid", user.id)
      .eq("notificationid", notificationID);
  };
  return (
    <div className="pt-10 w-2/4 m-auto">
      <p>
        <DateFormatter timestamp={notifications.created_at}></DateFormatter>
      </p>
      <p>{notifications.message}</p>
    </div>
  );
}
