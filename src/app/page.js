'use client';

import { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SpeedIcon from '@mui/icons-material/Speed';
import ApiIcon from '@mui/icons-material/Api';

export default function HomePage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <Box sx={{ bgcolor: '#0D0F1F', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hero Section */}
      <Box sx={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', px: 4, position: 'relative',
        background: 'radial-gradient(circle at top, rgba(122, 79, 217, 0.3), transparent)'
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h2" fontWeight="bold" gutterBottom sx={{
            background: 'linear-gradient(90deg, #7A4FD9, #6C63FF)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontSize: '3.5rem'
          }}>
            Pay once, use forever
          </Typography>
          <Typography variant="h5" color="grey.400" sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
            Get started with our AI chat app today and experience the power of AI in your conversations!
          </Typography>
        </motion.div>

        {/* Pricing Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button onClick={() => setBillingCycle('monthly')} sx={{ color: billingCycle === 'monthly' ? '#7A4FD9' : 'grey.400' }}>Monthly</Button>
          <Button onClick={() => setBillingCycle('annually')} sx={{ color: billingCycle === 'annually' ? '#7A4FD9' : 'grey.400' }}>Annually</Button>
        </Box>

        {/* Pricing Cards */}
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: 'Basic', price: '$0', features: ['AI chatbot', 'Personalized recommendations'], color: '#FFD700' },
            { title: 'Premium', price: '$9.99', features: ['Advanced AI chatbot', 'Priority support'], color: '#7A4FD9' },
            { title: 'Enterprise', price: 'Request a Demo', features: ['Custom AI chatbot', 'Advanced analytics'], color: '#FF4500' },
          ].map((plan, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                bgcolor: '#1C1E30', color: 'white', borderRadius: 4,
                boxShadow: '0px 0px 15px rgba(108, 99, 255, 0.2)',
                transition: '0.3s',
                '&:hover': { boxShadow: '0px 0px 25px rgba(108, 99, 255, 0.6)' }
              }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: plan.color }}>{plan.title}</Typography>
                  <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>{plan.price}</Typography>
                  <Button variant="contained" sx={{ mt: 2, bgcolor: plan.color }}>Get Started</Button>
                  <ul>
                    {plan.features.map((feature, i) => (
                      <li key={i} style={{ color: 'grey.400', marginTop: '10px' }}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Why Choose Stratus?
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {[
            { title: 'No Setup Required', description: 'No VPS. No downloads. Start botting instantly.', icon: <CloudDoneIcon fontSize="large" sx={{ color: '#7A4FD9' }} /> },
            { title: 'Unlimited Scalability', description: 'Run multiple tasks across powerful cloud servers.', icon: <SpeedIcon fontSize="large" sx={{ color: '#7A4FD9' }} /> },
            { title: 'Powerful API', description: 'Seamless automation integration with your setup.', icon: <ApiIcon fontSize="large" sx={{ color: '#7A4FD9' }} /> },
            { title: 'AI Optimization', description: 'Our AI helps optimize your botting efficiency.', icon: <AutoAwesomeIcon fontSize="large" sx={{ color: '#7A4FD9' }} /> },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Box sx={{
                  bgcolor: '#1C1E30', color: 'white', p: 4, borderRadius: 4,
                  boxShadow: '0px 0px 15px rgba(108, 99, 255, 0.2)',
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0px 0px 25px rgba(108, 99, 255, 0.6)' }
                }}>
                  {feature.icon}
                  <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mt: 1 }}>{feature.description}</Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Stratus in Numbers
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { label: 'Successful Tasks', value: '500K+' },
            { label: 'Users Worldwide', value: '10K+' },
            { label: 'Supported Sites', value: '250+' },
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{
                bgcolor: '#1C1E30', p: 4, borderRadius: 4,
                textAlign: 'center', boxShadow: '0px 0px 15px rgba(122, 79, 217, 0.3)',
              }}>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#7A4FD9' }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" sx={{ color: 'grey.400' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}