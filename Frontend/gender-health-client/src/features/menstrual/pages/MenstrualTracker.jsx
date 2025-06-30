import { useParams } from "react-router-dom";
import React, { useState,useContext } from "react";
import SmartMenstrualTracker from "../components/SmartMenstrualTracker";
import { AuthContext } from '../../../context/AuthContext';
import LoadingOverlay from "../../components/LoadingOverlay";


export default function MenstrualPage() {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [loading, setLoading] = useState(true);
  return (
    <>
      <SmartMenstrualTracker customerId={Number(userId)} />;
    </>
  )
}
