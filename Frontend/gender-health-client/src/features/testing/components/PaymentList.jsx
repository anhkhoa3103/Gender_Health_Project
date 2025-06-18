import { useEffect, useState } from "react";
import { getPackagesAxios } from "../../../api/package";
import { formatNumberWithDot } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import TestTypeTable from "./TestTypeTable";

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
    <div className="px-20 py-20">
      <div className="grid grid-cols-3 gap-10">
        {packages.map((pm, index) => (
          <div
            key={index}
            className="rounded-md px-5 py-3 shadow-xl col-span-1"
          >
            <h2 className="text-2xl font-bold">{pm.packageName}</h2>
            <p className="text-lg font-semibold mt-2">
              Price: {formatNumberWithDot(pm.totalPrice || 0)} VNĐ
            </p>
            <button
              onClick={() =>
                navigate("/payment-package", { state: { selectedPackage: pm } })
              }
              className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
