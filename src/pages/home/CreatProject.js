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
      await axios.post('http://localhost:3001/data', values);
      setIsModalOpen(false);
      form.resetFields();

      // Gọi callback để cập nhật danh sách
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
                label="Age"
                name="age"
                rules={[{ required: true, message: 'Please input your age!' }]}
            >
                <Input placeholder='Input Age'/>
            </Form.Item>

            <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
            >
                <Input placeholder='Input Addrress'/>
            </Form.Item>
        </Form>
        </Modal>
    </>
  );
};

export default CreateProject;