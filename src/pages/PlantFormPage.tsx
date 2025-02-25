import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import PlantForm from '../components/PlantForm';

const PlantFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  return (
    <Box>
      <PlantForm isEdit={isEdit} />
    </Box>
  );
};

export default PlantFormPage;
