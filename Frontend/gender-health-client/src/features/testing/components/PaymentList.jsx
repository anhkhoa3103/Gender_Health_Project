import { useEffect, useState } from "react";
import { getPackagesAxios } from "../../../api/package";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import TestTypeTable from "./TestTypeTable";
import "../styles/Packages.css"; // Or your new Packages.css

export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPackages = async () => {
      try {
        const { data } = await getPackagesAxios();
        setPackages(data);
      } catch (error) {
        console.log(error);
      }
    };
    getPackages();
  }, []);

  return (
    <div className="package-list-container">
      <div className="package-grid">
        {packages.map((pm, index) => (
          <div key={index} className="package-card">
            <h2>{pm.packageName}</h2>
            <p className="package-price">
              Price: {formatNumberWithDot(pm.totalPrice || 0)} VNĐ
            </p>
            <button
              onClick={() =>
                navigate("/payment-package", { state: { selectedPackage: pm } })
              }
              className="buy-btn"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
      {/* If you want to keep TestTypeTable, it will appear below */}
      <TestTypeTable />
    </div>
  );
}
