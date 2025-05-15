import axios from 'axios';
import { useState } from 'react';
import { Button, Modal, Form, Input } from 'antd';

const EditProject = ({ onProject, onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  const showModal = () => {
    setIsModalOpen(true);
    if (onProject){
        form.setFieldsValue(onProject);
    }
    console.log(onProject)
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!onProject?.id) {
        throw new Error('Không tìm thấy ID của project cần cập nhật');
      }

      await axios.put(`http://localhost:3001/data/${onProject.id}`, {
        ...values,
        id: onProject.id // giữ lại id để không mất key
      });

      setIsModalOpen(false);
      form.resetFields();

      // Gọi callback để cập nhật danh sách
      if (onProjectCreated) {
        onProjectCreated();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật project:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <>
        <div >
            <Button type="primary" onClick={showModal}>
                Edit
            </Button>
        </div>
        <Modal
            title="Edit Project"
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
                label="province"
                name="province"
                rules={[{ required: true, message: 'Please input your province!' }]}
            >
                <Input placeholder='Input province'/>
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

export default EditProject;