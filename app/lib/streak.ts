import { supabase } from "./supabase";

export async function updateStreak(userId: string) {
  const today = new Date().toISOString().split("T")[0];
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, last_active_date")
    .eq("id", userId)
    .single();

  if (!profile) return 0;

  const lastActive = profile.last_active_date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = profile.streak || 0;

  if (lastActive === today) {
    return newStreak;
  } else if (lastActive === yesterdayStr) {
    newStreak = newStreak + 1;
  } else {
    newStreak = 1;
  }

  await supabase
    .from("profiles")
    .update({ streak: newStreak, last_active_date: today })
    .eq("id", userId);

  return newStreak;
}

export async function getStreak(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("streak")
    .eq("id", userId)
    .single();
  return data?.streak || 0;
}
