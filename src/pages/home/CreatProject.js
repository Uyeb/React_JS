import axios from 'axios';
import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

const CreateProject = ({ onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const showModal = () => {
    setIsModalOpen(true);
  };

   const handleOk = async () => {
  try {
    const values = await form.validateFields();

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    await axios.post('/api/v2/Project', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyNWJkYjFjLTU4MmItNGMyYy1hODc1LTMxYzJlODViZDU2NyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJNYWxtZSIsImVtYWlsIjoiYWRtaW5AbWFsbWUubmV0IiwidXNlcm5hbWUiOiJhZG1pbkBtYWxtZS5uZXQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDcyOTA0OTcsImV4cCI6MTc0NzMyMDQ5NywiaWF0IjoxNzQ3MjkwNDk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAifQ.BBvxHt-3ICk_hb_Cgdcd-eU_D659arjedJwOiM8Ex2U'
      }
    });

    setIsModalOpen(false);
    form.resetFields();
    if (onProjectCreated) {
      onProjectCreated();
    }
  } catch (error) {
    console.error('Lỗi khi thêm project:', error);
  }
};

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
        <div style={{ display: "flex", justifyContent: "end", margin: "1rem"}} >
            <Button type="primary" onClick={showModal}>
                Creat Project
            </Button>
        </div>
        <Modal
            title="Create Project"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
                form= { form }
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
            >
            <Form.Item
                label="Project name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input placeholder='Input Project name'/>
            </Form.Item>

            <Form.Item
                label="Province name"
                name="province"
                rules={[{ required: true, message: 'Please input your province!' }]}
            >
                <Input placeholder='Input Province name'/>
            </Form.Item>

            <Form.Item
                label="Company name"
                name="companyName"
                rules={[{ required: true, message: 'Please input your Company name!' }]}
            >
                <Input placeholder='Input companyName'/>
            </Form.Item>

            <Form.Item
                label="Contractor name"
                name="contractorName"
                rules={[{ required: true, message: 'Please input your Contractor name!' }]}
            >
                <Input placeholder='Input contractorName'/>
            </Form.Item>
        </Form>
        </Modal>
    </>
  );
};

export default CreateProject;