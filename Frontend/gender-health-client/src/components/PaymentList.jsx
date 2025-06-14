import { useEffect, useState } from "react"
import { getPackagesAxios } from "../api/package";
import { type } from "@testing-library/user-event/dist/type";
import { formatNumberWithDot } from "../helper/helper";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

export default function PackageList() {
    const [packages, setpackages] = useState([])

    const [modalIsOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    function openModal() {
        setIsOpen(true);
    }

    // function afterOpenModal() {
    //     // references are now sync'd and can be accessed.
    //     subtitle.style.color = '#f00';
    // }

    function closeModal() {
        setIsOpen(false);
    }

    const getPackages = async () => {
        try {
            const { data } = await getPackagesAxios()
            console.log(data)
            setpackages(data)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPackages()
    }, [])

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    return (


        <div className="px-20 py-20">
            <div className="mb-6">
                <input
                    type="text"
                    readOnly
                    value="Please select a package below to continue your payment."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                />
            </div>
            <div className="grid grid-cols-3 gap-10">
                {packages.map((pm, index) => <div key={index} className="rounded-md px-5 py-3 shadow-xl col-span-1">
                    <h2 className="text-2xl font-bold">{pm.packageName}</h2>
                    <p className="text-lg font-semibold mt-2">Price: {formatNumberWithDot(pm.totalPrice || 0)} VNĐ</p>
                    <button onClick={() => {
                        console.log(localStorage.getItem('user'));
                        openModal();
                    }} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Buy Now
                    </button>
                </div>)}
            </div>

            <div
                className={`${modalIsOpen ? 'top-[40%] left-[40%] rounded-md border border-neutral-300 px-5 py-5 fixed inset-0 z-50 flex items-center justify-center bg-white w-80 h-52' : 'hidden'}`}
                //onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <div className="mb-3">Do you sure to buy this package ?</div>
                    <div className="flex justify-end">
                        <button onClick={() => navigate('/PaymentPage')} className="rounded-md px-5 py-2 bg-green-400 text-white mr-3">Yes</button>
                        <button onClick={closeModal} className="rounded-md px-5 py-2 bg-red-400 text-white">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
