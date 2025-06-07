import { useParams } from "react-router-dom";
import SmartMenstrualTracker from "../components/SmartMenstrualTracker";

export default function MenstrualPage() {
  const { userId } = useParams();
  return <SmartMenstrualTracker customerId={Number(userId)} />;
}
