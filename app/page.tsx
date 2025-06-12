import { redirect } from "next/navigation";

export default function Home() {
  redirect("/en"); // Redirect to English if no locale match
  return null;
}
