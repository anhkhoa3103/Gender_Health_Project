import { useEffect } from "react";

const LogoutManagement = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                const token = localStorage.getItem("managementToken");

                await fetch("http://localhost:8080/api/auth/logout/management", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Xóa token và role khỏi localStorage
                localStorage.removeItem("managementToken");
                localStorage.removeItem("managementRole");
                localStorage.removeItem("userId");

                // Chuyển hướng về trang login quản lý
                window.location.href = "/loginmanagement";
            } catch (error) {
                console.error("Logout thất bại:", error);
                // Vẫn redirect để đảm bảo người dùng không bị kẹt
                window.location.href = "/loginmanagement";
            }
        };

        logout();
    }, []);

    return <p>Đang đăng xuất...</p>;
};

export default LogoutManagement;
