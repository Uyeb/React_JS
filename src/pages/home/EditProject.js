import axios from 'axios';
import { useState } from 'react';
import { Button, Modal, Form, Input, Typography, Row, Col, Divider } from 'antd';

const EditProject = ({ onProject, onProjectCreated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Text } = Typography; 


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

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

      await axios.put(`/api/v2/Project/${onProject.id}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyNWJkYjFjLTU4MmItNGMyYy1hODc1LTMxYzJlODViZDU2NyIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJNYWxtZSIsImVtYWlsIjoiYWRtaW5AbWFsbWUubmV0IiwidXNlcm5hbWUiOiJhZG1pbkBtYWxtZS5uZXQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3NDcyOTA0OTcsImV4cCI6MTc0NzMyMDQ5NywiaWF0IjoxNzQ3MjkwNDk3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjU1MDAifQ.BBvxHt-3ICk_hb_Cgdcd-eU_D659arjedJwOiM8Ex2U'
      }
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
                label="Company name"
                name="companyName"
                rules={[{ required: true, message: 'Please input your companyName!' }]}
            >
                <Input placeholder='Input companyName'/>
            </Form.Item>
            
            <Divider />

             <Row gutter={[16, 8]}>
              <Col span={8}><Text strong>Create by :</Text></Col>
              <Col span={16}><Text>{onProject.createdBy}</Text></Col>

              <Col span={8}><Text strong>Data size :</Text></Col>
              <Col span={16}><Text>{onProject.sizeUnit}</Text></Col>

              <Col span={8}><Text strong>Total area :</Text></Col>
              <Col span={16}><Text>{onProject.totalArea}</Text></Col>
            </Row>



        </Form>
        </Modal>
    </>
  );
};

export default EditProject;