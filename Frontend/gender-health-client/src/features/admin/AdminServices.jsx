import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, Search } from 'lucide-react';
import Sidebar from '../components/sidebar'; // sidebar bên trái
import './styles/AdminServices.css';

const AdminServices = () => {
    const [packages, setPackages] = useState([]);
    const [testTypes, setTestTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        packageName: '',
        testIds: []
    });
    const [formErrors, setFormErrors] = useState({});

    // API base URL
    const API_BASE_URL = 'http://localhost:8080/api/admin/packages';

    // Fetch data
    useEffect(() => {
        fetchPackages();
        fetchTestTypes();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch(
                API_BASE_URL,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setPackages(data);
            } else {
                console.error('Failed to fetch packages');
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTestTypes = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/test-types`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTestTypes(data);
            }
        } catch (error) {
            console.error('Error fetching test types:', error);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Calculate total price
    const calculateTotalPrice = (selectedTestIds) => {
        return selectedTestIds.reduce((total, testId) => {
            const test = testTypes.find(t => t.testId === testId);
            return total + (test ? test.price : 0);
        }, 0);
    };

    // Filter packages
    const filteredPackages = packages.filter(pkg =>
        pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.packageName.trim()) {
            errors.packageName = 'Tên package không được để trống';
        }

        if (formData.testIds.length === 0) {
            errors.testIds = 'Phải chọn ít nhất 1 test';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle test selection
    const handleTestSelection = (testId) => {
        setFormData(prev => ({
            ...prev,
            testIds: prev.testIds.includes(testId)
                ? prev.testIds.filter(id => id !== testId)
                : [...prev.testIds, testId]
        }));

        // Clear test selection error
        if (formErrors.testIds) {
            setFormErrors(prev => ({
                ...prev,
                testIds: ''
            }));
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            packageName: '',
            testIds: []
        });
        setFormErrors({});
    };

    // Open modals
    const openCreateModal = () => {
        resetForm();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (pkg) => {
        setSelectedPackage(pkg);
        setFormData({
            packageName: pkg.packageName,
            testIds: pkg.testTypes.map(test => test.testId)
        });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const openViewModal = (pkg) => {
        setSelectedPackage(pkg);
        setIsViewModalOpen(true);
    };

    // Close modals
    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setSelectedPackage(null);
        resetForm();
    };

    // Create package
    const handleCreatePackage = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    packageName: formData.packageName.trim(),
                    testIds: formData.testIds
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                await fetchPackages();
                closeModals();
                alert('Tạo package thành công!');
            } else {
                alert(result.message || 'Có lỗi xảy ra khi tạo package');
            }
        } catch (error) {
            console.error('Error creating package:', error);
            alert('Có lỗi xảy ra khi tạo package');
        }
    };

    // Update package
    const handleUpdatePackage = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(
                `${API_BASE_URL}/${selectedPackage.packageId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    },
                    body: JSON.stringify({
                        packageName: formData.packageName.trim(),
                        testIds: formData.testIds
                    })
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                await fetchPackages();
                closeModals();
                alert('Cập nhật package thành công!');
            } else {
                alert(result.message || 'Có lỗi xảy ra khi cập nhật package');
            }
        } catch (error) {
            console.error('Error updating package:', error);
            alert('Có lỗi xảy ra khi cập nhật package');
        }
    };

    // Delete package
    const handleDeletePackage = async (packageId, packageName) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa package "${packageName}"?`)) {
            return;
        }

        try {

            const response = await fetch(
                `${API_BASE_URL}/${packageId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("managementToken")}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok && result.success) {
                await fetchPackages();
                alert('Xóa package thành công!');
            } else {
                alert(result.message || 'Có lỗi xảy ra khi xóa package');
            }
        } catch (error) {
            console.error('Error deleting package:', error);
            alert('Có lỗi xảy ra khi xóa package');
        }
    };

    if (loading) {
        return (
            <div className="admin-services">
                <div className="loading">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-services">
                <div className="admin-services-header">
                    <h1>Quản lý Package</h1>
                    <button className="btn-primary" onClick={openCreateModal}>
                        <Plus size={20} />
                        Tạo Package Mới
                    </button>
                </div>

                {/* Search */}
                <div className="search-section">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm package..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Package List */}
                <div className="packages-grid">
                    {filteredPackages.length === 0 ? (
                        <div className="no-data">
                            {searchTerm ? 'Không tìm thấy package nào' : 'Chưa có package nào'}
                        </div>
                    ) : (
                        filteredPackages.map(pkg => (
                            <div key={pkg.packageId} className="package-card">
                                <div className="package-header">
                                    <h3>{pkg.packageName}</h3>
                                    <div className="package-actions">
                                        <button
                                            className="btn-icon btn-view"
                                            onClick={() => openViewModal(pkg)}
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => openEditModal(pkg)}
                                            title="Chỉnh sửa"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => handleDeletePackage(pkg.packageId, pkg.packageName)}
                                            title="Xóa"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="package-info">
                                    <div className="price">
                                        <strong>{formatCurrency(pkg.totalPrice)}</strong>
                                    </div>
                                    <div className="test-count">
                                        {pkg.testTypes.length} test{pkg.testTypes.length > 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="package-tests">
                                    {pkg.testTypes.slice(0, 3).map(test => (
                                        <span key={test.testId} className="test-tag">
                                            {test.testName}
                                        </span>
                                    ))}
                                    {pkg.testTypes.length > 3 && (
                                        <span className="test-tag more">
                                            +{pkg.testTypes.length - 3} khác
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Create Modal */}
                {isCreateModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Tạo Package Mới</h2>
                                <button className="btn-close" onClick={closeModals}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên Package *</label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên package"
                                        className={formErrors.packageName ? 'error' : ''}
                                    />
                                    {formErrors.packageName && (
                                        <span className="error-message">{formErrors.packageName}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Chọn Tests *</label>
                                    {formErrors.testIds && (
                                        <span className="error-message">{formErrors.testIds}</span>
                                    )}
                                    <div className="test-selection">
                                        {testTypes.map(test => (
                                            <div key={test.testId} className="test-item">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.testIds.includes(test.testId)}
                                                        onChange={() => handleTestSelection(test.testId)}
                                                    />
                                                    <span className="test-info">
                                                        <strong>{test.testName}</strong>
                                                        <span className="test-price">{formatCurrency(test.price)}</span>
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {formData.testIds.length > 0 && (
                                    <div className="total-price">
                                        <strong>Tổng giá: {formatCurrency(calculateTotalPrice(formData.testIds))}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={closeModals}>
                                    Hủy
                                </button>
                                <button className="btn-primary" onClick={handleCreatePackage}>
                                    <Save size={16} />
                                    Tạo Package
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Chỉnh sửa Package</h2>
                                <button className="btn-close" onClick={closeModals}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tên Package *</label>
                                    <input
                                        type="text"
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên package"
                                        className={formErrors.packageName ? 'error' : ''}
                                    />
                                    {formErrors.packageName && (
                                        <span className="error-message">{formErrors.packageName}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Chọn Tests *</label>
                                    {formErrors.testIds && (
                                        <span className="error-message">{formErrors.testIds}</span>
                                    )}
                                    <div className="test-selection">
                                        {testTypes.map(test => (
                                            <div key={test.testId} className="test-item">
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.testIds.includes(test.testId)}
                                                        onChange={() => handleTestSelection(test.testId)}
                                                    />
                                                    <span className="test-info">
                                                        <strong>{test.testName}</strong>
                                                        <span className="test-price">{formatCurrency(test.price)}</span>
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {formData.testIds.length > 0 && (
                                    <div className="total-price">
                                        <strong>Tổng giá: {formatCurrency(calculateTotalPrice(formData.testIds))}</strong>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn-secondary" onClick={closeModals}>
                                    Hủy
                                </button>
                                <button className="btn-primary" onClick={handleUpdatePackage}>
                                    <Save size={16} />
                                    Cập nhật
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {isViewModalOpen && selectedPackage && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Chi tiết Package</h2>
                                <button className="btn-close" onClick={closeModals}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="package-details">
                                    <div className="detail-row">
                                        <label>Tên Package:</label>
                                        <span>{selectedPackage.packageName}</span>
                                    </div>

                                    <div className="detail-row">
                                        <label>Tổng giá:</label>
                                        <span className="price-highlight">
                                            {formatCurrency(selectedPackage.totalPrice)}
                                        </span>
                                    </div>

                                    <div className="detail-row">
                                        <label>Số lượng tests:</label>
                                        <span>{selectedPackage.testTypes.length} tests</span>
                                    </div>

                                    <div className="tests-list">
                                        <label>Danh sách tests:</label>
                                        <div className="tests-grid">
                                            {selectedPackage.testTypes.map(test => (
                                                <div key={test.testId} className="test-detail-item">
                                                    <span className="test-name">{test.testName}</span>
                                                    <span className="test-price">{formatCurrency(test.price)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button className="btn-primary" onClick={closeModals}>
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default AdminServices;