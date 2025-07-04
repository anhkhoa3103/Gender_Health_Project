import React, { useState } from 'react';
import { Plus, Save, Trash2, Edit2, X, Search, Eye } from 'lucide-react';
import '../styles/AdminServices.css';

const TestTypeManagerTab = ({ testTypes, fetchTestTypes, formatCurrency }) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [formData, setFormData] = useState({ testName: '', price: '', threshold: '' });
    const [formErrors, setFormErrors] = useState({});
    const [selectedTest, setSelectedTest] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = 'http://localhost:8080/api/admin/test-types';

    // Filter and sort test types based on search term and ID
    const filteredTestTypes = testTypes
        .filter(test =>
            test.testName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.testId - b.testId);

    const openCreateModal = () => {
        setFormData({ testName: '', price: '', threshold: '' });
        setFormErrors({});
        setIsCreateModalOpen(true);
    };

    const openEditModal = (test) => {
        setSelectedTest(test);
        setFormData({ testName: test.testName, price: test.price, threshold: test.threshold });
        setFormErrors({});
        setIsEditModalOpen(true);
    };

    const openViewModal = (test) => {
        setSelectedTest(test);
        setIsViewModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsEditModalOpen(false);
        setIsViewModalOpen(false);
        setSelectedTest(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.testName.trim()) errors.testName = 'Tên test không được để trống';
        if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
            errors.price = 'Giá phải là số dương';
        }
        if (!formData.threshold || isNaN(formData.threshold) || Number(formData.threshold) < 0) {
            errors.threshold = 'Threshold phải là số không âm';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('managementToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testName: formData.testName.trim(),
                    price: parseFloat(formData.price),
                    threshold: parseFloat(formData.threshold),
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                await fetchTestTypes();
                closeModals();
                alert('Tạo test type thành công!');
            } else alert(result.message || 'Tạo test type thất bại');
        } catch (err) {
            alert('Lỗi tạo test type');
            console.error(err);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${selectedTest.testId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('managementToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testName: formData.testName.trim(),
                    price: parseFloat(formData.price),
                    threshold: parseFloat(formData.threshold),
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                await fetchTestTypes();
                closeModals();
                alert('Cập nhật test type thành công!');
            } else alert(result.message || 'Cập nhật thất bại');
        } catch (err) {
            alert('Lỗi cập nhật test type');
            console.error(err);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa test type "${name}"?`)) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('managementToken')}`,
                },
            });
            const result = await response.json();
            if (response.ok && result.success) {
                await fetchTestTypes();
                alert('Xóa test type thành công!');
            } else alert(result.message || 'Xóa thất bại');
        } catch (err) {
            alert('Lỗi xóa test type');
            console.error(err);
        }
    };

    return (
        <div className="test-type-manager">
            <div className="admin-services-header">
                <h1>Quản lý Test Type</h1>
                <button className="btn-primary" onClick={openCreateModal}>
                    <Plus size={20} />
                    Tạo Test Type Mới
                </button>
            </div>

            {/* Search */}
            <div className="search-section">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm test type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Test Type List */}
            <div className="packages-grid">
                {filteredTestTypes.length === 0 ? (
                    <div className="no-data">
                        {searchTerm ? 'Không tìm thấy test type nào' : 'Chưa có test type nào'}
                    </div>
                ) : (
                    filteredTestTypes.map(test => (
                        <div key={test.testId} className="package-card">
                            <div className="package-header">
                                <h3>{test.testName}</h3>
                                <div className="package-actions">
                                    <button
                                        className="btn-icon btn-view"
                                        onClick={() => openViewModal(test)}
                                        title="Xem chi tiết"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className="btn-icon btn-edit"
                                        onClick={() => openEditModal(test)}
                                        title="Chỉnh sửa"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="btn-icon btn-delete"
                                        onClick={() => handleDelete(test.testId, test.testName)}
                                        title="Xóa"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="package-info">
                                <div className="price">
                                    <strong>{formatCurrency(test.price)}</strong>
                                </div>
                                <div className="test-count">
                                    Threshold: {test.threshold}
                                </div>
                            </div>

                            <div className="package-tests">
                                <span className="test-tag">
                                    ID: {test.testId}
                                </span>
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
                            <h2>Tạo Test Type Mới</h2>
                            <button className="btn-close" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tên Test *</label>
                                <input
                                    type="text"
                                    name="testName"
                                    value={formData.testName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên test"
                                    className={formErrors.testName ? 'error' : ''}
                                />
                                {formErrors.testName && (
                                    <span className="error-message">{formErrors.testName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Giá *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Nhập giá"
                                    className={formErrors.price ? 'error' : ''}
                                />
                                {formErrors.price && (
                                    <span className="error-message">{formErrors.price}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Threshold *</label>
                                <input
                                    type="number"
                                    name="threshold"
                                    value={formData.threshold}
                                    onChange={handleInputChange}
                                    placeholder="Nhập threshold"
                                    className={formErrors.threshold ? 'error' : ''}
                                />
                                {formErrors.threshold && (
                                    <span className="error-message">{formErrors.threshold}</span>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModals}>
                                Hủy
                            </button>
                            <button className="btn-primary" onClick={handleCreate}>
                                <Save size={16} />
                                Tạo Test Type
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
                            <h2>Chỉnh sửa Test Type</h2>
                            <button className="btn-close" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Tên Test *</label>
                                <input
                                    type="text"
                                    name="testName"
                                    value={formData.testName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên test"
                                    className={formErrors.testName ? 'error' : ''}
                                />
                                {formErrors.testName && (
                                    <span className="error-message">{formErrors.testName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Giá *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="Nhập giá"
                                    className={formErrors.price ? 'error' : ''}
                                />
                                {formErrors.price && (
                                    <span className="error-message">{formErrors.price}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Threshold *</label>
                                <input
                                    type="number"
                                    name="threshold"
                                    value={formData.threshold}
                                    onChange={handleInputChange}
                                    placeholder="Nhập threshold"
                                    className={formErrors.threshold ? 'error' : ''}
                                />
                                {formErrors.threshold && (
                                    <span className="error-message">{formErrors.threshold}</span>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeModals}>
                                Hủy
                            </button>
                            <button className="btn-primary" onClick={handleUpdate}>
                                <Save size={16} />
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedTest && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Chi tiết Test Type</h2>
                            <button className="btn-close" onClick={closeModals}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="package-details">
                                <div className="detail-row">
                                    <label>ID:</label>
                                    <span>{selectedTest.testId}</span>
                                </div>

                                <div className="detail-row">
                                    <label>Tên Test:</label>
                                    <span>{selectedTest.testName}</span>
                                </div>

                                <div className="detail-row">
                                    <label>Giá:</label>
                                    <span className="price-highlight">
                                        {formatCurrency(selectedTest.price)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <label>Threshold:</label>
                                    <span>{selectedTest.threshold}</span>
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
    );
};

export default TestTypeManagerTab;