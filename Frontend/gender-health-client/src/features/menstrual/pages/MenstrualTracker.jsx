import { useParams } from "react-router-dom";
import React, { useContext } from "react";
import SmartMenstrualTracker from "../components/SmartMenstrualTracker";
import { AuthContext } from '../../../context/AuthContext';


export default function MenstrualPage() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  return <SmartMenstrualTracker customerId={Number(userId)} />;
}
