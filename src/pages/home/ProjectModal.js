import axiosClient from '../../api/axiosClient';
import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Typography, Row, Col, Divider, message } from 'antd';

const { Text } = Typography;

const ProjectModal = ({ project, onProjectChanged, mode = 'create', buttonStyle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const isEdit = mode === 'edit';
 
  useEffect(() => {
    if (isModalOpen && isEdit && project) {
      form.setFieldsValue(project);
    }
  }, [isModalOpen, isEdit, project, form]);

  const showModal = () => setIsModalOpen(true);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const url = isEdit ? `/api/v2/Project/${project.id}` : '/api/v2/Project';
      const method = isEdit ? 'put' : 'post';

      await axiosClient({
        method,
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setIsModalOpen(false);
      form.resetFields();
      
      if (onProjectChanged) onProjectChanged();
    } catch (error) {
      console.error(`Lỗi khi ${isEdit ? 'cập nhật' : 'tạo'} project:`, error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
       <Button
        type={'primary'}
        onClick={showModal}
        style={buttonStyle} 
      >
        {isEdit ? 'Edit Project' : 'Create Project'}
      </Button>

      <Modal
        title={isEdit ? 'Edit Project' : 'Create Project'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={{ 'aria-label': 'Custom Close Button' }}
      >
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
        >
          <Form.Item
            label="Project name"
            name="name"
            rules={[{ required: true, message: 'Please input project name!' }]}
          >
            <Input placeholder="Input project name" />
          </Form.Item>

          <Form.Item
            label="Province"
            name="province"
            rules={[{ required: true, message: 'Please input province!' }]}
          >
            <Input placeholder="Input province" />
          </Form.Item>

          <Form.Item
            label="Company name"
            name="companyName"
            rules={[{ required: true, message: 'Please input company name!' }]}
          >
            <Input placeholder="Input company name" />
          </Form.Item>

          {!isEdit && (
            <Form.Item
              label="Contractor name"
              name="contractorName"
              rules={[{ required: true, message: 'Please input contractor name!' }]}
            >
              <Input placeholder="Input contractor name" />
            </Form.Item>
          )}
        </Form>

        {isEdit && project && (
          <>
            <Divider />
            <Row gutter={[16, 8]}>
              <Col span={8}><Text strong>Created by:</Text></Col>
              <Col span={16}><Text>{project.createdBy}</Text></Col>

              <Col span={8}><Text strong>Data size:</Text></Col>
              <Col span={16}><Text>{project.sizeUnit}</Text></Col>

              <Col span={8}><Text strong>Total area:</Text></Col>
              <Col span={16}><Text>{project.totalArea}</Text></Col>
            </Row>
          </>
        )}
      </Modal>
    </>
  );
};

export default ProjectModal;
